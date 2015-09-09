"use strict";
var React=require('react');

module.exports = React.createClass({
    displayName: "Button",
    propTypes: {
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },
    render(){
        return <div className="me-core-util-button" onClick={this.props.onClick}>{this.props.label}</div>;
    }
});

