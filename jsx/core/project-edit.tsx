import * as React from 'react';

import * as projectActions from '../../actions/project';
import * as mapActions from '../../actions/map';
import { ProjectState } from '../../stores/project';
import {
    MapState,
    StageData,
} from '../../stores/map';
import { EditState } from '../../stores/edit';

import Select from './util/select';
import ToggleButton from './util/toggle-button';

import propChanged from './util/changed';

import * as styles from './css/project-edit.css';

export interface IPropProjectEdit{
    project: ProjectState;
    map: MapState;
    edit: EditState;
}
export default class ProjectEdit extends React.Component<IPropProjectEdit, {}>{
    render(){
        const {
            map,
            project,
            edit,
        } = this.props;

        const versionContents = [
            {
                key: "2.8",
                label: "2.8"
            },
            {
                key: "fx16",
                label: "FX"
            },
            {
                key: "kani2",
                label: "MasaoKani2"
            }
        ], onVersionChange = (version: '2.8' | 'fx16' | 'kani2')=>{
            projectActions.changeVersion({version});
        };

        const advancedContents = [
            {
                key: 'false',
                label: '無効',
            },
            {
                key: 'true',
                label: '有効',
            },
        ], onAdvancedChange = (advanced: 'false' | 'true')=>{
            mapActions.setAdvanced({
                advanced: advanced === 'true',
            });
        };
        const advpain = map.advanced ? <AdvancedPain map={map} edit={edit}/> : null;
        return <div>
            <section className={styles.sect}>
                <h1>正男のバージョン</h1>
                <Select contents={versionContents} value={project.version} onChange={onVersionChange}/>
            </section>
            <section className={styles.sect}>
                <h1>第3版マップデータ</h1>
                <p>マップのサイズをデフォルトの180×30から変更するには、第3版マップデータを有効にしてください。</p>
                <div>
                    <Select contents={advancedContents} value={String(map.advanced)} onChange={onAdvancedChange} />
                </div>
            </section>
            {advpain}
        </div>
    }
}

interface IPropAdvancedPain{
    map: MapState;
    edit: EditState;
}
const AdvancedPain = ({map}: IPropAdvancedPain)=>{
    return <section className={styles.sect}>
        <h1>マップサイズ</h1>
        {
            Array.from(new Array(map.stages).keys()).map(i=>{
                return <div key={i}>
                    <StageSize index={Number(i)} stage={map.data[i]} />
                </div>;
            })
        }
    </section>;
};

interface IPropStageSize{
    index: number;
    stage: StageData;
}
interface IStateStageSize{
    top: number;
    right: number;
    bottom: number;
    left: number;
}
class StageSize extends React.Component<IPropStageSize, IStateStageSize>{
    constructor(props: IPropStageSize){
        super(props);
        this.state = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
    }
    componentWillReceiveProps(newProps: IPropStageSize){
        if (this.props.index !== newProps.index){
            this.setState({
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            });
            return;
        }
        const data1 = this.props.stage;
        const data2 = newProps.stage;
        if (data1 === data2){
            return;
        }

        if (propChanged(data1.size, data2.size, ['x', 'y'])){
            this.setState({
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            });
            return;
        }

    }
    render(){
        const {
            index,
            stage: {
                size,
            },
        } = this.props;
        const {
            top,
            right,
            bottom,
            left,
        } = this.state;

        const df = (num: number)=>{
            const cls =
                num < 0 ? styles.stageDiffMinus :
                num > 0 ? styles.stageDiffPlus :
                styles.stageDiff;

            return <div className={cls}>{num <= 0 ? num : `+${num}`}</div>
        };

        const saveButton = ()=>{
            console.log(this.state);
            mapActions.resizeMap({
                stage: index,
                ...this.state,
            });
        };
        return <div>
            <div>ステージ{index+1}</div>
            <div className={styles.stageControl}>
                <div className={styles.stageControlRowHor}>
                    <div className={styles.stageControlSet}>
                        <ToggleButton onClick={this.makeHandler('left', 1)}>
                            <div className={styles.stageButton}>+</div>
                        </ToggleButton>
                        {df(left)}
                        <ToggleButton onClick={this.makeHandler('left', -1)}>
                            <div className={styles.stageButton}>-</div>
                        </ToggleButton>
                    </div>
                </div>
                <div className={styles.stageControlRowVer}>
                    <div className={styles.stageControlSet}>
                        <ToggleButton onClick={this.makeHandler('top', 1)}>
                            <div className={styles.stageButton}>+</div>
                        </ToggleButton>
                        {df(top)}
                        <ToggleButton onClick={this.makeHandler('top', -1)}>
                            <div className={styles.stageButton}>-</div>
                        </ToggleButton>
                    </div>
                    <div className={styles.stageSize}>{size.x} x {size.y}</div>
                    <div className={styles.stageControlSet}>
                        <ToggleButton onClick={this.makeHandler('bottom', 1)}>
                            <div className={styles.stageButton}>+</div>
                        </ToggleButton>
                        {df(bottom)}
                        <ToggleButton onClick={this.makeHandler('bottom', -1)}>
                            <div className={styles.stageButton}>-</div>
                        </ToggleButton>
                    </div>
                </div>
                <div className={styles.stageControlRowHor2}>
                    <div className={styles.stageControlSet}>
                        <ToggleButton onClick={this.makeHandler('right', 1)}>
                            <div className={styles.stageButton}>+</div>
                        </ToggleButton>
                        {df(right)}
                        <ToggleButton onClick={this.makeHandler('right', -1)}>
                            <div className={styles.stageButton}>-</div>
                        </ToggleButton>
                    </div>
                    <div className={styles.stageButtonOk} onClick={saveButton}>
                        OK
                    </div>
                </div>
            </div>
        </div>;
    }
    private makeHandler(dir: 'top' | 'right' | 'bottom' | 'left', step :number){
        return ()=>{
            const {
                props: {
                    stage: {
                        size,
                    },
                },
                state: {
                    top,
                    right,
                    bottom,
                    left,
                },
            } = this;
            const nv = this.state[dir] + step;
            if (dir === 'top'){
                // 高さの下限
                if (nv + size.y + bottom < 10){
                    return;
                }
            }else if (dir === 'right'){
                if (left + size.x + nv < 16){
                    return;
                }
            }else if (dir === 'bottom'){
                if (top + size.y + nv < 10){
                    return;
                }
            }else if (dir === 'left'){
                if (nv + size.x + right < 16){
                    return;
                }
            }
            this.setState({
                [dir]: nv,
            } as any);
        };
    }
};
