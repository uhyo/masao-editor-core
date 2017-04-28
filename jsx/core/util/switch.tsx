"use strict";
import * as React from 'react';

import * as styles from './switch.css';

export interface IPropSwitch{
    label: string;
    value: boolean;
    onChange(value: boolean): void;
}
export default class Switch extends React.Component<IPropSwitch, {}>{
    constructor(props: IPropSwitch){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKey = this.handleKey.bind(this);
    }
    render(){
        const c = this.props.value === true ? styles.switchYes : styles.switchNormal;
        return <div className={c} tabIndex={0} onClick={this.handleClick} onKeyDown={this.handleKey}>{this.props.label}</div>;
    }
    handleClick<T>(e: React.MouseEvent<T>){
        const {
            value,
            onChange,
        } = this.props;
        e.preventDefault();
        onChange(!value);
    }
    handleKey<T>(e: React.KeyboardEvent<T>){
        const {
            value,
            onChange,
        } = this.props;
        if (e.key === ' '){
            e.preventDefault();
            onChange(!value);
        }
    }
}
