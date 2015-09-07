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
        map: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
        ).isRequired,
        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired,

        width: React.PropTypes.number,
        height: React.PropTypes.number
    },
    getDefaultProps(){
        return {
            width: 15,
            height: 10
        };
    },
    componentDidMount(){
        //flags
        this.drawing=false;
        this.drawRequest=null;
        //load files
        var pattern=loadImage(this.props.pattern);
        pattern.then((img)=>{
            this.images={
                pattern: img
            };
            this.draw();
        });
    },
    componentDidUpdate(){
        this.draw();
    },
    draw(){
        if(this.drawing===true){
            return;
        }
        this.drawing=true;
        this.drawRequest=requestAnimationFrame(()=>{
            var {width, height} = this.getCanvasSize();
            var map=this.props.map, params=this.props.params, edit=this.props.edit;
            var {scroll_x, scroll_y} = edit;
            var ctx=React.findDOMNode(this.refs.canvas).getContext("2d");

            /////draw
            //background color
            //TODO: ステージ対応
            ctx.fillStyle=chip.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_b);
            ctx.fillRect(0,0,width,height);
            //map
            for(let x=0;x < width; x++){
                for(let y=0;y < height; y++){
                    //TODO
                    let mx=scroll_x+x, my=scroll_y+y;
                    if(map[my]==null){
                        //領域外。TODO
                        continue;
                    }
                    let c=map[my][mx];
                    if(c==null){
                        //TODO
                        continue;
                    }
                    this.drawChip(ctx,c,x*32, y*32);
                }
            }
            if(edit.grid){
                //グリッドを描画
                ctx.strokeStyle="rgba(0,0,0,.2)";
                for(let x=1;x < width; x++){
                    ctx.beginPath();
                    ctx.moveTo(x*32,0);
                    ctx.lineTo(x*32,height);
                    ctx.stroke();
                }
                for(let y=1;y < height; y++){
                    ctx.beginPath();
                    ctx.moveTo(0,y*32);
                    ctx.lineTo(width,y*32);
                    ctx.stroke();
                }
            }
            this.drawing=false;
        });
    },
    drawChip(ctx,c,x,y){
        //x,yにchipを描画
        chip.drawChip(ctx,this.images.pattern,c,x,y);
    },
    render(){
        var {width, height} = this.getCanvasSize();
        return <div className="me-core-map-edit">
            <canvas ref="canvas" width={width} height={height} onMouseDown={this.handleMouseDown} onMouseMove={this.props.edit.mouse_down===true ? this.handleMouseMove : null}/>
        </div>;
    },
    getCanvasSize(){
        return {
            width: this.props.width*32,
            height: this.props.height*32
        };
    },
    handleMouseDown(e){
        //マウスが下がった
        e.preventDefault();
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(React.findDOMNode(this.refs.canvas));
        var mx=Math.floor((e.pageX-canvas_x)/32), my=Math.floor((e.pageY-canvas_y)/32);
        editActions.mouseDown({x: mx, y: my});

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
        var {x:canvas_x, y:canvas_y} = util.getAbsolutePosition(React.findDOMNode(this.refs.canvas));
        var mx=Math.floor((e.pageX-canvas_x)/32), my=Math.floor((e.pageY-canvas_y)/32);


        var edit=this.props.edit, map=this.props.map;

        if(edit.mode==="pen"){
            //ペンモード
            //座標
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(map[cy] && map[cy][cx]!==edit.pen){
                mapActions.updateMap({
                    x: cx,
                    y: cy,
                    chip: edit.pen
                });
            }
        }else if(edit.mode==="eraser"){
            //イレイサーモード
            let cx=mx+edit.scroll_x, cy=my+edit.scroll_y;
            //違ったらイベント発行
            if(map[cy] && map[cy][cx]!=="."){
                mapActions.updateMap({
                    x: cx,
                    y: cy,
                    chip: "."
                });
            }
        }else if(edit.mode==="hand"){
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
            console.log(mx,my,sx,sy);
            if(sx!==edit.scroll_x || sy!==edit.scroll_y){
                editActions.scroll({
                    x: sx,
                    y: sy
                });
            }
        }
    },
});

