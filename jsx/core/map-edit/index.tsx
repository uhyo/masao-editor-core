"use strict";
import * as React from 'react';

import Resizable from '../util/resizable';
import Scroll from '../util/scroll';
import MousePad, {
    MousePadEvent,
} from '../util/mousepad';

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

import {
    Mode,
    ToolState,
    CursorState,
} from '../../../actions/edit';
import { EditState } from '../../../stores/edit';
import {
    StageData,
    LastUpdateData,
} from '../../../stores/map';
import { ParamsState } from '../../../stores/params';
import { ProjectState } from '../../../stores/project';

import * as editLogics from '../../../logics/edit';

import propChanged from '../util/changed';

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

    /**
     * Whether this component should fit the parent in y-axis.
     */
    'fit-y'?: boolean;

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
        this.handleMouseUp = this.handleMouseUp.bind(this);
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
            this.resetBacklayer(false);
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
        const canvas2 = this.refs['canvas2'] as HTMLCanvasElement;
        const ctx = canvas2.getContext('2d');
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

        this.resetMap(false);
    }
    componentWillUnmount(){
        this.timers.clean();
        // cancel requestAnimationFrame
        if (this.drawRequest != null) {
            cancelAnimationFrame(this.drawRequest);
        }
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
                this.resetBacklayer(true);
                this.draw();
            });
        }
        let pe=prevProps.edit, e=this.props.edit;
        if (pe.stage !== e.stage){
            this.resetMap(true);
            this.resetBacklayer(true);
            this.draw();
            return;
        }
        if (prevProps.lastUpdate !== this.props.lastUpdate){
            // mapのupdateがあったから反応
            this.updateBacklayer(this.props.lastUpdate);
            this.draw();
        }

        if(pe.screen !== e.screen){
            this.draw();
            return;
        }
        if (prevProps.params !== this.props.params){
            this.draw();
            return;
        }
        if (propChanged(pe, e, [
            'render_map',
            'render_layer',
            'scroll_x',
            'scroll_y',
            'view_width',
            'view_height',
            'tool',
        ])){
            this.draw();
        }
        if (cursorChanged(pe.cursor, e.cursor)){
            this.draw();
        }

        function cursorChanged(c1: CursorState | null, c2: CursorState | null): boolean{
            if (c1 === c2){
                return false;
            }
            if (c1 == null){
                return c2!.type === 'main';
            }
            if (c2 == null){
                return c1.type === 'main';
            }
            return c1.type === 'main' || c2.type === 'main';
        }
    }
    resetBacklayer(size: boolean){
        if (size){
            const {
                stage: {
                    size: {
                        x,
                        y,
                    },
                },
            } = this.props;
            this.backlayer_map.resize(x, y);
            this.backlayer_layer.resize(x, y);
        }else{
            this.backlayer_map.clear();
            this.backlayer_layer.clear();
        }

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
    resetMap(size: boolean){
        const {
            stage: {
                size: {
                    x,
                    y,
                },
                map,
                layer,
            },
        } = this.props;
        if (size){
            this.updator_map.resize(x, y);
            this.updator_layer.resize(x, y);
        }
        this.updator_map.resetMap(map);
        this.updator_layer.resetMap(layer);
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
                this.resetMap(lastUpdate.size);
                this.resetBacklayer(lastUpdate.size);
                console.log('reset');
                break;
            }
            case 'map':
            case 'layer': {
                const {
                    stage,
                    x,
                    y,
                    width,
                    height,
                } = lastUpdate;
                if (this.props.edit.stage !== stage){
                    // 違うステージの話だった
                    return;
                }
                if (lastUpdate.type === 'map'){
                    const points = this.updator_map.update(x, y, width, height, map);
                    this.backlayer_map.update(points);
                }else{
                    const points = this.updator_layer.update(x, y, width, height, layer);
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
            this.drawRequest = null;
            if (process.env.NODE_ENV !== 'production'){
                console.time("draw");
            }

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

                tool,
                cursor,
            } = edit;
            const ctx = (this.refs['canvas'] as HTMLCanvasElement).getContext("2d");
            if (ctx == null){
                return;
            }

            const width=view_width*32;
            const height=view_height*32;

            // バックバッファで描画
            if (screen === 'map' || render_map === true){
                backlayer_map.prerender(scroll_x, scroll_y, view_width, view_height);
            }
            if (screen === 'layer' || render_layer === true){
                backlayer_layer.prerender(scroll_x, scroll_y, view_width, view_height);
            }

            // 全体をクリア
            ctx.clearRect(0, 0, width, height);

            // ステージ範囲を背景色で塗りつぶす
            const bgc = util.cssColor(util.stageBackColor(params, edit));
            ctx.fillStyle = bgc;
            const fillLeft = Math.max(0, -scroll_x*32);
            const fillTop = Math.max(0, -scroll_y*32);
            const fillWidth = Math.min(width - fillLeft, (stage.size.x - scroll_x)*32);
            const fillHeight = Math.min(height - fillTop, (stage.size.y - scroll_y)*32);
            ctx.fillRect(fillLeft, fillTop, fillWidth, fillHeight);
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

            if (tool && tool.type === 'rect'){
                const {
                    start_x,
                    start_y,
                    end_x,
                    end_y,
                } = tool;

                // 四角形ツールのアレを描画
                const pcl = util.cssColor(util.complementColor(util.stageBackColor(params, edit)));

                ctx.save();
                ctx.fillStyle = pcl;
                ctx.strokeStyle = pcl;

                const left = Math.min(start_x, end_x);
                const top = Math.min(start_y, end_y);
                const right = Math.max(start_x, end_x);
                const bottom = Math.max(start_y, end_y);

                const sx = (left - scroll_x) * 32;
                const sy = (top - scroll_y) * 32;
                const w = (right - left) * 32 + 31;
                const h = (bottom - top) * 32 + 31;

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + w, sy);
                ctx.lineTo(sx + w, sy + h);
                ctx.lineTo(sx, sy + h);
                ctx.closePath();

                ctx.globalAlpha = 0.25;
                ctx.fill();
                ctx.globalAlpha = 0.75;
                ctx.stroke();

                ctx.restore();
            }
            if (cursor && cursor.type === 'main'){
                const {
                    x,
                    y,
                } = cursor;

                // カーソルがあるので描画
                const pcl = util.cssColor(util.complementColor(util.stageBackColor(params, edit)));

                ctx.save();
                ctx.strokeStyle = pcl;

                const sx = (x - scroll_x) * 32 + 0.5;
                const sy = (y - scroll_y) * 32 + 0.5;

                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + 31, sy);
                ctx.lineTo(sx + 31, sy + 31)
                ctx.lineTo(sx, sy + 31);
                ctx.closePath();

                ctx.stroke();

                ctx.restore();
            }
            this.drawing=false;
            if (process.env.NODE_ENV !== 'production'){
                console.timeEnd("draw");
            }
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
            'fit-y': fity,
        } = this.props;
        const width = view_width*32;
        const height = view_height*32;

        const c2style = {
            opacity: grid ? 1 : 0
        };

        const scrollWidth = Math.max(0, size.x - view_width);
        const scrollHeight = Math.max(0, size.y - view_height);

        // TODO
        return (<div
            ref="focusarea"
            className={fity ? styles.wrapperFitY : styles.wrapper}
            tabIndex={0}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
        >
            <Scroll
                width={scrollWidth}
                height={scrollHeight}
                fit-x
                fit-y={fity}
                x={scroll_x} y={scroll_y}
                screenX={view_width}
                screenY={view_height}
                onScroll={this.handleScroll}>
                <Resizable
                    width={width}
                    height={height}
                    minWidth={32}
                    minHeight={32}
                    grid={{x: 32, y: 32}}
                    fit-x
                    fit-y={fity}
                    onResize={this.handleResize}
                >
                    <div className={styles.canvasWrapper}>
                        <canvas ref="canvas" width={width} height={height}/>
                        <MousePad
                            onMouseDown={this.handleMouseDown}
                            onMouseMove={this.handleMouseMove}
                            onMouseUp={this.handleMouseUp}
                            >
                            <canvas ref="canvas2"
                                className={styles.overlapCanvas}
                                style={c2style}
                                width={width}
                                height={height}
                                onContextMenu={this.handleContextMenu}
                                />
                        </MousePad>
                    </div>
                </Resizable>
            </Scroll>
        </div>);
    }
    handleResize(widthr: number, heightr: number){
        const width = Math.ceil(widthr/32);
        const height = Math.ceil(heightr/32);
        // if calculated view is different, then update.
        if (width !== this.props.edit.view_width || height !== this.props.edit.view_height) {
            editLogics.changeView({
                width,
                height,
            });
        }
    }
    handleScroll(x: number, y: number){
        editLogics.scroll({
            x,
            y,
        });
    }
    handleMouseDown({target, elementX, elementY, button, preventDefault}: MousePadEvent){
        //マウスが下がった

        const canvas2 = this.refs['canvas2'] as HTMLCanvasElement;
        if (target !== canvas2){
            preventDefault();
            return;
        }
        (this.refs.focusarea as HTMLElement).focus();

        const {
            edit,
        } = this.props;

        const mx = Math.floor(elementX/32);
        const my = Math.floor(elementY/32);

        let mode: Mode;
        if(button===0 || button==null){
            //左クリック
            mode = edit.mode;
        }else if(button===1){
            //中クリック
            mode="hand";
        }else if(button===2){
            //右クリック
            mode="eraser";
        }else{
            return;
        }

        editLogics.mouseDown(mode, mx, my);
    }
    handleMouseMove({elementX, elementY}: MousePadEvent){
        this.mouseMoves(this.props.edit.tool, elementX, elementY);
    }
    handleMouseUp(){
        editLogics.mouseUp();
    }
    mouseMoves(tool: ToolState | null, elementX: number, elementY: number){
        const mx = Math.floor(elementX/32);
        const my = Math.floor(elementY/32);

        editLogics.mouseMove(mx, my, tool);
    }
    handleContextMenu<T>(e: React.MouseEvent<T>){
        e.preventDefault();
    }
    handleFocus(){
        editLogics.focus('main');
    }
    handleBlur(){
        editLogics.blur('main');
    }
}


