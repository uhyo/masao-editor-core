var React=require('react');

var util=require('../../scripts/util'),
    chip=require('../../scripts/chip');

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
            React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
        ).isRequired
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
            //bg
            let bgc=util.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_g);
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            //draw
            for(let y=0;y < 30;y++){
                let a=map[y];
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
            //スクロールビュー
            let wkc=util.cssColor(255-params.backcolor_r, 255-params.backcolor_g, 255-params.backcolor_b);
            ctx.strokeStyle=wkc;
            ctx.lineWidth=1;
            ctx.strokeRect(edit.scroll_x*2+0.5, edit.scroll_y*2+0.5, 31, 19);
            this.drawing=false;
        });
    },
    render(){
        return <canvas ref="canvas" width="360" height="60"/>;
    }
});
