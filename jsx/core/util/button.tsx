import * as React from 'react';

import * as styles from './button.css';

export interface IPropButton {
  label?: string;
  title?: string;
  onClick?(): void;
  disabled?: boolean;
}
export default class Button extends React.Component<IPropButton, {}> {
  constructor(props: IPropButton) {
    super(props);
    this.handleKey = this.handleKey.bind(this);
  }
  render() {
    const { label, title, onClick, disabled, children } = this.props;
    const child = React.Children.count(children) > 0 ? children : label;
    const cl = disabled ? styles.disabled : styles.button;

    const handler = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (onClick != null) {
        onClick();
      }
    };
    return (
      <div
        role="button"
        title={title}
        aria-disabled={disabled}
        className={cl}
        tabIndex={disabled ? undefined : 0}
        onClick={disabled ? undefined : handler}
        onKeyDown={this.handleKey}
      >
        {child}
      </div>
    );
  }
  handleKey<T>(e: React.KeyboardEvent<T>) {
    const { onClick } = this.props;
    if (e.key === ' ' && onClick != null) {
      e.preventDefault();
      onClick();
    }
  }
}
