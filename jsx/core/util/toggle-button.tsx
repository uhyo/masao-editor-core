import * as React from 'react';

import * as styles from './toggle-button.css';
// toggle push button

export interface IPropToggleButton {
  onClick(): void;
  wait?: number;
  interval?: number;
  interval2?: number;
}
export default class ToggleButton extends React.Component<
  IPropToggleButton,
  {}
> {
  private timerid: any;
  componentWillUnMount() {
    if (this.timerid != null) {
      clearTimeout(this.timerid);
      this.timerid = null;
    }
  }
  render() {
    const { children, onClick, wait, interval, interval2 } = this.props;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      document.addEventListener('mouseup', handleMouseUp, false);

      this.timerid = setTimeout(() => {
        let cnt = 0;
        const rend = () => {
          onClick();
          if (++cnt >= 10) {
            this.timerid = setTimeout(rend, interval2 || 25);
          } else {
            this.timerid = setTimeout(rend, interval || 80);
          }
        };
        rend();
      }, wait || 400);

      onClick();
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousedown', handleMouseUp, false);
      if (this.timerid != null) {
        clearTimeout(this.timerid);
        this.timerid = null;
      }
    };

    return (
      <div className={styles.wrapper} onMouseDown={handleMouseDown}>
        {children}
      </div>
    );
  }
}
