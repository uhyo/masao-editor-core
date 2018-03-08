import * as React from 'react';
// key eventを感知
import * as keyLogics from '../../../../logics/key';

export interface IPropKeyEvents {
  /**
   * Whether this is disabled.
   */
  disabled: boolean;
}
export default class KeyEvents extends React.Component<IPropKeyEvents, {}> {
  constructor(props: IPropKeyEvents) {
    super(props);

    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
  }
  private keydownHandler(e: KeyboardEvent) {
    const mv = keyLogics.runByKey(
      {
        key: e.key,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
      },
      true,
      this.props.disabled,
    );
    if (mv) {
      e.preventDefault();
    }
  }
  private keyupHandler(e: KeyboardEvent) {
    const mv = keyLogics.runByKey(
      {
        key: e.key,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
      },
      false,
      this.props.disabled,
    );
    if (mv) {
      e.preventDefault();
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keydownHandler, false);
    document.addEventListener('keyup', this.keyupHandler, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownHandler, false);
    document.removeEventListener('keyup', this.keyupHandler, false);
  }
  render() {
    return <div />;
  }
}
