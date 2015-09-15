var React=require('react');

var projectActions=require('../../actions/project');

var Select=require('./util/select');

module.exports = React.createClass({
    displayName: "ProjectEdit",
    propTypes: {
        project: React.PropTypes.object.isRequired
    },
    render(){
        var project=this.props.project;
        var contents=[
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
            requestChange:(version)=>{
                projectActions.changeVersion({version});
            }
        };
        return <div>
            <p>正男のバージョンを以下から選択してください：</p>
            <Select contents={contents} valueLink={valueLink}/>
        </div>
    }
});
