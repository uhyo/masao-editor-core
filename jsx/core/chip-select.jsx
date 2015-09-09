"use strict";
var React=require('react');

var Promise=require('native-promise-only');
var chip=require('../../scripts/chip'),
    util=require('../../scripts/util'),
    loadImage=require('../../scripts/load-image');

var editActions=require('../../actions/edit');

module.exports = React.createClass({
    displayName: "ChipSelect",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        chips: React.PropTypes.string.isRequired,

        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired
    },
    componentDidMount(){
        Promise.all([loadImage(this.props.pattern), loadImage(this.props.chips)])
        .then(([pattern, chips])=>{
            this.images = {
                pattern,
                chips
            };
            this.draw(true);
        });
    },
    componentDidUpdate(prevProps){
        if(prevProps.pattern!==this.props.pattern || prevProps.chips!==this.props.chips){
            Promise.all([loadImage(this.props.pattern), loadImage(this.props.chips)])
            .then(([pattern, chips])=>{
                this.images = {
                    pattern,
                    chips
                };
                this.draw(true);
            });
        }else if(prevProps.edit.pen!==this.props.edit.pen){
            this.draw(false);
        }
    },
    draw(full){
        var params=this.props.params;
        if(full){
            //チップセットを書き換える
            let canvas=React.findDOMNode(this.refs.canvas);
            let ctx=canvas.getContext('2d');
            //まず背景を塗る
            ctx.fillStyle = util.cssColor(params.backcolor_r, params.backcolor_g, params.backcolor_b);
            ctx.fillRect(0,0,canvas.width,canvas.height);

            let x=0,y=0,i=0;
            while(i < chip.chipList.length){
                chip.drawChip(ctx,this.images,params,chip.chipList[i],x,y,false);
                i++;
                x+=32;
                if(x+32 > canvas.width){
                    x=x%canvas.width;
                    y+=32;
                }
            }
        }

        //下のやつも描画
        let canvas=React.findDOMNode(this.refs.canvas2);
        let ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        chip.drawChip(ctx,this.images,params,this.props.edit.pen, 32,0,true);
    },
    render(){
        var w=8;
        var ks=Object.keys(chip.chipTable);
        var h=Math.ceil(ks.length/w);
        var pen=this.props.edit.pen;
        var name=null;
        let t=chip.chipFor(this.props.params,pen);
        if(t!=null){
            name=t.name;
        }
        return <div className="me-core-chip-select">
            <div className="me-core-chip-list">
                <canvas ref="canvas" width={w*32} height={h*32} onClick={this.handleClick}/>
            </div>
            <div className="me-core-chip-selected">
                <div className="me-core-chip-selected-c">
                    <canvas ref="canvas2" width="96" height="64"/>
                </div>
                <div className="me-core-chip-selected-d">
                    <p>選択中： <code>{pen}</code> {name}</p>
                </div>
            </div>
        </div>;
    },
    handleClick(e){
        //canvasをクリックした
        var {target, pageX, pageY} = e;
        var {offsetLeft, offsetTop}= target;
        var x=pageX-offsetLeft, y=pageY-offsetTop;
        var ks=Object.keys(chip.chipTable);

        var haba = Math.floor(target.width/32);
        var penidx = Math.floor(x/32) + Math.floor(y/32)*haba;

        editActions.changePen({
            pen: chip.chipList[penidx]
        });
        e.preventDefault();
    }
});
