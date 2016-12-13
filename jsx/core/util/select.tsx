//select box
import * as React from 'react';

const styles: any = require('./select.css');

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
            this.props.contents.map(({key,value})=>{
                const c = key === valueLink.value ? styles['button-current'] : styles.button;
                return <div key={key} className={c} onClick={this.handleClick(key)}>{value}</div>;
            })
        }</div>;
    }
    handleClick<T>(key: string){
        return (e: React.MouseEvent<T>)=>{
            e.preventDefault();
            this.props.valueLink.requestChange(key);
        };
    }
}

