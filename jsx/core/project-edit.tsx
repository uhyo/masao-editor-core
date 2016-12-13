import * as React from 'react';

const projectActions: any = require('../../actions/project');

import Select from './util/select';

export interface IPropProjectEdit{
    project: any;
}
export default class ProjectEdit extends React.Component<IPropProjectEdit, {}>{
    render(){
        const project=this.props.project;
        const contents=[
            {
                key: "2.8",
                value: "2.8"
            },
            {
                key: "fx16",
                value: "FX"
            },
            {
                key: "kani2",
                value: "MasaoKani2"
            }
        ], valueLink={
            value: project.version,
            requestChange:(version: string)=>{
                projectActions.changeVersion({version});
            }
        };
        return <div>
            <p>正男のバージョンを以下から選択してください：</p>
            <Select contents={contents} valueLink={valueLink}/>
        </div>
    }
}
