import * as React  from 'react';
import * as Reflux from 'reflux';

import {
    RefluxComponent,
} from '../../scripts/reflux-util';

import * as extend from 'extend';
import * as masao from '../../scripts/masao';

import * as paramActions from '../../actions/params';
import * as projectActions from '../../actions/project';

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

export interface IDefnMasaoEditorCore{
    map: MapState;
    params: ParamsState;
    edit: EditState;
    project: ProjectState;
}
export interface IPropMasaoEditorCore{
    filename_pattern: string;
    filename_mapchip: string;
    filename_chips: string;

    defaultParams?: Record<string, string>;

    // TODO
    defaultGame?: any;
    externalCommands?: Array<{
        label: string;
        request(game: any): void;
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
            const v = masao.acceptVersion(g.version);
            const params = masao.param.addDefaults(g.params, v);

            paramActions.resetParams(params);
            projectActions.changeVersion({version: v});
        }
    }
    componentWillReceiveProps(newProps: IPropMasaoEditorCore){
        if(this.props.defaultParams !== newProps.defaultParams && newProps.defaultParams != null){
            paramActions.resetParams(newProps.defaultParams);
            projectActions.changeVersion({version: masao.acceptVersion(newProps.defaultGame.version)});
        }
    }
    render(){
        const {
            map,
            params,
            edit,
            project,
        } = this.state;

        let screen = null;
        if(edit.screen==="map" || edit.screen==="layer"){
            screen=<MapScreen pattern={this.props.filename_pattern} mapchip={this.props.filename_mapchip} chips={this.props.filename_chips} map={map} params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="project"){
            screen=<ProjectScreen project={project}/>;
        }
        let external_buttons=null;
        if(this.props.externalCommands != null){
            external_buttons = this.props.externalCommands.map((com)=>{
                return <div key={com.label}>
                    <Button label={com.label} onClick={this.handleExternal(com.request)}/>
                </div>;
            });
        }
        return <div className="me-core">
            <div className="me-core-info">
                <div>
                    <ScreenSelect edit={edit}/>
                </div>
                {external_buttons}
            </div>
            {screen}
        </div>;
    }
    handleExternal<T>(req: (game: any)=>void){
        //paramにmapの内容を突っ込む
        return (e: React.MouseEvent<T>)=>{
            const {
                map,
                project,
            } = this.state;
            e.preventDefault();

            const mp = mapToParam(map);
            // FIXME
            // const version = project.version==="fx" ? "fx16" : project.version;
            const version = project.version;
            const allParams = masao.param.sanitize(extend({},this.state.params, mp),version);
            const obj=masao.format.make({
                params: allParams,
                version
            });
            req(obj);
        };
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
    return <div>
        <div className="me-core-map-info">
        <EditMode edit={edit}/>
        </div>
        <MiniMap params={params} edit={edit} map={map}/>
        {are}
        <div className="me-core-main">
        <ChipSelect pattern={pattern} mapchip={mapchip} chips={chips} params={params} edit={edit} project={project}/>
        <MapEdit pattern={pattern} mapchip={mapchip} chips={chips} map={map} params={params} edit={edit} project={project}/>
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
}
const ProjectScreen = (props: IPropProjectScreen)=>{
    return <div>
    <ProjectEdit project={props.project}/>
    </div>;
};


//map to param
function mapToParam(map: MapState){
    const result: Record<string, string> = {};
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
            let j=map.map[stage][y].join("");
            result[`map0-${y}${stagechar}`]=j.slice(0,60);
            result[`map1-${y}${stagechar}`]=j.slice(60,120);
            result[`map2-${y}${stagechar}`]=j.slice(120,180);
            let k=map.layer[stage][y].join("");
            result[`layer0-${y}${stagechar}`]=k.slice(0,120);
            result[`layer1-${y}${stagechar}`]=k.slice(120,240);
            result[`layer2-${y}${stagechar}`]=k.slice(240,360);
        }
    }
    return result;
}