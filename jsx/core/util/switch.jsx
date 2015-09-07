var React=require('react');

module.exports = React.createClass({
    displayName: "Switch",
    propTypes: {
        label: React.PropTypes.string.isRequired,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.bool.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }).isRequired
    },
    render(){
        var c="me-core-util-switch";
        if(this.props.valueLink.value===true){
            c+=" me-core-util-switch-yes";
        }
        return <div className={c} onClick={this.handleClick}>{this.props.label}</div>;
    },
    handleClick(e){
        var valueLink=this.props.valueLink;
        e.preventDefault();
        valueLink.requestChange(!valueLink.value);
    }
});
