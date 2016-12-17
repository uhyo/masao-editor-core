import * as React from 'react';

import Promise from '../../scripts/promise';

import * as chip from '../../scripts/chip';
import * as util from '../../scripts/util';
import loadImage from '../../scripts/load-image';

import Resizable from './util/resizable';
import Scroll from './util/scroll';

import * as editActions from '../../actions/edit';

import { EditState } from '../../stores/edit';
import { ParamsState } from '../../stores/params';
import { ProjectState } from '../../stores/project';

export interface IPropChipSelect{
    // 画像ファイル
    pattern: string;
    mapchip: string;
    chips: string;

    params: ParamsState;
    edit: EditState;
    project: ProjectState;
}
export default class ChipSelect extends React.Component<IPropChipSelect, {}>{
    constructor(props: IPropChipSelect){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }
    private images: {
        pattern: HTMLImageElement;
        mapchip: HTMLImageElement;
        chips: HTMLImageElement;
    };
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
    }
    componentDidUpdate(prevProps: IPropChipSelect){
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
        }else if(prevProps.edit.screen!==this.props.edit.screen || prevProps.project.version!==this.props.project.version || prevProps.edit.stage!==this.props.edit.stage || prevProps.edit.chipselect_width!==this.props.edit.chipselect_width || prevProps.edit.chipselect_height!==this.props.edit.chipselect_height || prevProps.edit.chipselect_scroll!==this.props.edit.chipselect_scroll){
            this.draw(true);
        }else if(prevProps.edit.pen!==this.props.edit.pen || prevProps.edit.pen_layer!==this.props.edit.pen_layer){
            this.draw(false);
        }
    }
    draw(full: boolean){
        if(this.images == null){
            return;
        }
        const {
            params,
            edit: {
                screen,
                chipselect_width,
                chipselect_height,
                chipselect_scroll,
            },
            project: {
                version,
            }
        } = this.props;

        if(full){
            //チップセットを書き換える
            const canvas = this.refs['canvas'] as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx == null){
                return;
            }
            //まず背景を塗る
            ctx.fillStyle = util.stageBackColor(params, this.props.edit);
            ctx.fillRect(0,0,canvas.width,canvas.height);

            let x=0, y=0, i=chipselect_width*chipselect_scroll;
            if(this.props.edit.screen==="layer"){
                //レイヤー描画
                let mapchip=this.images.mapchip;
                while(i < 256 && y < chipselect_height*32){
                    ctx.drawImage(mapchip, (i & 15)*32, (i >> 4)*32, 32, 32, x, y, 32, 32);
                    i++;
                    x+=32;
                    if(x+32 > chipselect_width*32){
                        x=0;
                        y+=32;
                    }
                }
            }else{
                while(i < chip.chipList.length && y < chipselect_height*32){
                    let c=chip.chipList[i];
                    if(version!=='2.8' || (c!=='{' && c!=='[' && c!==']' && c!=='<' && c!=='>')){
                        chip.drawChip(ctx, this.images, params, c, x, y, false);
                    }
                    i++;
                    x+=32;
                    if(x+32 > chipselect_width*32){
                        x=0;
                        y+=32;
                    }
                }
            }
        }

        //下のやつも描画
        const canvas=this.refs['canvas2'] as HTMLCanvasElement;
        const ctx=canvas.getContext('2d');
        if (ctx == null){
            return;
        }
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
    }
    render(){
        const {
            screen,
            chipselect_width,
            chipselect_height,
            chipselect_scroll,
        } = this.props.edit;
        // var w= screen==="layer" ? 16 : 8;
        const ks=Object.keys(chip.chipTable);
        // var h= screen==="layer" ? Math.ceil(256/w) : Math.ceil(ks.length/w);
        let pen, name;
        if(screen === 'layer'){
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

        const w = chipselect_width * 32;
        const allh = Math.ceil(this.chipNumber() / chipselect_width);
        const h = chipselect_height * 32;

        const scrollHeight = Math.max(0, allh - chipselect_height);

        const chipselectedStyle = {
            width: `${w}px`,
        };
        return <div className={`me-core-chip-select ${c}`}>
            <div className="me-core-chip-list">
                <Scroll x={0} y={chipselect_scroll} width={chipselect_width} height={scrollHeight} screenX={chipselect_width} screenY={chipselect_height} disableX disableY={scrollHeight === 0} onScroll={this.handleScroll}>
                    <Resizable width={w} height={h} grid={{x: 32, y: 32}} onResize={this.handleResize}>
                        <canvas ref="canvas" width={w} height={h} onClick={this.handleClick}/>
                    </Resizable>
                </Scroll>
            </div>
            <div className="me-core-chip-selected" style={chipselectedStyle}>
                <div className="me-core-chip-selected-d">
                    <p>選択中： <code>{pen}</code> {name}</p>
                </div>
                <div className="me-core-chip-selected-c">
                    <canvas ref="canvas2" width="96" height="64"/>
                </div>
            </div>
        </div>;
    }
    // チップの数
    private chipNumber(){
        const {
            screen,
        } = this.props.edit;
        if (screen === 'layer'){
            return 256;
        }else{
            return Object.keys(chip.chipTable).length;
        }
    }
    handleResize(width: number, height: number){
        const {
            chipselect_width,
            chipselect_height,
            chipselect_scroll,
        } = this.props.edit;

        const newwidth = width/32;
        const newheight = height/32;
        editActions.changeChipselectSize({width: newwidth, height: newheight});
        // scroll量を調整する
        const curi = chipselect_width * chipselect_scroll;
        const allh = Math.ceil(this.chipNumber() / chipselect_width);

        const newscroll = newwidth>0 ? Math.min(Math.max(0, allh - newheight), Math.floor(curi / newwidth)) : 0;

        editActions.changeChipselectScroll({y: newscroll});
    }
    handleScroll(_: number, y: number){
        editActions.changeChipselectScroll({y});
    }
    handleClick<T>(e: React.MouseEvent<T>){
        //canvasをクリックした
        const {
            chipselect_width,
            chipselect_scroll,
        } = this.props.edit;

        const {target, pageX, pageY} = e;
        const {x: tx, y: ty} = util.getAbsolutePosition(target as HTMLElement);
        const x=pageX-tx, y=pageY-ty;

        const penidx = Math.floor(x/32) + (Math.floor(y/32) + chipselect_scroll)*chipselect_width;
        console.log(penidx, Math.floor(x/32), Math.floor(y/32), chipselect_scroll, chipselect_width);

        if(this.props.edit.screen==="layer"){
            editActions.changePenLayer({
                pen: penidx===0 ? ".." : ("0"+penidx.toString(16)).slice(-2),
            });
        }else{
            editActions.changePen({
                pen: chip.chipList[penidx],
            });
        }
        e.preventDefault();
    }
}
