import * as React from 'react';

const editActions=require('../../actions/edit');

import Select from './util/select';
import Switch from './util/switch';

export interface IPropEditMode{
    // TODO
    edit: any;
}
export default class EditMode extends React.Component<IPropEditMode, {}>{
    render(){
        const edit=this.props.edit;
        const contents=[
            {
                key:"pen",
                value:"ペンモード"
            },
            {
                key:"eraser",
                value:"イレイサーモード"
            },
            {
                key:"hand",
                value:"ハンドモード"
            },
            {
                key:"spuit",
                value:"スポイト"
            }
        ], contents2=[
            {
                key: "1",
                value: "ステージ1"
            },
            {
                key: "2",
                value: "ステージ2"
            },
            {
                key: "3",
                value: "ステージ3"
            },
            {
                key: "4",
                value: "ステージ4"
            }
        ];
        const mode_valueLink = {
            value: edit.mode,
            requestChange: (key: string)=>{
                editActions.changeMode({
                    mode: key
                });
            }
        };
        const grid_valueLink = {
            value: edit.grid,
            requestChange: (grid: boolean)=>{
                editActions.changeGrid({
                    grid
                });
            }
        };
        const stage_valueLink = {
            value: String(edit.stage),
            requestChange: (key: string)=>{
                editActions.changeStage({
                    stage: Number(key),
                });
            },
        };

        let renderSwitch;
        if(this.props.edit.screen === 'layer'){
            let vl = {
                value: edit.render_map,
                requestChange: (key: boolean)=>{
                    editActions.changeRenderMode({
                        render_map: key
                    });
                },
            };
            renderSwitch=<Switch label="マップも表示" valueLink={vl}/>;
        }else{
            let vl = {
                value: edit.render_layer,
                requestChange: (key: boolean)=>{
                    editActions.changeRenderMode({
                        render_layer: key
                    });
                },
            };
            renderSwitch=<Switch label="背景レイヤーも表示" valueLink={vl}/>;
        }
        return <div className="me-core-edit-mode">
            <div>
                <Select contents={contents} valueLink={mode_valueLink}/>
            </div>
            <div>
                <Switch label="グリッドを表示" valueLink={grid_valueLink}/>
            </div>
            <div>
                {renderSwitch}
            </div>
            <div>
                <Select contents={contents2} valueLink={stage_valueLink}/>
            </div>
        </div>
    }
}
