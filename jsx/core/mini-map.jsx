var React=require('react');

var util=require('../../scripts/util'),
    chip=require('../../scripts/chip');

var editActions=require('../../actions/edit');

//色の対応
var colors={
    masao: "#ff0000",
    block: "#800000",
    enemy: "#00ee00",
    athletic: "#aadddd",
    bg: "#eeeeee",
    water: "#0000ff",
    item: "#ffff00"
};

module.exports = React.createClass({
    displayName: "MiniMap",
    propTypes: {
        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired,
        map: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.string.isRequired
                ).isRequired
            ).isRequired
        ).isRequired,
    },
    getInitialState(){
        return {
            mouse_down: false
        };
    },
    componentDidMount(){
        this.drawing=false;
        this.draw();
    },
    componentDidUpdate(){
        this.draw();
    },
    draw(){
        if(this.drawing===true){
            return;
        }
        this.drawing=true;
        requestAnimationFrame(()=>{
            let canvas=React.findDOMNode(this.refs.canvas), ctx=canvas.getContext('2d');
            let params=this.props.params, edit=this.props.edit, map=this.props.map;
            let mapdata=map[edit.stage-1];
            //bg
            let bgc=util.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_b);
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            //draw
            for(let y=0;y < 30;y++){
                let a=mapdata[y];
                for(let x=0;x < 180;x++){
                    let c=a[x], t=chip.chipTable[c];
                    if(t){
                        let cl=colors[t.category];
                        if(cl){
                            ctx.fillStyle=cl;
                            ctx.fillRect(x*2,y*2,2,2);
                        }
                    }
                }
            }
            //グリッド
            if(edit.grid===true){
                ctx.strokeStyle="rgba(0,0,0,.15)";
                ctx.lineWidth=1;
                for(let y=edit.view_height;y < 60; y+=edit.view_height){
                    ctx.beginPath();
                    ctx.moveTo(0,y*2);
                    ctx.lineTo(canvas.width,y*2);
                    ctx.stroke();
                }
                for(let x=edit.view_width;x < 180; x+=edit.view_width){
                    ctx.beginPath();
                    ctx.moveTo(x*2,0);
                    ctx.lineTo(x*2,canvas.height);
                    ctx.stroke();
                }
            }
            //スクロールビュー
            let wkc=util.cssColor(255-params.backcolor_r, 255-params.backcolor_g, 255-params.backcolor_b);
            ctx.strokeStyle=wkc;
            ctx.lineWidth=1;
            ctx.strokeRect(edit.scroll_x*2+0.5, edit.scroll_y*2+0.5, edit.view_width*2-1, edit.view_height*2-1);
            this.drawing=false;
        });
    },
    render(){
        var mousemove=null;
        if(this.state.mouse_down===true){
            mousemove=this.handleMouseMove;
        }
        return <canvas ref="canvas" width="360" height="60" onMouseDown={this.handleMouseDown} onMouseMove={mousemove}/>;
    },
    handleMouseDown(e){
        this.setState({
            mouse_down: true
        });
        this.handleMouseMove(e);

        var handler=(e)=>{
            e.preventDefault();
            this.setState({
                mouse_down: false
            });
            document.removeEventListener("mouseup",handler,false);
        };
        document.addEventListener("mouseup",handler,false);
    },
    handleMouseMove(e){
        var edit=this.props.edit;
        e.preventDefault();
        //canvasの位置
        let {x:left, y:top} = util.getAbsolutePosition(React.findDOMNode(this.refs.canvas));
        let mx=e.pageX-left, my=e.pageY-top;
        //そこを中心に
        let sx=Math.floor((mx-edit.view_width)/2), sy=Math.floor((my-edit.view_height)/2);
        if(sx<0){
            sx=0;
        }else if(sx>164){
            sx=164;
        }
        if(sy<0){
            sy=0;
        }else if(sy>20){
            sy=20;
        }
        editActions.scroll({
            x: sx,
            y: sy
        });
    },
});
