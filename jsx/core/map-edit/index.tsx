"use strict";
import * as React from 'react';

import Resizable from '../util/resizable';
import Scroll from '../util/scroll';

import Timers from '../../../scripts/timers';
import BackLayer from './backlayer';
import MapUpdator from './updator';

import Promise from '../../../scripts/promise';
import * as util from '../../../scripts/util';

import * as chip from '../../../scripts/chip';
import loadImage from '../../../scripts/load-image';

import * as styles from './index.css';

import {
    Rect,
} from '../../../scripts/rect';

import * as editActions from '../../../actions/edit';
import * as mapActions from '../../../actions/map';
import { EditState } from '../../../stores/edit';
import { MapState } from '../../../stores/map';
import { ParamsState } from '../../../stores/params';
import { ProjectState } from '../../../stores/project';

/**
 * 画像リソースたち
 */
interface Images{
    pattern: HTMLImageElement;
    mapchip: HTMLImageElement;
    chips: HTMLImageElement;
}

export interface IPropMapEdit{
    pattern: string;
    mapchip: string;
    chips: string;

    map: MapState;
    params: ParamsState;
    edit: EditState;
    project: ProjectState;
}
export default class MapEdit extends React.Component<IPropMapEdit, {}>{
    /**
     * 描画処理が走っているか
     */
    private drawing: boolean;
    /**
     * 画像リソース
     */
    private images: Images;
    /**
     * requestAnimationFrameの返り値
     */
    private drawRequest: any;

    /**
     * マップのupdator
     */
    private updator_map: MapUpdator;
    /**
     * 背景レイヤーのupdator
     */
    private updator_layer: MapUpdator;
    /**
     * マップのbacklayer
     */
    private backlayer_map: BackLayer;
    /**
     * 背景レイヤーのbacklayer
     */
    private backlayer_layer: BackLayer;
    /**
     * タイマー
     */
    private timers: Timers;
    constructor(props: IPropMapEdit){
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount(){
        // flags
        this.drawing=false;
        this.drawRequest=null;
        // load files
        Promise.all([loadImage(this.props.pattern), loadImage(this.props.mapchip), loadImage(this.props.chips)])
        .then(([pattern, mapchip, chips])=>{
            this.images={
                pattern,
                mapchip,
                chips
            };
            this.resetBacklayer();
            this.draw();
        });
        // double-buffering 
        // TODO
        this.updator_map = new MapUpdator(180, 30, this.chipPollution.bind(this, 'map'));
        this.updator_layer = new MapUpdator(180, 30, this.chipPollution.bind(this, 'layer'));
        this.backlayer_map = new BackLayer(180, 30, 32, this.updator_map, this.drawChipOn.bind(this, 'map'));
        this.backlayer_layer = new BackLayer(180, 30, 32, this.updator_layer, this.drawChipOn.bind(this, 'layer'));

        // timers
        this.timers = new Timers();

        // draw grids
        const ctx = (this.refs['canvas2'] as HTMLCanvasElement).getContext('2d');
        if (ctx == null){
            return;
        }
        const {view_width, view_height} = this.props.edit;
        ctx.strokeStyle="rgba(0,0,0,.25)";
        for(let x=1; x < view_width; x++){
            ctx.beginPath();
            ctx.moveTo(x*32, 0);
            ctx.lineTo(x*32, view_height*32);
            ctx.stroke();
        }
        for(let y=1; y < view_height; y++){
            ctx.beginPath();
            ctx.moveTo(0,y*32);
            ctx.lineTo(view_width*32,y*32);
            ctx.stroke();
        }

        this.resetMap();
    }
    componentWillUnmount(){
        this.timers.clean();
    }
    componentDidUpdate(prevProps: IPropMapEdit){
        //書き換える
        if(prevProps.pattern!==this.props.pattern || prevProps.mapchip!==this.props.mapchip || prevProps.chips!==this.props.chips){
            //画像の再読み込みが必要
            Promise.all([loadImage(this.props.pattern), loadImage(this.props.mapchip), loadImage(this.props.chips)])
            .then(([pattern, mapchip, chips])=>{
                this.images = {
                    pattern,
                    mapchip,
                    chips
                };
                this.resetBacklayer();
                this.draw();
            });
        }
        let pe=prevProps.edit, e=this.props.edit;
        if(pe.screen !== e.screen){
            this.draw();
            return;
        }
        if (prevProps.params !== this.props.params){
            this.draw();
            return;
        }
        if (pe.stage !== e.stage){
            this.resetMap();
            this.resetBacklayer();
            this.draw();
            return;
        }
        if (prevProps.map.lastUpdate !== this.props.map.lastUpdate){
            // mapのupdateがあったから反応
            this.updateBacklayer(this.props.map.lastUpdate);
            this.draw();
        }else{
            if(pe.render_map!==e.render_map ||
               pe.render_layer!==e.render_layer ||
               pe.scroll_x!==e.scroll_x ||
               pe.scroll_y!==e.scroll_y ||
               pe.view_width!==e.view_width ||
               pe.view_height!==e.view_height){
                this.draw();
            }
        }
    }
    resetBacklayer(){
        this.backlayer_map.clear();
        this.backlayer_layer.clear();

        const expandMap = ()=>{
            this.timers.addTimer('expand-map', 1000, ()=>{
                const flag = this.backlayer_map.expand();
                if (flag){
                    expandMap();
                }else{
                    expandLayer();
                }
            });
        };
        const expandLayer = ()=>{
            this.timers.addTimer('expand-map', 1000, ()=>{
                const flag = this.backlayer_layer.expand();
                if (flag){
                    expandLayer();
                }
            });
        };
        expandMap();
    }
    resetMap(){
        const {
            edit: {
                stage,
            },
            map: {
                map,
                layer,
            },
        } = this.props;
        this.updator_map.resetMap(map[stage-1]);
        this.updator_layer.resetMap(layer[stage-1]);
    }
    /* TODO */
    updateBacklayer(lastUpdate: any){
        // map storeのlastUpdateを見てbacklayerをアップデートする
        if (lastUpdate == null){
            return;
        }
        const {
            stage,
        } = this.props.edit;
        const map = this.props.map.map[stage-1];
        const layer = this.props.map.layer[stage-1];
        switch (lastUpdate.type){
            case 'all': {
                // 刷新されちゃった
                this.resetMap();
                this.resetBacklayer();
                break;
            }
            case 'map':
            case 'layer': {
                const {
                    stage,
                    x,
                    y,
                } = lastUpdate;
                if (this.props.edit.stage !== stage){
                    // 違うステージの話だった
                    return;
                }
                if (lastUpdate.type === 'map'){
                    const points = this.updator_map.update(x, y, map[y][x]);
                    this.backlayer_map.update(points);
                }else{
                    const points = this.updator_layer.update(x, y, layer[y][x]);
                    this.backlayer_layer.update(points);
                }
                break;
            }

        }
    }
    draw(){
        if(this.drawing===true){
            return;
        }
        if(this.images==null){
            return;
        }
        this.drawing=true;
        this.drawRequest=requestAnimationFrame(()=>{
            console.time("draw");

            const {
                backlayer_map,
                backlayer_layer,
                props: {
                    map,
                    params,
                    edit,
                },
            } = this;
            const {
                screen,
                scroll_x,
                scroll_y,
                view_width,
                view_height,

                render_map,
                render_layer,
            } = edit;
            const ctx = (this.refs['canvas'] as HTMLCanvasElement).getContext("2d");
            if (ctx == null){
                return;
            }

            const width=view_width*32;
            const height=view_height*32;

            const mapData=map.map[edit.stage-1], layerData=map.layer[edit.stage-1];

            // バックバッファで描画
            if (screen === 'map' || render_map === true){
                backlayer_map.prerender(scroll_x, scroll_y, view_width, view_height);
            }
            if (screen === 'layer' || render_layer === true){
                backlayer_layer.prerender(scroll_x, scroll_y, view_width, view_height);
            }

            // まず背景色で塗りつぶす
            let bgc=util.stageBackColor(params, edit);
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,width,height);
            // バックバッファから
            if (screen === 'layer' || render_layer === true){
                backlayer_layer.copyTo(ctx, scroll_x, scroll_y, view_width, view_height, 0, 0);
            }
            if (screen === 'map' || render_map === true){
                backlayer_map.copyTo(ctx, scroll_x, scroll_y, view_width, view_height, 0, 0);
            }

            this.drawing=false;
            console.timeEnd("draw");
        });
    }
    drawChip(ctx: CanvasRenderingContext2D, c: string, x: number, y: number): void{
        if(c == null){
            return;
        }
        chip.drawChip(ctx, this.images, this.props.params, c, x, y, true);
    }
    drawLayer(ctx: CanvasRenderingContext2D , c: string, x: number, y: number): void{
        //レイヤ
        if(c === '..'){ 
            return;
        }
        const idx = parseInt(c, 16);
        const sx = (idx&15)*32, sy = Math.floor(idx>>4)*32;
        ctx.drawImage(this.images.mapchip, sx, sy, 32, 32, x, y, 32, 32);
    }
    drawChipOn(type: 'map' | 'layer', ctx: CanvasRenderingContext2D, x: number, y: number){
        // 指定された座標に描画
        const {
            map: {
                map,
                layer,
            },
            edit: {
                stage,
                scroll_x,
                scroll_y,
                view_width,
                view_height,
            },
        } = this.props;
        if (type === 'map'){
            const mapData = map[stage-1];
            const c = mapData[y][x];
            this.drawChip(ctx, c, x*32, y*32);
        }else if (type === 'layer'){
            const layerData = layer[stage-1];
            const c = layerData[y][x];
            this.drawLayer(ctx, c, x*32, y*32);
        }
    }
    chipPollution(type: 'map' | 'layer', c: string): Rect{
        if (type === 'layer'){
            // layerのチップは全部普通
            return {
                minX: 0,
                minY: 0,
                maxX: 1,
                maxY: 1,
            };
        }
        const {
            params,
        } = this.props;
        // mapの場合は広い範囲に描画されるかも
        const renderRect = chip.chipRenderRect(params, c);

        // タイル単位に変換
        const updateRect = {
            minX: Math.floor(renderRect.minX / 32),
            minY: Math.floor(renderRect.minY / 32),
            maxX: Math.ceil(renderRect.maxX / 32),
            maxY: Math.ceil(renderRect.maxY / 32),
        };
        return updateRect;
    }
    render(){
        const {
            view_width,
            view_height,
            scroll_x,
            scroll_y,
        } = this.props.edit;
        var width=view_width*32, height=view_height*32;
        var style={
            // width: width+"px"
        };
        var c2style={
            opacity: this.props.edit.grid ? 1 : 0
        };

        // TODO
        return <div className={styles.wrapper}style={style}>
            <Scroll width={180-view_width} height={30-view_height}
                x={scroll_x} y={scroll_y}
                screenX={view_width}
                screenY={view_height}
                onScroll={this.handleScroll}>
                <Resizable width={width} height={height} minWidth={32} minHeight={32} grid={{x: 32, y: 32}} onResize={this.handleResize}>
                    <div className={styles.canvasWrapper}>
                        <canvas ref="canvas" width={width} height={height}/>
                        <canvas ref="canvas2" className={styles.overlapCanvas} style={c2style} width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.props.edit.mouse_down===true ? this.handleMouseMove : void 0} onContextMenu={this.handleContextMenu}/>
                    </div>
                </Resizable>
            </Scroll>
        </div>;
    }
    handleResize(width: number, height: number){
        editActions.changeView({
            width: Math.floor(width/32),
            height: Math.floor(height/32),
        });
    }
    handleScroll(x: number, y: number){
        editActions.scroll({
            x,
            y,
        });
    }
    handleMouseDown<T>(e: React.MouseEvent<T>){
        //マウスが下がった
        e.preventDefault();
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(this.refs['canvas2'] as HTMLCanvasElement);
        var mx=Math.floor((e.pageX-canvas_x)/32), my=Math.floor((e.pageY-canvas_y)/32);
        var screen=this.props.edit.screen;
        var mode;
        if(e.button===0){
            //左クリック
            mode=this.props.edit.mode;
        }else if(e.button===1){
            //中クリック
            mode="hand";
        }else if(e.button===2){
            //右クリック
            mode="eraser";
        }else{
            return;
        }
        if(mode==="spuit"){
            //スポイトは1回限り
            let edit=this.props.edit, mxx=mx+edit.scroll_x, myy=my+edit.scroll_y, stage=edit.stage;
            if(screen==="layer"){
                let map=this.props.map.layer;
                let c=map[stage-1][myy] ? map[stage-1][myy][mxx] || ".." : "..";
                editActions.changePenLayer({
                    pen: c,
                    mode: true,
                });
            }else{
                let map=this.props.map.map;
                let c=map[stage-1][myy] ? map[stage-1][myy][mxx] || "." : ".";
                editActions.changePen({
                    pen: c,
                    mode: true,
                });
            }
        }
        editActions.mouseDown({x: mx, y: my, mode});
        if(mode!=="hand"){
            this.mouseMoves(mode, e.pageX, e.pageY);
        }

        //マウスが上がったときの処理
        const mouseUpHandler=()=>{
            editActions.mouseUp({});
            //上がったらおわり
            document.body.removeEventListener("mouseup", mouseUpHandler, false);
        };
        document.body.addEventListener("mouseup", mouseUpHandler, false);
    }
    handleMouseMove<T>(e: React.MouseEvent<T>){
        e.preventDefault();
        this.mouseMoves(this.props.edit.mode_current, e.pageX, e.pageY);
    }
    mouseMoves(mode: string, pageX: number, pageY: number){
        const {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(this.refs['canvas2'] as HTMLCanvasElement);
        var mx=Math.floor((pageX-canvas_x)/32), my=Math.floor((pageY-canvas_y)/32);

        var edit=this.props.edit, map=this.props.map;
        let screen=edit.screen;
        let mapdata=screen==="layer" ? map.layer[edit.stage-1] : map.map[edit.stage-1];
        let pen=screen==="layer" ? edit.pen_layer : edit.pen, pen_default=screen==="layer" ? ".." : ".";

        if(mode==="pen"){
            //ペンモード
            //座標
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!==pen){
                (screen==="layer" ? mapActions.updateLayer : mapActions.updateMap)({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: pen
                });
            }
        }else if(mode==="eraser"){
            //イレイサーモード
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!==pen_default){
                (screen==="layer" ? mapActions.updateLayer : mapActions.updateMap)({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: pen_default
                });
            }
        }else if(mode==="hand"){
            //ハンドモード（つかんでスクロール）
            let sx=edit.mouse_sx-mx+edit.scroll_sx, sy=edit.mouse_sy-my+edit.scroll_sy;
            if(sx < 0){
                sx=0;
            }else if(sx > 165){
                sx=165;
            }
            if(sy < 0){
                sy=0;
            }else if(sy > 20){
                sy=20;
            }
            if(sx!==edit.scroll_x || sy!==edit.scroll_y){
                editActions.scroll({
                    x: sx,
                    y: sy
                });
            }
        }
    }
    handleContextMenu<T>(e: React.MouseEvent<T>){
        e.preventDefault();
    }
}


