var React=require('react');

var chip=require('../../scripts/chip'),
    loadImage=require('../../scripts/load-image');

module.exports = React.createClass({
    displayName: "ChipSelect",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        params: React.PropTypes.object.isRequired
    },
    componentDidMount(){
        loadImage(this.props.pattern)
        .then((img)=>{
            this.pattern = img;
            this.draw();
        });
    },
    componentDidUpdate(){
        this.draw();
    },
    draw(){
        var params=this.props.params;
        var canvas=React.findDOMNode(this.refs.canvas);
        var ctx=canvas.getContext('2d');
        //まず背景を塗る
        ctx.fillStyle = chip.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_g);
        ctx.fillRect(0,0,canvas.width,canvas.height);

        var ks=Object.keys(chip.chipTable);
        var x=0,y=0,i=0;
        while(i < ks.length){
            chip.drawChip(ctx,this.pattern,ks[i],x,y);
            i++;
            x+=32;
            if(x+32 > canvas.width){
                x=x%canvas.width;
                y+=32;
            }
        }
    },
    render(){
        var w=8;
        var ks=Object.keys(chip.chipTable);
        var h=Math.ceil(ks.length/w);
        return <div className="me-core-chip-select">
            <canvas ref="canvas" width={w*32} height={h*32}/>
        </div>;
    }
});
