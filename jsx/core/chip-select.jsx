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
        mapchip: React.PropTypes.string.isRequired,
        chips: React.PropTypes.string.isRequired,

        params: React.PropTypes.object.isRequired,
        edit: React.PropTypes.object.isRequired,
        project: React.PropTypes.object.isRequired
    },
    componentDidMount(){
        Promise.all([loadImage(this.props.pattern), loadImage(this.props.mapchip), loadImage(this.props.chips)])
        .then(([pattern, mapchip, chips])=>{
            this.images = {
                pattern,
                mapchip,
                chips
            };
            this.draw(true);
        });
    },
    componentDidUpdate(prevProps){
        if(prevProps.pattern!==this.props.pattern || prevProps.mapchip!==this.props.mapchip || prevProps.chips!==this.props.chips){
            Promise.all([loadImage(this.props.pattern), loadImage(this.props.mapchip), loadImage(this.props.chips)])
            .then(([pattern, mapchip, chips])=>{
                this.images = {
                    pattern,
                    mapchip,
                    chips
                };
                this.draw(true);
            });
        }else if(prevProps.edit.screen!==this.props.edit.screen || prevProps.project.version!==this.props.project.version){
            this.draw(true);
        }else if(prevProps.edit.pen!==this.props.edit.pen || prevProps.edit.pen_layer!==this.props.edit.pen_layer){
            this.draw(false);
        }
    },
    draw(full){
        var params=this.props.params, screen=this.props.edit.screen;
        var version=this.props.project.version;
        if(full){
            //チップセットを書き換える
            let canvas=React.findDOMNode(this.refs.canvas);
            let ctx=canvas.getContext('2d');
            //まず背景を塗る
            ctx.fillStyle = util.cssColor(params.backcolor_red, params.backcolor_green, params.backcolor_blue);
            ctx.fillRect(0,0,canvas.width,canvas.height);

            let x=0,y=0,i=0;
            if(this.props.edit.screen==="layer"){
                //レイヤー描画
                let mapchip=this.images.mapchip;
                while(i < 256){
                    ctx.drawImage(mapchip, (i&15)*32, (i>>4)*32, 32, 32, x, y, 32, 32);
                    i++;
                    x+=32;
                    if(x+32 > canvas.width){
                        x=0;
                        y+=32;
                    }
                }
            }else{
                while(i < chip.chipList.length){
                    let c=chip.chipList[i];
                    if(version!=="2.8" || (c!=="{" && c!=="[" && c!=="]" && c!=="<" && c!==">")){
                        chip.drawChip(ctx,this.images,params,c,x,y,false);
                    }
                    i++;
                    x+=32;
                    if(x+32 > canvas.width){
                        x=0;
                        y+=32;
                    }
                }
            }
        }

        //下のやつも描画
        let canvas=React.findDOMNode(this.refs.canvas2);
        let ctx=canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(screen==="layer"){
            let pen_layer=this.props.edit.pen_layer;
            if(pen_layer!==".."){
                let idx=parseInt(pen_layer,16);
                ctx.drawImage(this.images.mapchip, (idx&15)*32, (idx>>4)*32, 32, 32, 32, 0, 32, 32);
            }
        }else{
            chip.drawChip(ctx,this.images,params,this.props.edit.pen, 32,0,true);
        }
    },
    render(){
        var screen=this.props.edit.screen;
        var w= screen==="layer" ? 16 : 8;
        var ks=Object.keys(chip.chipTable);
        var h= screen==="layer" ? Math.ceil(256/w) : Math.ceil(ks.length/w);
        var pen, name;
        if(screen==="layer"){
            pen=this.props.edit.pen_layer;
            if(pen===".."){
                name="（空白）";
            }else{
                name="("+parseInt(pen,16)+")";
            }
        }else{
            pen=this.props.edit.pen;
            let t=chip.chipFor(this.props.params,pen);
            if(t!=null){
                name=t.name;
            }
        }
        var c = screen==="layer" ? "me-core-chip-select-layer" : "me-core-chip-select-map";
        return <div className={`me-core-chip-select ${c}`}>
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
        if(this.props.edit.screen==="layer"){
            editActions.changePenLayer({
                pen: penidx===0 ? ".." : ("0"+penidx.toString(16)).slice(-2)
            });
        }else{
            editActions.changePen({
                pen: chip.chipList[penidx]
            });
        }
        e.preventDefault();
    }
});
