"use strict";
var React=require('react');

import Resizable from './util/resizable';
import Scroll from './util/scroll';

import Timers from '../../scripts/timers';
import BackLayer from '../../scripts/backlayer';

var Promise=require('native-promise-only');
var util=require('../../scripts/util');

var chip=require('../../scripts/chip'),
    loadImage=require('../../scripts/load-image');

var editActions=require('../../actions/edit'),
    mapActions=require('../../actions/map');


module.exports = React.createClass({
    displayName: "MapEdit",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        mapchip: React.PropTypes.string.isRequired,
        chips: React.PropTypes.string.isRequired,

        map: React.PropTypes.shape({
            map: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.arrayOf(
                        React.PropTypes.string.isRequired
                    ).isRequired
                ).isRequired
            ).isRequired,
            layer: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.arrayOf(
                        React.PropTypes.string.isRequired
                    ).isRequired
                ).isRequired
            ).isRequired
        }),
        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired,
        project: React.PropTypes.object.isRequired
    },
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
        this.backlayer_map = new BackLayer(180, 30, 32, this.drawChipOn.bind(this, 'map'));
        this.backlayer_layer = new BackLayer(180, 30, 32, this.drawChipOn.bind(this, 'layer'));

        // timers
        this.timers = new Timers();

        // draw grids
        let ctx=this.refs.canvas2.getContext('2d');
        let {view_width, view_height} = this.props.edit;
        ctx.strokeStyle="rgba(0,0,0,.25)";
        for(let x=1;x < view_width; x++){
            ctx.beginPath();
            ctx.moveTo(x*32,0);
            ctx.lineTo(x*32,view_height*32);
            ctx.stroke();
        }
        for(let y=1;y < view_height; y++){
            ctx.beginPath();
            ctx.moveTo(0,y*32);
            ctx.lineTo(view_width*32,y*32);
            ctx.stroke();
        }
    },
    componentWillUnmount(){
        this.timer.clean();
    },
    componentDidUpdate(prevProps){
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
        if(prevProps.edit.screen!==this.props.edit.screen){
            this.draw();
            return;
        }
        if(this.props.edit.screen==="map" && prevProps.map.map!==this.props.map.map ||
           this.props.edit.screen==="layer" && prevProps.map.layer!==this.props.map.layer ||
           prevProps.params!==this.props.params ||
           prevProps.edit.render_map!==this.props.edit.render_map ||
           prevProps.edit.render_layer!==this.props.edit.render_layer){
            this.draw();
        }else{
            let pe=prevProps.edit, e=this.props.edit;
            if(pe.scroll_x!==e.scroll_x ||
               pe.scroll_y!==e.scroll_y ||
               pe.stage!==e.stage ||
               pe.view_width!==e.view_width ||
               pe.view_height!==e.view_height){
                this.draw();
            }
        }
    },
    resetBacklayer(){
        this.backlayer_map.clear();
        this.backlayer_layer.clear();

        const expandMap = ()=>{
            this.timers.addTimer('expand-map', 400, ()=>{
                const flag = this.backlayer_map.expand();
                if (flag){
                    expandMap();
                }else{
                    expandLayer();
                }
            });
        };
        const expandLayer = ()=>{
            this.timers.addTimer('expand-map', 400, ()=>{
                const flag = this.backlayer_layer.expand();
                if (flag){
                    expandLayer();
                }
            });
        };
        expandMap();
    },
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
            const ctx=this.refs.canvas.getContext("2d");

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
    },
    drawChip(ctx,c,x,y){
        if(c==null){
            return;
        }
        chip.drawChip(ctx,this.images,this.props.params,c,x,y,true);
    },
    drawLayer(ctx,c,x,y){
        //レイヤ
        if(c===".."){
            return;
        }
        let idx=parseInt(c,16);
        let sx=(idx&15)*32, sy=Math.floor(idx>>4)*32;
        ctx.drawImage(this.images.mapchip, sx, sy, 32, 32, x, y, 32, 32);
    },
    drawChipOn(type, ctx, x, y, dx, dy){
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
    },
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
        return <div className="me-core-map-edit" style={style}>
            <Scroll width={180-view_width} height={30-view_height}
                x={scroll_x} y={scroll_y}
                screenX={view_width}
                screenY={view_height}
                onScroll={this.handleScroll}>
                <Resizable width={width} height={height} minWidth={32} minHeight={32} grid={{x: 32, y: 32}} onResize={this.handleResize}>
                    <div className="me-core-map-edit-canvas-wrapper">
                        <canvas ref="canvas" width={width} height={height}/>
                        <canvas ref="canvas2" className="me-core-map-edit-canvas2" style={c2style} width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.props.edit.mouse_down===true ? this.handleMouseMove : null} onContextMenu={this.handleContextMenu}/>
                    </div>
                </Resizable>
            </Scroll>
        </div>;
    },
    handleResize(width, height){
        editActions.changeView({
            width: Math.floor(width/32),
            height: Math.floor(height/32),
        });
    },
    handleScroll(x, y){
        editActions.scroll({
            x,
            y,
        });
    },
    handleMouseDown(e){
        //マウスが下がった
        e.preventDefault();
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(this.refs.canvas2);
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
                    mode: true
                });
            }else{
                let map=this.props.map.map;
                let c=map[stage-1][myy] ? map[stage-1][myy][mxx] || "." : ".";
                editActions.changePen({
                    pen: c,
                    mode: true
                });
            }
        }
        editActions.mouseDown({x: mx, y: my, mode});
        if(mode!=="hand"){
            this.mouseMoves(mode, e.pageX, e.pageY);
        }

        //マウスが上がったときの処理
        var mouseUpHandler=(e)=>{
            editActions.mouseUp();
            //上がったらおわり
            document.body.removeEventListener("mouseup",mouseUpHandler,false);
        };
        document.body.addEventListener("mouseup",mouseUpHandler,false);
    },
    handleMouseMove(e){
        e.preventDefault();
        this.mouseMoves(this.props.edit.mode_current, e.pageX, e.pageY);
    },
    mouseMoves(mode,pageX,pageY){
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(this.refs.canvas2);
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
    },
    handleContextMenu(e){
        e.preventDefault();
    }
});

