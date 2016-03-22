var React=require('react');

var projectActions=require('../../actions/project');

module.exports = React.createClass({
    displayName: "JSEdit",
    propTypes: {
        project: React.PropTypes.object.isRequired
    },
    render(){
        return <div className="me-core-js-edit">
            <textarea ref="textarea" onChange={this.handleChange}/>
        </div>;
    },
    handleChange(e){
        const textarea = React.findDOMNode(this.refs.textarea);

        projectActions.changeScript({
            script: textarea.value
        });
    },
    componentDidMount(){
        const textarea = React.findDOMNode(this.refs.textarea);

        textarea.value = this.props.project.script;
    },
});

