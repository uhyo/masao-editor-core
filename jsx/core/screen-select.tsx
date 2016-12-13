import * as React from 'react';

// TODO
const editActions: any = require('../../actions/edit');

import Select from './util/select';

export interface IPropScreenSelect{
    edit: any;
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
            requestChange: (key: string)=>{
                editActions.changeScreen({
                    screen: key
                });
            }
        };
        return <div className="me-core-screen-select">
            <Select contents={contents} valueLink={valueLink}/>
        </div>
    }
}

