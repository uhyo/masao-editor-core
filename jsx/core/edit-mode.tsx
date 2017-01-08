import * as React from 'react';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';
import { ParamsState } from '../../stores/params';

import Select from './util/select';
import Switch from './util/switch';

import * as style from './css/edit-mode.css';

export interface IPropEditMode{
    edit: EditState;
    params: ParamsState;
}
export default class EditMode extends React.Component<IPropEditMode, {}>{
    render(){
        const {
            edit,
            params,
        } = this.props;
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
        ];
        const contents2=[];
        const stage_number = Number(params['stage_max']);
        for (let i = 1; i <= stage_number; i++){
            contents2.push({
                key: String(i),
                value: `ステージ${i}`,
            });
        }
        const mode_valueLink = {
            value: edit.mode,
            requestChange: (key: editActions.ChangeModeAction['mode'])=>{
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
        return <div className={style.wrapper}>
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
