"use strict";
import * as React from 'react';

import * as styles from './switch.css';

export interface IPropSwitch{
    label: string;
    valueLink: {
        value: boolean;
        requestChange(value: boolean): void;
    };
}
export default class Switch extends React.Component<IPropSwitch, {}>{
    constructor(props: IPropSwitch){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    render(){
        const c = this.props.valueLink.value === true ? styles.switchYes : styles.switchNormal;
        return <div className={c} onClick={this.handleClick}>{this.props.label}</div>;
    }
    handleClick<T>(e: React.MouseEvent<T>){
        var valueLink=this.props.valueLink;
        e.preventDefault();
        valueLink.requestChange(!valueLink.value);
    }
}
