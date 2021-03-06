//select box
import * as React from 'react';

import * as styles from './select.css';

export interface IPropSelect<K> {
  disabled?: boolean;
  contents: Array<{
    key: K;
    label: string;
  }>;
  value: K;
  onChange(key: K): void;
}
export default class Select<K = string> extends React.Component<
  IPropSelect<K>,
  {}
> {
  static defaultProps = {
    disabled: false,
  };
  constructor(props: IPropSelect<K>) {
    super(props);
    this.handleKey = this.handleKey.bind(this);
  }
  render() {
    const { value, contents, disabled } = this.props;
    return (
      <div
        role="radiogroup"
        className={styles.wrapper}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={this.handleKey}
      >
        {contents.map(({ key, label }, i) => {
          const c = key === value ? styles.buttonCurrent : styles.button;
          return (
            <div
              key={i}
              role="radio"
              aria-checked={key === value ? 'true' : 'false'}
              className={c}
              onClick={this.handleClick(key)}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }
  handleClick<E>(key: K) {
    return (e: React.MouseEvent<E>) => {
      e.preventDefault();
      this.props.onChange(key);
    };
  }
  handleKey<T>(e: React.KeyboardEvent<T>) {
    const { contents, value, onChange } = this.props;
    const { key } = e;
    console.log('K', key);
    switch (key) {
      case 'ArrowLeft': {
        const l = contents.length;
        for (let i = 0; i < l; i++) {
          if (contents[i].key === value) {
            if (i > 0) {
              onChange(contents[i - 1].key);
            }
            break;
          }
        }
        e.preventDefault();
        break;
      }
      case 'ArrowRight': {
        const l = contents.length;
        for (let i = 0; i < l; i++) {
          if (contents[i].key === value) {
            if (i < l - 1) {
              onChange(contents[i + 1].key);
            }
            break;
          }
        }
        e.preventDefault();
        break;
      }
      case ' ': {
        const l = contents.length;
        for (let i = 0; i < l; i++) {
          if (contents[i].key === value) {
            if (i < l - 1) {
              onChange(contents[i + 1].key);
            } else {
              onChange(contents[0].key);
            }
            break;
          }
        }
        e.preventDefault();
        break;
      }
    }
  }
}
