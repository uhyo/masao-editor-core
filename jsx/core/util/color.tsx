import * as React from 'react';

import * as styles from './color.css';

export interface IPropColor {
  value: {
    red: number;
    green: number;
    blue: number;
  };
  onChange(value: { red: number; green: number; blue: number }): void;
}
//color select control
export default class Color extends React.Component<IPropColor, {}> {
  constructor(props: IPropColor) {
    super(props);
    this.handleChangeRed = this.handleChangeRed.bind(this);
    this.handleChangeGreen = this.handleChangeGreen.bind(this);
    this.handleChangeBlue = this.handleChangeBlue.bind(this);
  }
  render() {
    const { value: color } = this.props;
    const style = {
      backgroundColor: `rgb(${color.red},${color.green},${color.blue})`,
      color: `rgb(${255 - color.red},${255 - color.green},${255 - color.blue})`,
    };
    const colorValue =
      '#' +
      ('0' + color.red.toString(16)).slice(-2) +
      ('0' + color.green.toString(16)).slice(-2) +
      ('0' + color.blue.toString(16)).slice(-2);

    return (
      <span className={styles.wrapper}>
        <span className={styles.box} style={style}>
          {colorValue}
        </span>
        <span className={styles.edit}>
          <span>
            R:{' '}
            <input
              type="range"
              step="1"
              min="0"
              max="255"
              value={color.red}
              onChange={this.handleChangeRed}
            />
          </span>
          <span>
            G:{' '}
            <input
              type="range"
              step="1"
              min="0"
              max="255"
              value={color.green}
              onChange={this.handleChangeGreen}
            />
          </span>
          <span>
            B:{' '}
            <input
              type="range"
              step="1"
              min="0"
              max="255"
              value={color.blue}
              onChange={this.handleChangeBlue}
            />
          </span>
        </span>
      </span>
    );
  }
  handleChangeRed(e: React.SyntheticEvent<HTMLInputElement>): void {
    const { onChange, value: { green, blue } } = this.props;
    onChange({
      red: Number(e.currentTarget.value),
      green,
      blue,
    });
  }
  handleChangeGreen(e: React.SyntheticEvent<HTMLInputElement>): void {
    const { onChange, value: { red, blue } } = this.props;
    onChange({
      red,
      green: Number(e.currentTarget.value),
      blue,
    });
  }
  handleChangeBlue(e: React.SyntheticEvent<HTMLInputElement>): void {
    const { onChange, value: { red, green } } = this.props;
    onChange({
      red,
      green,
      blue: Number(e.currentTarget.value),
    });
  }
}
