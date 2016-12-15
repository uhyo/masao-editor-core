//select box
import * as React from 'react';

import * as styles from './select.css';

export interface IPropSelect{
    disabled?: boolean;
    contents: Array<{
        key: string;
        value: string;
    }>;
    valueLink: {
        value: string;
        requestChange(key: string): void;
    };
}
export default class Select extends React.Component<IPropSelect, {}>{
    static defaultProps = {
        disabled: false,
    };
    render(){
        const valueLink=this.props.valueLink;
        return <div className={styles.wrapper}>{
            this.props.contents.map(({key, value}, i)=>{
                const c = key === valueLink.value ? styles.buttonCurrent : styles.button;
                return <div key={i} className={c} onClick={this.handleClick(key)}>{value}</div>;
            })
        }</div>;
    }
    handleClick<E>(key: string){
        return (e: React.MouseEvent<E>)=>{
            e.preventDefault();
            this.props.valueLink.requestChange(key);
        };
    }
}

