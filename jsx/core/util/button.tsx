import * as React from 'react';

import * as styles from './button.css';

export interface IPropButton{
    label?: string;
    onClick?(e: React.MouseEvent<HTMLDivElement>): void;
}
export default class Button extends React.Component<IPropButton, {}>{
    render(){
        const {
            label,
            onClick,
            children,
        } = this.props;
        const child = React.Children.count(children) > 0 ? children : label;
        return <div className={styles.button} onClick={onClick}>{child}</div>;
    }
}

