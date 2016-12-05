"use strict";
var React=require('react');

import styles from './button.css';

module.exports = React.createClass({
    displayName: "Button",
    propTypes: {
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },
    render(){
        return <div className={styles.button} onClick={this.props.onClick}>{this.props.label}</div>;
    }
});

