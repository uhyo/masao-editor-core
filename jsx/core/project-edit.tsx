import * as React from 'react';

import * as projectActions from '../../actions/project';
import { ProjectState } from '../../stores/project';

import Select from './util/select';

import * as styles from './css/project-edit.css';

export interface IPropProjectEdit{
    project: ProjectState;
}
export default class ProjectEdit extends React.Component<IPropProjectEdit, {}>{
    render(){
        const project = this.props.project;
        const contents = [
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
            requestChange:(version: '2.8' | 'fx16' | 'kani2')=>{
                projectActions.changeVersion({version});
            }
        };
        return <div>
            <section className={styles.sect}>
                <h1>正男のバージョン</h1>
                <Select contents={contents} valueLink={valueLink}/>
            </section>
            <section className={styles.sect}>
                <h1>第3版マップデータ</h1>
                <p>マップのサイズをデフォルトの180×30から変更するには、第3版マップデータを有効にしてください。</p>
            </section>
        </div>
    }
}
