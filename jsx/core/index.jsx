var React=require('react'),
    Reflux=require('reflux');

var mapStore=require('../../stores/map'),
    paramStore=require('../../stores/params'),
    editStore=require('../../stores/edit');

var MapEdit=require('./map-edit.jsx'),
    ChipSelect=require('./chip-select.jsx');

module.exports = React.createClass({
    displayName: "MasaoEditorCore",
    mixins:[Reflux.connect(mapStore,"map"), Reflux.connect(paramStore,"params"), Reflux.connect(editStore,"edit")],
    propTypes:{
        filename_pattern: React.PropTypes.string.isRequired,
    },
    render(){
        var map=this.state.map, params=this.state.params, edit=this.state.edit;
        return <div className="me-core">
            <ChipSelect pattern={this.props.filename_pattern} params={params} edit={edit}/>
            <MapEdit pattern={this.props.filename_pattern} map={map} params={params} edit={edit}/>
        </div>;
    }
});
