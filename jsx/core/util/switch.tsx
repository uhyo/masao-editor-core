"use strict";
import * as React from 'react';

const styles: any = require('./switch.css');

export interface IPropSwitch{
    label: string;
    valueLink: {
        value: boolean;
        requestChange(value: boolean): void;
    };
}
export default class Switch extends React.Component<IPropSwitch, {}>{
    render(){
        const c = this.props.valueLink.value === true ? styles['switch-yes'] : styles['switch'];
        return <div className={c} onClick={this.handleClick}>{this.props.label}</div>;
    }
    handleClick<T>(e: React.MouseEvent<T>){
        var valueLink=this.props.valueLink;
        e.preventDefault();
        valueLink.requestChange(!valueLink.value);
    }
}
