"use strict";
var React=require('react');

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
        chips: React.PropTypes.string.isRequired,

        map: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.string.isRequired
                ).isRequired
            ).isRequired
        ).isRequired,
        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired,
    },
    componentDidMount(){
        //flags
        this.drawing=false;
        this.drawRequest=null;
        //load files
        Promise.all([loadImage(this.props.pattern), loadImage(this.props.chips)])
        .then(([pattern, chips])=>{
            this.images={
                pattern,
                chips
            };
            this.draw();
        });
        //draw grids
        let ctx=React.findDOMNode(this.refs.canvas2).getContext('2d');
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
    componentDidUpdate(prevProps){
        //書き換える
        if(prevProps.map!==this.props.map || prevProps.params!==this.props.params){
            this.draw();
        }
        let pe=prevProps.edit, e=this.props.edit;
        if(pe.scroll_x!==e.scroll_x || pe.scroll_y!==e.scroll_y || pe.stage!==e.stage){
            this.draw();
        }
    },
    draw(){
        if(this.drawing===true){
            return;
        }
        this.drawing=true;
        this.drawRequest=requestAnimationFrame(()=>{
            console.time("draw");
            var map=this.props.map, params=this.props.params, edit=this.props.edit;
            var {scroll_x, scroll_y, view_width, view_height} = edit;
            var ctx=React.findDOMNode(this.refs.canvas).getContext("2d");

            var width=view_width*32, height=view_height*32;

            /////draw
            let mapdata=map[edit.stage-1];
            //background color
            let bgc=util.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_b);
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,width,height);
            //map
            for(let x=0;x < view_width; x++){
                for(let y=0;y < view_height; y++){
                    //TODO
                    let mx=scroll_x+x, my=scroll_y+y;
                    if(mapdata[my]==null){
                        //領域外。
                        continue;
                    }
                    let c=mapdata[my][mx];
                    if(c==null){
                        //TODO
                        continue;
                    }
                    this.drawChip(ctx,c,x*32, y*32);
                }
            }
            this.drawing=false;
            console.timeEnd("draw");
        });
    },
    drawChip(ctx,c,x,y){
        //x,yにchipを描画
        chip.drawChip(ctx,this.images,this.props.params,c,x,y,true);
    },
    render(){
        var {view_width, view_height} = this.props.edit;
        var width=view_width*32, height=view_height*32;
        var style={
            width: width+"px"
        };
        var c2style={
            opacity: this.props.edit.grid ? 1 : 0
        };
        return <div className="me-core-map-edit" style={style}>
            <canvas ref="canvas" width={width} height={height}/>
            <canvas ref="canvas2" className="me-core-map-edit-canvas2" style={c2style} width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.props.edit.mouse_down===true ? this.handleMouseMove : null} onContextMenu={this.handleContextMenu}/>
        </div>;
    },
    handleMouseDown(e){
        //マウスが下がった
        e.preventDefault();
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(React.findDOMNode(this.refs.canvas2));
        var mx=Math.floor((e.pageX-canvas_x)/32), my=Math.floor((e.pageY-canvas_y)/32);
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
            let map=this.props.map, edit=this.props.edit;
            let mxx=mx+edit.scroll_x, myy=my+edit.scroll_y;
            let c=map[myy] ? map[myy][mxx] || "." : ".";
            editActions.changePen({
                pen: c,
                mode: true
            });
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
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(React.findDOMNode(this.refs.canvas2));
        var mx=Math.floor((pageX-canvas_x)/32), my=Math.floor((pageY-canvas_y)/32);

        var edit=this.props.edit, map=this.props.map;
        let mapdata=map[edit.stage-1];

        if(mode==="pen"){
            //ペンモード
            //座標
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!==edit.pen){
                mapActions.updateMap({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: edit.pen
                });
            }
        }else if(mode==="eraser"){
            //イレイサーモード
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(mapdata[cy] && mapdata[cy][cx]!=="."){
                mapActions.updateMap({
                    stage: edit.stage,
                    x: cx,
                    y: cy,
                    chip: "."
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

