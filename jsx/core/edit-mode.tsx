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
                label:"ペンモード"
            },
            {
                key:"eraser",
                label:"イレイサーモード"
            },
            {
                key:"hand",
                label:"ハンドモード"
            },
            {
                key:"spuit",
                label:"スポイト"
            }
        ];
        const contents2=[];
        const stage_number = Number(params['stage_max']);
        for (let i = 1; i <= stage_number; i++){
            contents2.push({
                key: String(i),
                label: `ステージ${i}`,
            });
        }
        const mode_change = (key: editActions.ChangeModeAction['mode'])=>{
            editActions.changeMode({
                mode: key
            });
        };
        const stage_change = (key: string)=>{
            editActions.changeStage({
                stage: Number(key),
            });
        };

        let renderSwitch;
        if(this.props.edit.screen === 'layer'){
            const onChange = (key: boolean)=>{
                editActions.changeRenderMode({
                    render_map: key
                });
            };
            renderSwitch=<Switch label="マップも表示" value={edit.render_map} onChange={onChange}/>;
        }else{
            const onChange = (key: boolean)=>{
                editActions.changeRenderMode({
                    render_layer: key
                });
            };
            renderSwitch=<Switch label="背景レイヤーも表示" value={edit.render_layer} onChange={onChange}/>;
        }
        const grid_change = (grid: boolean)=>{
            editActions.changeGrid({
                grid,
            });
        };
        return <div className={style.wrapper}>
            <div>
                <Select contents={contents} value={edit.mode} onChange={mode_change}/>
            </div>
            <div>
                <Switch label="グリッドを表示" value={edit.grid} onChange={grid_change}/>
            </div>
            <div>
                {renderSwitch}
            </div>
            <div>
                <Select contents={contents2} value={String(edit.stage)} onChange={stage_change}/>
            </div>
        </div>
    }
}
