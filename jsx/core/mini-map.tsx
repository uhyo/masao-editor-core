import * as React from 'react';

import * as util from '../../scripts/util';
import * as chip from '../../scripts/chip';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';
import { ParamsState } from '../../stores/params';
import { MapState } from '../../stores/map';

//色の対応
const colors: Record<string, string> = {
    masao: "#ff0000",
    block: "#800000",
    enemy: "#00ee00",
    athletic: "#aadddd",
    bg: "#eeeeee",
    water: "#0000ff",
    item: "#ffff00"
};

export interface IPropMiniMap{
    params: ParamsState;
    edit: EditState;
    map: MapState;
}
interface IStateMiniMap{
    mouse_down: boolean;
}
export default class MiniMap extends React.Component<IPropMiniMap, IStateMiniMap>{
    private drawing: boolean;
    constructor(props: IPropMiniMap){
        super(props);

        this.state = {
            mouse_down: false,
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    componentDidMount(){
        this.drawing=false;
        this.draw();
    }
    componentDidUpdate(){
        this.draw();
    }
    draw(){
        if(this.drawing===true){
            return;
        }
        this.drawing=true;
        requestAnimationFrame(()=>{
            const canvas=this.refs['canvas'] as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx == null){
                return;
            }
            const {
                params,
                edit,
                map: {
                    data,
                },
            } = this.props;
            const mapdata = data[edit.stage-1].map;
            //bg
            const bgc=util.stageBackColor(params, edit);
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,canvas.width,canvas.height);

            //draw
            for(let y=0; y < 30; y++){
                const a = mapdata[y];
                for(let x=0; x < 180; x++){
                    const c = a[x], t = chip.chipTable[c];
                    if(t){
                        const {
                            category,
                        } = t;
                        const cl = category && colors[category];
                        if(cl){
                            ctx.fillStyle = cl;
                            ctx.fillRect(x*2, y*2, 2, 2);
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
            let wkc=util.cssColor(255-Number(params['backcolor_red']), 255-Number(params['backcolor_green']), 255-Number(params['backcolor_blue']));
            ctx.strokeStyle=wkc;
            ctx.lineWidth=1;
            ctx.strokeRect(edit.scroll_x*2+0.5, edit.scroll_y*2+0.5, edit.view_width*2-1, edit.view_height*2-1);
            this.drawing=false;
        });
    }
    render(){
        const mousemove = this.state.mouse_down ? this.handleMouseMove : void 0;
        return <canvas ref="canvas" width="360" height="60" onMouseDown={this.handleMouseDown} onMouseMove={mousemove}/>;
    }
    handleMouseDown<T>(e: React.MouseEvent<T>){
        this.setState({
            mouse_down: true
        });
        this.handleMouseMove(e);

        const handler=(e: MouseEvent)=>{
            e.preventDefault();
            this.setState({
                mouse_down: false
            });
            document.removeEventListener("mouseup",handler,false);
        };
        document.addEventListener("mouseup",handler,false);
    }
    handleMouseMove<T>(e: React.MouseEvent<T>){
        const edit=this.props.edit;
        e.preventDefault();
        //canvasの位置
        const {x:left, y:top} = util.getAbsolutePosition(this.refs['canvas'] as HTMLCanvasElement);
        const mx=e.pageX-left, my=e.pageY-top;
        //そこを中心に
        let sx=Math.floor((mx-edit.view_width)/2), sy=Math.floor((my-edit.view_height)/2);

        // 右と下の上限 (TODO)
        const r = 180 - edit.view_width;
        const b = 30 - edit.view_height;
        if(sx < 0){
            sx = 0;
        }else if(sx > r){
            sx = r;
        }
        if(sy < 0){
            sy = 0;
        }else if(sy > b){
            sy = b;
        }
        editActions.scroll({
            x: sx,
            y: sy
        });
    }
}
