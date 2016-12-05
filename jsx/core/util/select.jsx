"use strict";
//select box
var React=require('react');

import styles from './select.css';

module.exports = React.createClass({
    displayName: "Select",
    propTypes: {
        contents: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            value: React.PropTypes.string.isRequired
        }).isRequired).isRequired,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string.isRequired,
            requestChange: React.PropTypes.func.isRequired
        })
    },
    getDefaultProps(){
        return {
            disabled: false
        };
    },
    render(){
        var valueLink=this.props.valueLink;
        return <div className={styles.wrapper}>{
            this.props.contents.map(({key,value})=>{
                const c = key === valueLink.value ? styles['button-current'] : styles.button;
                return <div key={key} className={c} onClick={this.handleClick(key)}>{value}</div>;
            })
        }</div>;
    },
    handleClick(key){
        return (e)=>{
            e.preventDefault();
            this.props.valueLink.requestChange(key);
        };
    }
});
