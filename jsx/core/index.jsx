"use strict";
var React=require('react'),
    Reflux=require('reflux');
var extend=require('extend'),
    masao=require('masao');


var paramActions=require('../../actions/params');

var mapStore=require('../../stores/map'),
    paramStore=require('../../stores/params'),
    editStore=require('../../stores/edit'),
    projectStore=require('../../stores/project');

var MapEdit=require('./map-edit.jsx'),
    ChipSelect=require('./chip-select.jsx'),
    EditMode=require('./edit-mode.jsx'),
    MiniMap=require('./mini-map.jsx'),
    ScreenSelect=require('./screen-select.jsx'),
    ParamEdit=require('./param-edit.jsx'),
    ProjectEdit=require('./project-edit.jsx'),
    Button=require('./util/button.jsx');


var MasaoEditorCore = React.createClass({
    displayName: "MasaoEditorCore",
    mixins:[Reflux.connect(mapStore,"map"), Reflux.connect(paramStore,"params"), Reflux.connect(editStore,"edit"), Reflux.connect(projectStore,"project")],
    propTypes:{
        filename_pattern: React.PropTypes.string.isRequired,
        filename_mapchip: React.PropTypes.string.isRequired,
        filename_chips: React.PropTypes.string.isRequired,

        defaultParams: React.PropTypes.object,

        externalCommands: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            request: React.PropTypes.func.isRequired
        }).isRequired),
    },
    componentWillMount(){
        if(this.props.defaultParams){
            //default
            paramActions.resetParams(this.props.defaultParams);
        }
    },
    componentWillReceiveProps(newProps){
        if(this.props.defaultParams!==newProps.defaultParams && newProps.defaultParams != null){
            paramActions.resetParams(newProps.defaultParams);
        }
    },
    render(){
        var map=this.state.map, params=this.state.params, edit=this.state.edit, project=this.state.project;

        var screen=null;
        if(edit.screen==="map" || edit.screen==="layer"){
            screen=<MapScreen pattern={this.props.filename_pattern} mapchip={this.props.filename_mapchip} chips={this.props.filename_chips} map={map} params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit} project={project}/>;
        }else if(edit.screen==="project"){
            screen=<ProjectScreen project={project}/>;
        }
        var external_buttons=null;
        if(this.props.externalCommands!=null){
            external_buttons=this.props.externalCommands.map((com)=>{
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
    },
    handleExternal(req){
        //paramにmapの内容を突っ込む
        return (e)=>{
            let project=this.state.project;
            e.preventDefault();
            let mp=mapToParam(this.state.map);
            let version = project.version==="fx" ? "fx16" : project.version;
            let allParams = masao.param.sanitize(extend({},this.state.params, mp),version);
            let obj=masao.format.make({
                params: allParams,
                version
            });
            req(obj);
        };
    },
});
//exports stores
MasaoEditorCore.mapStore = mapStore;
MasaoEditorCore.paramStore = paramStore;
MasaoEditorCore.editStore = editStore;
module.exports = MasaoEditorCore;

//各screen
var MapScreen = React.createClass({
    displayName: "MapScreen",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        mapchip: React.PropTypes.string.isRequired,
        chips: React.PropTypes.string.isRequired,

        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        map: React.PropTypes.shape({
            map: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.arrayOf(
                        React.PropTypes.string.isRequired
                    ).isRequired
                ).isRequired
            ).isRequired,
            layer: React.PropTypes.arrayOf(
                React.PropTypes.arrayOf(
                    React.PropTypes.arrayOf(
                        React.PropTypes.string.isRequired
                    ).isRequired
                ).isRequired
            ).isRequired
        }),
        project: React.PropTypes.object.isRequired
    },
    render(){
        var map=this.props.map, params=this.props.params, edit=this.props.edit, project=this.props.project, pattern=this.props.pattern, mapchip=this.props.mapchip, chips=this.props.chips;
        return <div>
            <div className="me-core-map-info">
                <EditMode edit={edit}/>
            </div>
            <MiniMap params={params} edit={edit} map={map}/>
            <div className="me-core-main">
                <ChipSelect pattern={pattern} mapchip={mapchip} chips={chips} params={params} edit={edit}/>
                <MapEdit pattern={pattern} mapchip={mapchip} chips={chips} map={map} params={params} edit={edit} project={project}/>
            </div>
        </div>;
    }
});

var ParamScreen = React.createClass({
    displayName: "ParamScreen",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        project: React.PropTypes.object.isRequired
    },
    render(){
        var params=this.props.params, edit=this.props.edit, project=this.props.project;
        return <div>
            <ParamEdit params={params} edit={edit} project={project}/>
        </div>;
    }
});

var ProjectScreen = React.createClass({
    displayName: "ProjectScreen",
    propTypes: {
        project: React.PropTypes.object.isRequired
    },
    render(){
        var project=this.props.project;
        return <div>
            <ProjectEdit project={project}/>
        </div>;
    }
});


//map to param
function mapToParam(map){
    let result={};
    for(let stage=0;stage<4;stage++){
        let stagechar="";
        if(stage===1){
            stagechar="-s";
        }else if(stage===2){
            stagechar="-t";
        }else if(stage===3){
            stagechar="-f";
        }
        for(let y=0;y < 30; y++){
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
