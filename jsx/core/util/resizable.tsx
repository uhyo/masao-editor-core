'use strict';
import * as React from 'react';

import Resizable from 're-resizable';
import ResizeObserver from 'resize-observer-polyfill';

import * as styles from './resizable.css';

export interface IPropResizableBox {
  /**
   * Current width of this box.
   */
  width: number;
  /**
   * Height of this box.
   */
  height: number;

  /**
   * Minimum possible width.
   */
  minWidth?: number;
  /**
   * Minimum possible height.
   */
  minHeight?: number;

  /**
   * Step of resize.
   */
  grid: {
    x: number;
    y: number;
  };
  /**
   * Whether to fit the x-axis.
   */
  'fit-x'?: boolean;
  /**
   * Whether to fit the y-axis.
   */
  'fit-y'?: boolean;
  /**
   * Handle of resizing.
   */
  onResize(width: number, height: number): void;
}
export default class ResizableBox extends React.Component<
  IPropResizableBox,
  {}
> {
  /**
   * 変化前の大きさ (x)
   */
  // private prev_width: number;
  /**
   * 変化前の大きさ (y)
   */
  // private prev_height: number;
  /**
   * resizableの中のコンテナ
   */
  protected container: HTMLElement | null = null;
  /**
   * コンテナのりサイズを監視
   */
  protected observer: ResizeObserver | null = null;
  /*
    constructor(props: IPropResizableBox){
        super(props);
        this.onResize = this.onResize.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);

        this.prev_width = props.width;
        this.prev_height = props.height;
    }
     */
  /*
    onResize(_event: any, _direction: any, _ref: any, delta: {width: number; height: number}){
        const {
            props: {
                onResize,
            },
            prev_width,
            prev_height,
        } = this;
        const {
            width,
            height,
        } = delta;
        if ((width !== 0 || height !== 0) && onResize){
            onResize(prev_width + width, prev_height + height);
        }
    }
    onResizeStop(_event: any, _direction: any, _ref: any, delta: {width: number; height: number}){
        const {
            width,
            height,
        } = delta;
        this.prev_width += width;
        this.prev_height += height;
    }
     */
  render() {
    const {
      width,
      height,
      minWidth,
      minHeight,
      grid,
      children,
      'fit-x': fitx,
      'fit-y': fity,
    } = this.props;
    const gr = grid
      ? [
          // grid x-axis
          fitx ? 1 : grid.x,
          // grid y-axis
          fity ? 1 : grid.y,
        ]
      : void 0;
    const size = {
      width: fitx ? '100%' : width,
      height: fity ? '100%' : height,
    };
    const wrapperStyle = {
      paddingRight: fitx ? '0' : undefined,
      paddingBottom: fity ? '0' : undefined,
    };
    return (
      <div className={styles.wrapper} style={wrapperStyle}>
        <Resizable
          size={size}
          minWidth={minWidth}
          minHeight={minHeight}
          maxWidth={fitx ? '100%' : undefined}
          maxHeight={fity ? '100%' : undefined}
          grid={gr}
          enable={{
            left: false,
            top: false,
            right: !fitx,
            bottom: !fity,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: !fitx && !fity,
          }}
          // onResize={this.onResize}
          // onResizeStop={this.onResizeStop}
        >
          <div ref={e => (this.container = e)} className={styles.container}>
            {children}
          </div>
          <div className={styles.handleRight} />
          <div className={styles.handleBottom} />
          <div className={styles.handleCorner} />
        </Resizable>
      </div>
    );
  }
  public componentDidMount() {
    // Initial feedback of size.
    const {
      container,
      props: { grid, 'fit-x': fitx, 'fit-y': fity, onResize },
    } = this;
    if (container != null && (fitx || fity)) {
      // これのサイズを通知
      // サイズは切り上げる
      const width = Math.ceil(container.offsetWidth / grid.x) * grid.x;
      const height = Math.ceil(container.offsetHeight / grid.y) * grid.y;
      // this.prev_width = width;
      // this.prev_height = height;
      onResize(width, height);
    }
    if (container != null) {
      // リサイズを監視
      this.observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          onResize(width, height);
        }
      });
      this.observer.observe(container);
    }
  }
  public componentWillUnmount() {
    // clean up the observer.
    if (this.observer != null) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
