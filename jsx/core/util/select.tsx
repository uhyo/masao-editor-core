//select box
import * as React from 'react';

import * as styles from './select.css';

export interface IPropSelect{
    disabled?: boolean;
    contents: Array<{
        key: string;
        label: string;
    }>;
    value: string;
    onChange(key: string): void;
}
export default class Select extends React.Component<IPropSelect, {}>{
    static defaultProps = {
        disabled: false,
    };
    render(){
        const {
            value,
            onChange,
            contents,
        } = this.props;
        return <div className={styles.wrapper}>{
            contents.map(({key, label}, i)=>{
                const c = key === value ? styles.buttonCurrent : styles.button;
                return <div key={i} className={c} onClick={this.handleClick(key)}>{label}</div>;
            })
        }</div>;
    }
    handleClick<E>(key: string){
        return (e: React.MouseEvent<E>)=>{
            e.preventDefault();
            this.props.onChange(key);
        };
    }
}

