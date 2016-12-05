"use strict";
var React=require('react');

import styles from './switch.css';

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
        const c = this.props.valueLink.value === true ? styles['switch-yes'] : styles['switch'];
        return <div className={c} onClick={this.handleClick}>{this.props.label}</div>;
    },
    handleClick(e){
        var valueLink=this.props.valueLink;
        e.preventDefault();
        valueLink.requestChange(!valueLink.value);
    }
});
