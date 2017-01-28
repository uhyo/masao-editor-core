import * as React  from 'react';
import * as Reflux from 'reflux';

import {
    RefluxComponent,
} from '../../scripts/reflux-util';

import * as extend from 'extend';
import * as masao from '../../scripts/masao';
import {
    chipToMapString,
    chipToLayerString,
} from '../../scripts/chip';

import * as paramActions from '../../actions/params';
import * as projectActions from '../../actions/project';
import * as mapActions from '../../actions/map';

import mapStore, { MapState } from '../../stores/map';
import paramStore, { ParamsState } from '../../stores/params';
import editStore, { EditState } from '../../stores/edit';
import projectStore, { ProjectState } from '../../stores/project';

import MapEdit from './map-edit/index';
import ChipSelect from './chip-select';
import EditMode from './edit-mode';
import MiniMap from './mini-map';
import ScreenSelect from './screen-select';
import ParamEdit from './param-edit';
import ProjectEdit from './project-edit';
import Button from './util/button';

import './css/init.css';
import * as styles from './css/index.css';

export interface IDefnMasaoEditorCore{
    map: MapState;
    params: ParamsState;
    edit: EditState;
    project: ProjectState;
}
export interface IPropMasaoEditorCore{
    filename_pattern: string;
    filename_mapchip: string;

    defaultParams?: Record<string, string>;

    // TODO
    defaultGame?: any;
    externalCommands?: Array<{
        label: string;
        request(game: any, states: IDefnMasaoEditorCore): void;
    }>;
}
export interface IStateMasaoEditorCore{
}
export default class MasaoEditorCore extends RefluxComponent<IDefnMasaoEditorCore, IPropMasaoEditorCore, IStateMasaoEditorCore>{
    constructor(props: IPropMasaoEditorCore){
        super(props, {
            map: mapStore,
            params: paramStore,
            edit: editStore,
            project: projectStore,
        });
    }
    componentWillMount(){
        const g = this.props.defaultGame;
        if(g){
            //default
            this.loadGame(g);
        }
    }
    componentWillReceiveProps(newProps: IPropMasaoEditorCore){
        if(this.props.defaultGame !== newProps.defaultGame && newProps.defaultGame != null){
            this.loadGame(newProps.defaultGame);
        }else if(this.props.defaultParams !== newProps.defaultParams && newProps.defaultParams != null){
            paramActions.resetParams(newProps.defaultParams);
            projectActions.changeVersion({version: masao.acceptVersion(newProps.defaultGame.version)});
        }
    }
    private loadGame(game: masao.format.MasaoJSONFormat){
        const version = masao.acceptVersion(game.version);
        const params = masao.param.addDefaults(game.params, version);

        const advanced = game['advanced-map'] != null;

        mapActions.setAdvanced({
            advanced,
        });
        paramActions.resetParams(params);
        projectActions.changeVersion({version});
        if (advanced){
            const a = game['advanced-map']!;
            const stageLen = a.stages.length;
            for (let i = 0; i < stageLen; i++){
                // 暫定的に4まで対応
                if (i >= 4){
                    break;
                }
                const stage = a.stages[i];
                let map;
                let layer;
                for (let obj of stage.layers){
                    if (obj.type === 'main'){
                        map = obj.map;
                    }else if (obj.type === 'mapchip'){
                        layer = obj.map;
                    }
                }
                // サイズ
                mapActions.loadMap({
                    stage: i,
                    size: stage.size,
                    map,
                    layer,
                });
            }
        }
    }
    render(){
        const {
            map,
            params,
            edit,
            project,
        } = this.state;
        const chips: string = require('../../images/chips.png');

        let screen = null;
        if(edit.screen==="map" || edit.screen==="layer"){
            screen=<MapScreen pattern={this.props.filename_pattern} mapchip={this.props.filename_mapchip} chips={chips} map={map} params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="project"){
            screen=<ProjectScreen project={project} map={map} edit={edit}/>;
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
    handleExternal<T>(req: (game: any, obj: IDefnMasaoEditorCore)=>void){
        //paramにmapの内容を突っ込む
        return (e: React.MouseEvent<T>)=>{
            const {
                map,
                project,
                edit,
                params,
            } = this.state;
            e.preventDefault();

            req(this.getCurrentGame(), {
                map,
                project,
                edit,
                params,
            });
        };
    }

    // get infooooooom API
    public getCurrentGame(): any{
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
            'advanced-map': advancedMap,
        });
        console.log('MADE', obj);
        return obj;
    }
    public getCurrentStage(): number{
        return this.state.edit.stage;
    }

    //export stores
    static mapStore = mapStore;
    static paramStore = paramStore;
    static editStore = editStore;
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
}
const MapScreen = (props: IPropMapScreen)=>{
    const {
        map,
        params,
        edit,
        project,
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
    } = map;
    // いまのステージ
    const stage = data[edit.stage-1];

    const mapsClass = stage.size.x >= stage.size.y ? styles.mapsColumn : styles.mapsRow;

    return <div>
        <div className={styles.mapInfo}>
            <EditMode edit={edit} params={params}/>
        </div>
        <div className={mapsClass}>
            <div>
                <MiniMap params={params} edit={edit} stage={stage}/>
            </div>
            <div>
                {are}
                <div className={styles.main}>
                    <ChipSelect pattern={pattern} mapchip={mapchip} chips={chips} params={params} edit={edit} project={project}/>
                    <MapEdit pattern={pattern} mapchip={mapchip} chips={chips} stage={stage} lastUpdate={lastUpdate} params={params} edit={edit} project={project}/>
                </div>
            </div>
        </div>
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


//map to param
type AdvancedMap = masao.format.MasaoJSONFormat['advanced-map'];
type StageObject = masao.format.StageObject;
function mapToParam(map: MapState): {
    params: Record<string, string>;
    advancedMap: AdvancedMap;
}{
    if (map.advanced){
        // advancedなmapを発行
        const stages: Array<StageObject> = [];
        for (let i=0; i < map.stages; i++){
            const st = map.data[i];
            type LayerObject = StageObject['layers'][number];
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
