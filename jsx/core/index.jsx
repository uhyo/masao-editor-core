var React=require('react'),
    Reflux=require('reflux');

var mapStore=require('../../stores/map'),
    paramStore=require('../../stores/params'),
    editStore=require('../../stores/edit');

var MapEdit=require('./map-edit.jsx'),
    ChipSelect=require('./chip-select.jsx'),
    EditMode=require('./edit-mode.jsx'),
    MiniMap=require('./mini-map.jsx'),
    ScreenSelect=require('./screen-select.jsx'),
    ParamEdit=require('./param-edit.jsx');

module.exports = React.createClass({
    displayName: "MasaoEditorCore",
    mixins:[Reflux.connect(mapStore,"map"), Reflux.connect(paramStore,"params"), Reflux.connect(editStore,"edit")],
    propTypes:{
        filename_pattern: React.PropTypes.string.isRequired,
    },
    render(){
        var map=this.state.map, params=this.state.params, edit=this.state.edit;

        var screen=null;
        if(edit.screen==="map"){
            screen=<MapScreen pattern={this.props.filename_pattern} map={map} params={params} edit={edit}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit}/>;
        }
        return <div className="me-core">
            <div className="me-core-info">
                <ScreenSelect edit={edit}/>
            </div>
            {screen}
        </div>;
    }
});

//各screen
var MapScreen = React.createClass({
    displayName: "MapScreen",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        map: React.PropTypes.array.isRequired
    },
    render(){
        var map=this.props.map, params=this.props.params, edit=this.props.edit, pattern=this.props.pattern;
        return <div>
            <div className="me-core-map-info">
                <EditMode edit={edit} map={map}/>
            </div>
            <MiniMap params={params} edit={edit} map={map}/>
            <div className="me-core-main">
                <ChipSelect pattern={pattern} params={params} edit={edit}/>
                <MapEdit pattern={pattern} map={map} params={params} edit={edit}/>
            </div>
        </div>;
    }
});

var ParamScreen = React.createClass({
    displayName: "ParamScreen",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired
    },
    render(){
        var params=this.props.params, edit=this.props.edit;
        return <div>
            <ParamEdit params={params} edit={edit} />
        </div>;
    }
});
