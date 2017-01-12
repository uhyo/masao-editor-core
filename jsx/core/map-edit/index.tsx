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
import {
    StageData,
    LastUpdateData,
} from '../../../stores/map';
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

    stage: StageData;
    lastUpdate: LastUpdateData;

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
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount(){
        const {
            stage,
            edit: {
                view_width,
                view_height,
            },
        } = this.props;

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
        this.updator_map = new MapUpdator(stage.size.x, stage.size.y, this.chipPollution.bind(this, 'map'));
        this.updator_layer = new MapUpdator(stage.size.x, stage.size.y, this.chipPollution.bind(this, 'layer'));
        this.backlayer_map = new BackLayer(stage.size.x, stage.size.y, 32, this.updator_map, this.drawChipOn.bind(this, 'map'));
        this.backlayer_layer = new BackLayer(stage.size.x, stage.size.y, 32, this.updator_layer, this.drawChipOn.bind(this, 'layer'));

        // timers
        this.timers = new Timers();

        // draw grids
        const ctx = (this.refs['canvas2'] as HTMLCanvasElement).getContext('2d');
        if (ctx == null){
            return;
        }
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
        if (prevProps.lastUpdate !== this.props.lastUpdate){
            // mapのupdateがあったから反応
            this.updateBacklayer(this.props.lastUpdate);
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
            stage,
        } = this.props;
        this.updator_map.resetMap(stage.map);
        this.updator_layer.resetMap(stage.layer);
    }
    /* TODO */
    updateBacklayer(lastUpdate: LastUpdateData){
        // map storeのlastUpdateを見てbacklayerをアップデートする
        if (lastUpdate == null){
            return;
        }
        const {
            stage: {
                map,
                layer,
            },
        } = this.props;
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
                    stage,

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

            const mapData=stage.map, layerData=stage.layer;

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
                ctx.save();
                ctx.globalAlpha = screen === 'layer' ? 1 : 0.5;
                backlayer_layer.copyTo(ctx, scroll_x, scroll_y, view_width, view_height, 0, 0);
                ctx.restore();
            }
            if (screen === 'map' || render_map === true){
                ctx.save();
                ctx.globalAlpha = screen === 'map' ? 1 : 0.5;
                backlayer_map.copyTo(ctx, scroll_x, scroll_y, view_width, view_height, 0, 0);
                ctx.restore();
            }

            this.drawing=false;
            console.timeEnd("draw");
        });
    }
    drawChip(ctx: CanvasRenderingContext2D, c: number, x: number, y: number): void{
        if(c == null){
            return;
        }
        chip.drawChip(ctx, this.images, this.props.params, c, x, y, true);
    }
    drawLayer(ctx: CanvasRenderingContext2D , c: number, x: number, y: number): void{
        //レイヤ
        if(c === 0){ 
            return;
        }
        const sx = (c&15)*32, sy = Math.floor(c>>4)*32;
        ctx.drawImage(this.images.mapchip, sx, sy, 32, 32, x, y, 32, 32);
    }
    drawChipOn(type: 'map' | 'layer', ctx: CanvasRenderingContext2D, x: number, y: number){
        // 指定された座標に描画
        const {
            stage,
            edit: {
                scroll_x,
                scroll_y,
                view_width,
                view_height,
            },
        } = this.props;
        if (type === 'map'){
            const c = stage.map[y][x];
            this.drawChip(ctx, c, x*32, y*32);
        }else if (type === 'layer'){
            const c = stage.layer[y][x];
            this.drawLayer(ctx, c, x*32, y*32);
        }
    }
    chipPollution(type: 'map' | 'layer', c: number): Rect{
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
            edit: {
                view_width,
                view_height,
                scroll_x,
                scroll_y,
                grid,
            },
            stage: {
                size,
            },
        } = this.props;
        const width = view_width*32;
        const height = view_height*32;

        const style = {
            // width: width+"px"
        };
        const c2style = {
            opacity: grid ? 1 : 0
        };

        // TODO
        return <div className={styles.wrapper} style={style}>
            <Scroll width={size.x-view_width} height={size.y-view_height}
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
    handleResize(widthr: number, heightr: number){
        const {
            stage: {
                size,
            },
            edit,
        } =this.props;
        const width = Math.floor(widthr/32);
        const height = Math.floor(heightr/32);
        editActions.changeView({
            width,
            height,
        });
        editActions.scroll({
            x: Math.max(0, Math.min(edit.scroll_x, size.x - width)),
            y: Math.max(0, Math.min(edit.scroll_y, size.y - height)),
        });
    }
    handleScroll(x: number, y: number){
        editActions.scroll({
            x,
            y,
        });
    }
    handleMouseDown<T>(e: React.MouseEvent<T>){
        const {
            edit,
            stage,
        } = this.props;
        //マウスが下がった
        e.preventDefault();
        const {
            x:canvas_x,
            y:canvas_y,
        } = util.getAbsolutePosition(this.refs['canvas2'] as HTMLCanvasElement);
        const mx = Math.floor((e.pageX-canvas_x)/32);
        const my = Math.floor((e.pageY-canvas_y)/32);
        const {
            screen,
        } = edit;

        let mode: editActions.ChangeModeAction['mode'];
        if(e.button===0){
            //左クリック
            mode = edit.mode;
        }else if(e.button===1){
            //中クリック
            mode="hand";
        }else if(e.button===2){
            //右クリック
            mode="eraser";
        }else{
            return;
        }
        if(mode === 'spuit'){
            //スポイトは1回限り
            const mxx = mx+edit.scroll_x;
            const myy = my+edit.scroll_y;
            if(screen ==='layer'){
                const map = stage.layer;
                const c = map[myy] ? map[myy][mxx] || 0 : 0;
                editActions.changePenLayer({
                    pen: c,
                    mode: true,
                });
            }else{
                const map = stage.map;
                let c = map[myy] ? map[myy][mxx] || 0 : 0;
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
        const {
            x:canvas_x,
            y:canvas_y,
        } = util.getAbsolutePosition(this.refs['canvas2'] as HTMLCanvasElement);

        const mx = Math.floor((pageX-canvas_x)/32);
        const my = Math.floor((pageY-canvas_y)/32);

        const {
            edit,
            stage,
        } = this.props;
        const {
            screen,
        } = edit;

        const mapdata = screen==='layer' ? stage.layer : stage.map;
        let pen = screen==='layer' ? edit.pen_layer : edit.pen;
        let pen_default = 0;

        if(mode==="pen"){
            //ペンモード
            //座標
            const cx = mx+edit.scroll_x;
            const cy = my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!==pen){
                (screen==='layer' ? mapActions.updateLayer : mapActions.updateMap)({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: pen
                });
            }
        }else if(mode==='eraser'){
            //イレイサーモード
            const cx = mx+edit.scroll_x;
            const cy = my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!==pen_default){
                (screen==='layer' ? mapActions.updateLayer : mapActions.updateMap)({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: pen_default
                });
            }
        }else if(mode==='hand'){
            //ハンドモード（つかんでスクロール）
            let sx = edit.mouse_sx-mx+edit.scroll_sx;
            let sy = edit.mouse_sy-my+edit.scroll_sy;
            if(sx < 0){
                sx=0;
            }else if(sx > stage.size.x-edit.view_width){
                sx = stage.size.x - edit.view_width;
            }
            if(sy < 0){
                sy=0;
            }else if(sy > stage.size.y-edit.view_height){
                sy = stage.size.y - edit.view_height;
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


