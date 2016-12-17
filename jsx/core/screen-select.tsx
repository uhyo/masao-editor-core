import * as React from 'react';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';

import Select from './util/select';

export interface IPropScreenSelect{
    edit: EditState;
}
export default class ScreenSelect extends React.Component<IPropScreenSelect, {}>{
    render(){
        const edit=this.props.edit;
        const contents=[
            {
                key:"map",
                value:"マップ編集"
            },
            {
                key:"layer",
                value:"背景レイヤー編集"
            },
            {
                key:"params",
                value:"param編集"
            },
            {
                key:"project",
                value:"プロジェクト設定"
            }
        ];
        const valueLink={
            value: this.props.edit.screen,
            requestChange: (key: 'map' | 'layer' | 'params' | 'project')=>{
                editActions.changeScreen({
                    screen: key,
                });
            }
        };
        return <div>
            <Select contents={contents} valueLink={valueLink}/>
        </div>
    }
}

