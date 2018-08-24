import { Images } from '../../../defs/images';
import { IntoImages } from '../load-images';
import * as React from 'react';
import {
  ObserveResize,
  ObserveResizeEvent,
} from '../../core/util/observe-resize';
import * as styles from './styles.css';
import Scroll from '../../core/util/scroll';
import Resizable from '../../core/util/resizable';
import MousePad, { MousePadEvent } from '../../core/util/mousepad';
import propChanged from '../../core/util/changed';

export interface IPropChipListMain {
  /**
   * class name appended to the container.
   */
  className?: string;
  /**
   * URL of image files to use.
   */
  images: IntoImages<Images> | null;
  /**
   * Number of chips to show.
   */
  chipNumber: number;
  /**
   * Backround color of chips.
   */
  backgroundColor: string;
  /**
   * Color of cursor.
   */
  cursorColor: string;
  /**
   * Position of cursor.
   */
  cursorPosition: number | null;
  /**
   * Width of chip select area (in number of chips).
   */
  chipsWidth: number;
  /**
   * Height of chip select area (in number of chips).
   */
  chipsHeight: number;
  /**
   * Y-axis scroll position of the area.
   */
  scrollY: number;
  /**
   * Callback when the focus moves on and off.
   */
  onFocusChange?(focus: boolean): void;
  /**
   * Callback when user scrolls.
   */
  onScroll?(y: number): void;
  /**
   * Callback for area resize.
   * The third argument is new scroll position.
   */
  onResize?(width: number, height: number, scroll: number): void;
  /**
   * Callback for chip selection.
   */
  onChipSelect(chipIndex: number): void;
  /**
   * Callback to render a chip on given position.
   */
  onDrawChip(
    ctx: CanvasRenderingContext2D,
    images: IntoImages<Images>,
    x: number,
    y: number,
    chipIndex: number,
  ): void;
}
export interface IStateChipListMain {
  /**
   * Observed height of available area.
   */
  areaHeight: number;
}

export class ChipListMain extends React.PureComponent<
  IPropChipListMain,
  IStateChipListMain
> {
  /**
   * Canvas of double buffering.
   */
  private backLayer: HTMLCanvasElement;
  /**
   * Main canvas.
   */
  private mainCanvas = React.createRef<HTMLCanvasElement>();
  /**
   * Focusable area.
   */
  private focusArea = React.createRef<HTMLDivElement>();
  constructor(props: IPropChipListMain) {
    super(props);
    this.state = {
      areaHeight: 0,
    };
    this.backLayer = document.createElement('canvas');
    this.handleWrapperResize = this.handleWrapperResize.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  public render() {
    const {
      props: { className, chipNumber, chipsWidth, chipsHeight, scrollY },
      state: { areaHeight },
    } = this;

    const canvasWidth = chipsWidth * 32;
    const canvasHeight = chipsHeight * 32;
    // 中途半端な表示領域のために1段余裕を持たせる
    const allh = Math.ceil(chipNumber / chipsWidth) + 1;
    // スクロール可能な領域の大きさ
    const scrollHeight = Math.max(0, allh - chipsHeight);

    return (
      <ObserveResize className={className} onResize={this.handleWrapperResize}>
        <div className={styles.floatWrapper}>
          <div
            ref={this.focusArea}
            tabIndex={0}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            style={{ height: `${areaHeight}px` }}
          >
            <Scroll
              x={0}
              y={scrollY}
              width={chipsWidth}
              height={scrollHeight}
              screenX={chipsWidth}
              screenY={chipsHeight}
              disableX
              disableY={scrollHeight === 0}
              fit-y
              onScroll={this.handleScroll}
            >
              <Resizable
                width={canvasWidth}
                height={canvasHeight}
                fit-y
                grid={{ x: 32, y: 32 }}
                onResize={this.handleResize}
              >
                <MousePad
                  onMouseDown={this.handleMouseDown}
                  onMouseMove={this.handleMouseMove}
                >
                  <canvas
                    ref={this.mainCanvas}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
                </MousePad>
              </Resizable>
            </Scroll>
          </div>
        </div>
      </ObserveResize>
    );
  }
  /**
   * draw chips onto canvas.
   */
  private draw(mode: 'redraw' | 'cursor') {
    const {
      backLayer,
      mainCanvas: { current: mainCanvas },
      props: { images, cursorColor, cursorPosition, chipsWidth, scrollY },
    } = this;
    if (images == null) {
      // images are not available yet.
      return;
    }
    if (
      mainCanvas == null ||
      mainCanvas.width === 0 ||
      mainCanvas.height === 0
    ) {
      // canvas is not available.
      return;
    }
    if (mode === 'redraw') {
      // 裏でチップセットを書き換える
      backLayer.width = mainCanvas.width;
      backLayer.height = mainCanvas.height;
      renderChipsTo(backLayer, images, this.props);
    }
    if (mode === 'redraw' || mode === 'cursor') {
      // render chip set to main canvas.
      const ctx = mainCanvas.getContext('2d');
      if (ctx == null) {
        return;
      }
      ctx.drawImage(backLayer, 0, 0);

      // draw cursor.
      if (cursorPosition != null) {
        const cursorX = cursorPosition % chipsWidth;
        const cursorY = Math.floor(cursorPosition / chipsWidth);
        const screenX = cursorX * 32 + 0.5;
        const screenY = (cursorY - scrollY) * 32 + 0.5;
        drawCusror(ctx, cursorColor, screenX, screenY, 32, 32);
      }
    }
  }
  public componentDidMount() {
    this.draw('redraw');
  }
  public componentDidUpdate(prevProps: IPropChipListMain) {
    if (
      propChanged(prevProps, this.props, [
        'images',
        'chipNumber',
        'chipsWidth',
        'chipsHeight',
        'scrollY',
        'onDrawChip',
      ])
    ) {
      // Some of information required to render chips is changed.
      this.draw('redraw');
    } else if (propChanged(prevProps, this.props, ['cursorPosition'])) {
      this.draw('cursor');
    }
  }
  /**
   * Handle resize of the wrapper element.
   */
  private handleWrapperResize({ height }: ObserveResizeEvent): void {
    this.setState({ areaHeight: height });
  }
  /**
   * Handle focus of the focusable area.
   */
  private handleFocus() {
    const { onFocusChange } = this.props;
    if (onFocusChange != null) {
      onFocusChange(true);
    }
  }
  /**
   * Handle focus leave of the focusable area.
   */
  private handleBlur() {
    const { onFocusChange } = this.props;
    if (onFocusChange != null) {
      onFocusChange(false);
    }
  }
  /**
   * Handle scroll of the scrollable area.
   */
  private handleScroll(_x: number, y: number) {
    const { onScroll } = this.props;
    if (onScroll != null) {
      onScroll(y);
    }
  }
  /**
   * Handle resize of the resizable area
   */
  private handleResize(width: number, height: number) {
    const { chipNumber, chipsWidth, scrollY, onResize } = this.props;
    // convert sizes to number of chips.
    const newWidth = Math.ceil(width / 32);
    const newHeight = Math.ceil(height / 32);
    // adjust scroll height.
    const currentChipIndex = chipsWidth * scrollY;
    const requiredHeight = Math.ceil(chipNumber / chipsWidth);
    const newScroll =
      newWidth > 0
        ? Math.min(
            // new scroll position.
            Math.floor(currentChipIndex / newWidth),
            // but do not exceed maximum scroll height.
            Math.max(0, requiredHeight - newHeight),
          )
        : 0;
    if (onResize != null) {
      onResize(newWidth, newHeight, newScroll);
    }
  }
  /**
   * Handle mouse down in the main area.
   */
  private handleMouseDown(ev: MousePadEvent) {
    // delegate to mousemove
    this.handleMouseMove(ev);
    if (this.focusArea.current != null) {
      this.focusArea.current.focus();
    }
  }
  /**
   * Handle mouse move in the main area.
   */
  private handleMouseMove({ elementX, elementY }: MousePadEvent) {
    const { chipsWidth, scrollY, onChipSelect } = this.props;
    // Calculate which chip is selected.
    const chipIndex =
      Math.floor(elementX / 32) +
      (Math.floor(elementY / 32) + scrollY) * chipsWidth;

    onChipSelect(chipIndex);
  }
}

/**
 * Render chips to canvas.
 */
function renderChipsTo(
  canvas: HTMLCanvasElement,
  images: IntoImages<Images>,
  options: {
    chipNumber: number;
    backgroundColor: string;
    chipsWidth: number;
    scrollY: number;
    onDrawChip(
      ctx: CanvasRenderingContext2D,
      images: IntoImages<Images>,
      x: number,
      y: number,
      chipIndex: number,
    ): void;
  },
): void {
  const {
    chipNumber,
    backgroundColor,
    chipsWidth,
    scrollY,
    onDrawChip,
  } = options;

  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    return;
  }
  // Fill with background color.
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // render chips.
  let x = 0;
  let y = 0;
  for (let i = chipsWidth * scrollY; i < chipNumber; i++) {
    onDrawChip(ctx, images, x, y, i);

    // move rendering position,
    x += 32;
    if (x + 32 > chipsWidth * 32) {
      x = 0;
      y += 32;
    }
  }
}

/**
 * Draw a cursor at given position.
 */
function drawCusror(
  ctx: CanvasRenderingContext2D,
  cursorColor: string,
  x: number,
  y: number,
  chipWidth: number,
  chipHeight: number,
): void {
  ctx.strokeStyle = cursorColor;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + chipWidth - 1, y);
  ctx.lineTo(x + chipWidth - 1, y + chipHeight - 1);
  ctx.lineTo(x, y + chipHeight - 1);
  ctx.closePath();
  ctx.stroke();
}
