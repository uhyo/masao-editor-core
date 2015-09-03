var React=require('react');

var Promise=require('native-promise-only');
var chip=require('../../scripts/chip'),
    loadImage=require('../../scripts/load-image');

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
    draw(){
        if(this.drawing===true){
            cancelRequestAnimationFrame(this.drawRequest);
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
            ctx.fillStyle=cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_b);
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
        });
    },
    drawChip(ctx,c,x,y){
        //x,yにchipを描画
        var t=chip.chipTable[c];
        if(t==null){
            return;
        }
        var sy=Math.floor(t.pattern/10), sx=t.pattern%10;
        //その番号を描画
        ctx.drawImage(this.images.pattern, sx*32, sy*32, 32, 32, x, y, 32,32);
    },
    render(){
        var {width, height} = this.getCanvasSize();
        return <canvas ref="canvas" width={width} height={height}/>;
    },
    getCanvasSize(){
        return {
            width: this.props.width*32,
            height: this.props.height*32
        };
    },
});

function cssColor(r,g,b){
    return `rgb(${r},${g},${b})`;
}

