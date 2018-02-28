import * as React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface ObserveResizeEvent {
  width: number;
  height: number;
}

export interface IPropObserveResize {
  /**
   * classname to attach to the component.
   */
  className?: string;
  /**
   * Handler of resize event.
   */
  onResize(obj: ObserveResizeEvent): void;
}

/**
 * A component which observes its size change.
 */
export class ObserveResize extends React.Component<IPropObserveResize, {}> {
  /**
   * Observer.
   */
  protected observer: ResizeObserver | null = null;
  /**
   * Ref to the wrapper.
   */
  protected wrapper: HTMLElement | null = null;
  public render() {
    const { children, className } = this.props;
    return (
      <div ref={e => (this.wrapper = e)} className={className}>
        {children}
      </div>
    );
  }
  public componentDidMount() {
    const { onResize } = this.props;
    // set up the observer.
    this.observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        onResize(entry.contentRect);
      }
    });
    if (this.wrapper != null) {
      this.observer.observe(this.wrapper);
      // initial fire
      onResize({
        width: this.wrapper.offsetWidth,
        height: this.wrapper.offsetHeight,
      });
    }
  }
  public componentWillUnmount() {
    if (this.observer != null) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
