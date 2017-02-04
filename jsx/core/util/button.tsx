import * as React from 'react';

import * as styles from './button.css';

export interface IPropButton{
    label?: string;
    onClick?(): void;
    disabled?: boolean;
}
export default class Button extends React.Component<IPropButton, {}>{
    render(){
        const {
            label,
            onClick,
            disabled,
            children,
        } = this.props;
        const child = React.Children.count(children) > 0 ? children : label;
        const cl = disabled ? styles.disabled : styles.button;

        const handler = (e: React.MouseEvent<HTMLDivElement>)=>{
            e.preventDefault();
            if (onClick != null){
                onClick();
            }
        };
        return <div className={cl} onClick={disabled ? undefined : handler}>{child}</div>;
    }
}

