import * as React  from 'react';

import {
    RefluxComponent,
} from '../../scripts/reflux-util';

import * as masao from '../../scripts/masao';

export type MasaoJSONFormat = masao.format.MasaoJSONFormat;

import {
    chipToMapString,
    chipToLayerString,
} from '../../scripts/chip';

import * as editActions from '../../actions/edit';
import * as paramActions from '../../actions/params';
import * as projectActions from '../../actions/project';
import * as mapActions from '../../actions/map';
import * as keyActions from '../../actions/key';
import * as mapLogics from '../../logics/map';
import {
    Command,
} from '../../logics/command';

import mapStore, {
    MapState,
    MapStore,
} from '../../stores/map';
import paramStore, {
    ParamsState,
    ParamsStore,
} from '../../stores/params';
import editStore, {
    EditState,
    EditStore,
} from '../../stores/edit';
import projectStore, { ProjectState } from '../../stores/project';
import historyStore, { HistoryState } from '../../stores/history';
import keyStore from '../../stores/key';

import MapEdit from './map-edit/index';
import ChipSelect from './chip-select';
import EditMode from './edit-mode';
import MiniMap from './mini-map';
import ScreenSelect from './screen-select';
import ParamEdit from './param-edit';
import ProjectEdit from './project-edit';
import JSWarning from './js-warning';
import JSEdit from './js-edit';

import KeyEvent from './key-event';
import Button from './util/button';

import './css/init.css';
import * as styles from './css/index.css';

export interface IDefnMasaoEditorCore{
    map: MapState;
    params: ParamsState;
    edit: EditState;
    project: ProjectState;
    history: HistoryState;
}
export interface IPropMasaoEditorCore{
    jsWarning?: boolean;
    backupId?: string;
    filename_pattern: string;
    filename_mapchip: string;

    defaultParams?: Record<string, string>;

    // TODO
    defaultGame?: MasaoJSONFormat;
    externalCommands?: Array<{
        label: string;
        request(game: MasaoJSONFormat, states: IDefnMasaoEditorCore): void;
    }>;
}
export interface IStateMasaoEditorCore{
}
export default class MasaoEditorCore extends RefluxComponent<IDefnMasaoEditorCore, IPropMasaoEditorCore, IStateMasaoEditorCore>{
    private autosaveTimer: any = null;
    private backupField = 'masao-editor-backup';
    private backupInterval = 60000;
    constructor(props: IPropMasaoEditorCore){
        super(props, {
            map: mapStore,
            params: paramStore,
            edit: editStore,
            project: projectStore,
            history: historyStore,
        });
    }
    componentWillMount(){
        // backupがあるか?
        let g: MasaoJSONFormat | undefined = void 0;
        if ('undefined' !== typeof localStorage){
            const b = localStorage.getItem(this.backupFieldName());
            if (b){
                try {
                    g = JSON.parse(b);
                } catch(e){
                    g = void 0;
                }
            }
        }
        if (g == null){
            //default
            g = this.props.defaultGame;
        }
        if(g != null){
            this.loadGame(g);
        }
        super.componentWillMount();
    }
    componentDidMount(){
        const {
            backupId,
        } = this.props;
        if (backupId != null){
            this.autosaveTimer = setInterval(()=>{
                this.backup();
            }, this.backupInterval);
            this.backup();
        }
        super.componentDidMount();
    }
    comoponentWillUnmount(){
        if (this.autosaveTimer != null){
            clearInterval(this.autosaveTimer);
            this.clearBackup();
        }
        super.componentWillUnmount();
    }
    componentWillReceiveProps(newProps: IPropMasaoEditorCore){
        if(this.props.defaultGame !== newProps.defaultGame && newProps.defaultGame != null){
            this.loadGame(newProps.defaultGame);
        }else if(newProps.defaultGame && this.props.defaultParams !== newProps.defaultParams && newProps.defaultParams != null){
            paramActions.resetParams(newProps.defaultParams);
            mapLogics.loadParamMap(newProps.defaultParams);
            projectActions.changeVersion({version: masao.acceptVersion(newProps.defaultGame.version)});
        }
    }
    private loadGame(game: masao.format.MasaoJSONFormat){
        const version = masao.acceptVersion(game.version);
        const params = masao.param.addDefaults(game.params, version);
        const script = game.script || '';

        const advanced = game['advanced-map'] != null;

        mapActions.setAdvanced({
            advanced,
        });
        paramActions.resetParams(params);
        projectActions.changeVersion({version});

        projectActions.changeScript({
            script,
        });
        editActions.jsConfirm({
            confirm: !!script,
        });

        if (advanced){
            const a = game['advanced-map']!;
            mapLogics.loadAdvancedMap(a.stages.map((stage: any)=>{
                let map;
                let layer;
                for (let obj of stage.layers){
                    if (obj.type === 'main'){
                        map = obj.map;
                    }else if (obj.type === 'mapchip'){
                        layer = obj.map;
                    }
                }
                return {
                    size: stage.size,
                    map,
                    layer,
                };
            }));
        }else{
            mapLogics.loadParamMap(params);
        }
    }
    render(){
        const {
            map,
            params,
            edit,
            project,
            history,
        } = this.state;
        const chips: string = require('../../images/chips.png');

        let screen = null;
        if(edit.screen==="map" || edit.screen==="layer"){
            screen=<MapScreen pattern={this.props.filename_pattern} mapchip={this.props.filename_mapchip} chips={chips} map={map} params={params} edit={edit} project={project} history={history}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="project"){
            screen=<ProjectScreen project={project} map={map} edit={edit}/>;
        }else if(edit.screen==='js'){
            screen=<JsScreen jsWarning={!!this.props.jsWarning} edit={edit} project={project} />;
        }
        let external_buttons=null;
        if(this.props.externalCommands != null){
            external_buttons = this.props.externalCommands.map((com)=>{
                return <div key={com.label}>
                    <Button label={com.label} onClick={this.handleExternal(com.request)}/>
                </div>;
            });
        }
        return <div>
            <div className={styles.info}>
                <div>
                    <ScreenSelect edit={edit}/>
                </div>
                {external_buttons}
            </div>
            {screen}
        </div>;
    }
    handleExternal(req: (game: MasaoJSONFormat, obj: IDefnMasaoEditorCore)=>void){
        //paramにmapの内容を突っ込む
        return ()=>{
            const {
                map,
                project,
                edit,
                params,
                history,
            } = this.state;

            req(this.getCurrentGame(), {
                map,
                project,
                edit,
                params,
                history,
            });
        };
    }
    protected backupFieldName(){
        const {
            backupField,
            props: {
                backupId,
            },
        } = this;
        return `${backupField}:${backupId}`;
    }
    protected backup(){
        // バックアップを保存
        const game = this.getCurrentGame();
        localStorage.setItem(this.backupFieldName(), JSON.stringify(game));
    }
    protected clearBackup(){
        // バックアップを削除
        localStorage.removeItem(this.backupFieldName());
    }

    // get infooooooom API
    public getCurrentGame(): MasaoJSONFormat{
        const {
            map,
            project,
            params,
        } = this.state;

        const {
            params: mp,
            advancedMap,
        } = mapToParam(map);

        const version = project.version;
        const allParams = masao.param.sanitize({
            ...params,
            ...mp,
        });

        const obj = masao.format.make({
            params: allParams,
            version,
            script: project.script || void 0,
            'advanced-map': advancedMap,
        });
        console.log('MADE', obj);
        return obj;
    }
    public getCurrentStage(): number{
        return this.state.edit.stage;
    }
    public getKeyConfig(): Record<string, Command>{
        return keyStore.state.binding;
    }
    public setKeyConfig(binding: Record<string, Command>){
        keyActions.setKeyBinding({
            binding,
        });
    }

    //export stores
    static mapStore: MapStore = mapStore;
    static paramStore: ParamsStore = paramStore;
    static editStore: EditStore = editStore;
}

//各screen
interface IPropMapScreen{
    // 画像
    pattern: string;
    mapchip: string;
    chips: string;

    edit: EditState;
    params: ParamsState;
    map: MapState;
    project: ProjectState;
    history: HistoryState;
}
const MapScreen = (props: IPropMapScreen)=>{
    const {
        map,
        params,
        edit,
        project,
        history,

        pattern,
        mapchip,
        chips,
    } = props;
    let are=null;
    if(project.version==="2.8" && edit.screen==="layer"){
        are = <p>バージョン設定が2.8になっています。このバージョンでは背景レイヤーは使用できません。</p>;
    }

    const {
        lastUpdate,
        data,
        advanced,
    } = map;
    // いまのステージ
    const stage = data[edit.stage-1];

    const mapsClass = stage.size.x >= stage.size.y ? styles.mapsColumn : styles.mapsRow;

    return <div>
        <div className={styles.mapInfo}>
            <EditMode edit={edit} params={params} history={history} />
        </div>
        <div className={mapsClass}>
            <div>
                <MiniMap params={params} edit={edit} stage={stage}/>
            </div>
            <div>
                {are}
                <div className={styles.main}>
                    <ChipSelect pattern={pattern} mapchip={mapchip} chips={chips} params={params} edit={edit} project={project} advanced={advanced}/>
                    <MapEdit pattern={pattern} mapchip={mapchip} chips={chips} stage={stage} lastUpdate={lastUpdate} params={params} edit={edit} project={project}/>
                </div>
            </div>
        </div>
        <KeyEvent />
    </div>;
};

interface IPropParamScreen{
    edit: EditState;
    params: ParamsState;
    project: ProjectState;
}
const ParamScreen = (props: IPropParamScreen)=>{
    const {
        edit,
        params,
        project,
    } = props;
    return <div>
        <ParamEdit params={params} edit={edit} project={project}/>
    </div>;
}

interface IPropProjectScreen{
    project: ProjectState;
    map: MapState;
    edit: EditState;
}
const ProjectScreen = (props: IPropProjectScreen)=>{
    return <div>
    <ProjectEdit {...props} />
    </div>;
};

interface IPropJsScreen{
    jsWarning: boolean;
    edit: EditState;
    project: ProjectState;
}
const JsScreen = ({
    jsWarning,
    edit,
    project,
}: IPropJsScreen)=>{
    if (jsWarning && !edit.js_confirm){
        const handleConfirm = ()=>{
            editActions.jsConfirm({
                confirm: true,
            });
        };
        return <div>
            <JSWarning onClick={handleConfirm} />
        </div>;
    }else{
        return <div>
            <JSEdit project={project} />
        </div>;
    }
};


//map to param
type AdvancedMap = masao.format.AdvancedMap;
type StageObject = masao.format.StageObject;
type LayerObject = masao.format.LayerObject;
function mapToParam(map: MapState): {
    params: Record<string, string>;
    advancedMap: AdvancedMap | undefined;
}{
    if (map.advanced){
        // advancedなmapを発行
        const stages: Array<StageObject> = [];
        for (let i=0; i < map.stages; i++){
            const st = map.data[i];
            const layers: Array<LayerObject> = [
                {
                    type: 'main',
                    map: st.map,
                },
                {
                    type: 'mapchip',
                    map: st.layer,
                },
            ];
            const obj: StageObject = {
                size: st.size,
                layers,
            };
            stages.push(obj);
        }
        return {
            params: {},
            advancedMap: {
                stages,
            },
        };
    }else{
        // 昔のmap形式
        const params: Record<string, string> = {};
        for(let stage=0; stage<4; stage++){
            let stagechar="";
            if(stage===1){
                stagechar="-s";
            }else if(stage===2){
                stagechar="-t";
            }else if(stage===3){
                stagechar="-f";
            }
            for(let y=0; y < 30; y++){
                const j = map.data[stage].map[y].map(chipToMapString).join("");
                params[`map0-${y}${stagechar}`]=j.slice(0,60);
                params[`map1-${y}${stagechar}`]=j.slice(60,120);
                params[`map2-${y}${stagechar}`]=j.slice(120,180);
                const k = map.data[stage].layer[y].map(chipToLayerString).join("");
                params[`layer0-${y}${stagechar}`]=k.slice(0,120);
                params[`layer1-${y}${stagechar}`]=k.slice(120,240);
                params[`layer2-${y}${stagechar}`]=k.slice(240,360);
            }
        }
        return {
            params,
            advancedMap: void 0,
        };
    }
}
