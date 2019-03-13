'use strict';
import * as React from 'react';

import Resizable from '../../../util/resizable';
import Scroll from '../../../util/scroll';
import MousePad, { MousePadEvent } from '../../../util/mousepad';
import Timers from '../../../../../scripts/timers';

import * as styles from './index.css';

import { Mode } from '../../../../../actions/edit';
import {
  EditState,
  StageData,
  LastUpdateData,
  CustomPartsState,
  ParamsState,
  ProjectState,
} from '../../../../../stores';

import * as editLogics from '../../../../../logics/edit';
import { Images } from '../../../../../defs/images';
import { IntoImages, wrapLoadImages } from '../../../../components/load-images';
import { ThemeConsumer } from '../../../theme/context';
import { MapCanvas } from './map-canvas';

export interface IPropMapEdit {
  images: IntoImages<Images> | null;

  stage: StageData;
  lastUpdate: LastUpdateData;

  params: ParamsState;
  edit: EditState;
  customParts: CustomPartsState;
  project: ProjectState;
}
export default wrapLoadImages(
  'images',
  class MapEdit extends React.Component<IPropMapEdit, {}> {
    /**
     * タイマー
     */
    private timers: Timers;
    /**
     * マウスが周辺位置にいるかどうかのフラグ
     */
    protected mouse_edge: editLogics.EdgeType | null = null;
    /**
     * Fucusable areaのcontainer
     */
    protected focusarea: HTMLElement | null = null;
    /**
     * グリッド用canvasのcontainer
     */
    protected grid_canvas: HTMLCanvasElement | null = null;

    constructor(props: IPropMapEdit) {
      super(props);
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleResize = this.handleResize.bind(this);

      // timers
      this.timers = new Timers();
    }

    componentDidMount() {
      this.drawGrid();
    }
    componentWillUnmount() {
      this.timers.clean();
    }
    /**
     * Draw a new grid to the canvas.
     */
    protected drawGrid() {
      const canvas = this.grid_canvas;
      if (canvas == null) {
        return;
      }
      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        return;
      }
      const {
        edit: {
          scroll_stick_right,
          scroll_stick_bottom,
          view_width,
          view_height,
          view_width_remainder,
          view_height_remainder,
        },
      } = this.props;

      // 吸い付きによる補正
      const x_corr = scroll_stick_right ? -view_width_remainder : 0;
      const y_corr = scroll_stick_bottom ? -view_height_remainder : 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 0, 0, .25)';
      // y-grids
      for (let x = 1; x < view_width; x++) {
        ctx.beginPath();
        const dx = x * 32 + x_corr;
        ctx.moveTo(dx, 0);
        ctx.lineTo(dx, view_height * 32);
        ctx.stroke();
      }

      // x-grids
      for (let y = 1; y < view_height; y++) {
        ctx.beginPath();
        const dy = y * 32 + y_corr;
        ctx.moveTo(0, dy);
        ctx.lineTo(view_width * 32, dy);
        ctx.stroke();
      }
    }
    public render() {
      const {
        edit: {
          view_width,
          view_height,
          view_width_remainder,
          view_height_remainder,
          scroll_x,
          scroll_y,
          scroll_stick_right,
          scroll_stick_bottom,
          grid,
          pointer,
        },
        stage: { size },
      } = this.props;
      const width = view_width * 32;
      const height = view_height * 32;

      const c2style = {
        opacity: grid ? 1 : 0,
        cursor: pointer || undefined,
      };

      const scrollWidth = Math.max(0, size.x - view_width);
      const scrollHeight = Math.max(0, size.y - view_height);

      // TODO
      return (
        <ThemeConsumer>
          {({ fitY }) => (
            <div
              ref={e => (this.focusarea = e)}
              className={fitY ? styles.wrapperFitY : styles.wrapper}
              tabIndex={0}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            >
              <Scroll
                width={scrollWidth}
                height={scrollHeight}
                fit-x
                fit-y={fitY}
                x={scroll_x}
                y={scroll_y}
                screenX={view_width}
                screenY={view_height}
                onScroll={this.handleScroll}
              >
                <Resizable
                  width={width}
                  height={height}
                  minWidth={32}
                  minHeight={32}
                  grid={{ x: 32, y: 32 }}
                  fit-x
                  fit-y={fitY}
                  onResize={this.handleResize}
                >
                  <div className={styles.canvasWrapper}>
                    <MapCanvas
                      images={this.props.images}
                      width={width}
                      height={height}
                      stage={this.props.stage}
                      edit={this.props.edit}
                      params={this.props.params}
                      customParts={this.props.customParts}
                      lastUpdate={this.props.lastUpdate}
                    />
                    <MousePad
                      onMouseDown={this.handleMouseDown}
                      onMouseMove={this.handleMouseMove}
                      onMouseUp={this.handleMouseUp}
                      onClick={this.handleClick}
                      useMouseMove={editLogics.isMouseMoveEnabled()}
                      elementXCorrection={
                        scroll_stick_right ? view_width_remainder : 0
                      }
                      elementYCorrection={
                        scroll_stick_bottom ? view_height_remainder : 0
                      }
                    >
                      <canvas
                        ref={e => (this.grid_canvas = e)}
                        className={styles.overlapCanvas}
                        style={c2style}
                        width={width}
                        height={height}
                        onContextMenu={this.handleContextMenu}
                      />
                    </MousePad>
                  </div>
                </Resizable>
              </Scroll>
            </div>
          )}
        </ThemeConsumer>
      );
    }
    protected handleResize(widthr: number, heightr: number) {
      const width = Math.ceil(widthr / 32);
      const height = Math.ceil(heightr / 32);
      // 中途半端で隠されるピクセル数
      const widthRemainder = Math.floor(width * 32 - widthr);
      const heightRemainder = Math.floor(height * 32 - heightr);
      // if calculated view is different, then update.
      console.log(width, height, widthRemainder, heightRemainder);
      editLogics.changeView({
        width,
        height,
        widthRemainder,
        heightRemainder,
      });
    }
    protected handleScroll(x: number, y: number) {
      editLogics.scroll({
        x,
        y,
      });
    }
    protected handleMouseDown({
      target,
      elementX,
      elementY,
      button,
      preventDefault,
    }: MousePadEvent) {
      //マウスが下がった

      const canvas2 = this.grid_canvas;
      if (target !== canvas2) {
        preventDefault();
        return;
      }
      if (this.focusarea != null) {
        this.focusarea.focus();
      }

      const { edit } = this.props;

      const mx = Math.floor(elementX / 32);
      const my = Math.floor(elementY / 32);

      let mode: Mode;
      if (button === 0 || button == null) {
        //左クリック
        mode = edit.mode;
      } else if (button === 1) {
        //中クリック
        mode = 'hand';
      } else if (button === 2) {
        //右クリック
        mode = 'eraser';
      } else {
        return;
      }

      const tool = editLogics.mouseDown(mode, mx, my);
      if (tool != null && tool.type !== 'hand') {
        // マウスモードなのでマウスによるスクロールを有効化
        this.mouse_edge = null;
        let counter = 0;
        const func = () => {
          // マウスが恥にあればスクロール
          counter++;
          switch (this.mouse_edge) {
            case 'left': {
              editLogics.scrollBy({
                x: -1,
                y: 0,
              });
              break;
            }
            case 'top': {
              editLogics.scrollBy({
                x: 0,
                y: -1,
              });
              break;
            }
            case 'right': {
              editLogics.scrollBy({
                x: 1,
                y: 0,
              });
              break;
            }
            case 'bottom': {
              editLogics.scrollBy({
                x: 0,
                y: 1,
              });
              break;
            }
            case null: {
              counter = 0;
              break;
            }
          }
          // 連続で恥にいるときはスピードを挙げる
          const wait = counter <= 5 ? 120 : counter <= 12 ? 50 : 17;
          this.timers.addTimer('mouse-scroll', wait, func);
        };
        func();
      }
    }
    protected handleMouseMove({ elementX, elementY }: MousePadEvent) {
      const mx = Math.floor(elementX / 32);
      const my = Math.floor(elementY / 32);

      this.mouse_edge = editLogics.isEdge(mx, my);

      editLogics.mouseMove(mx, my, this.props.edit.tool);
    }
    protected handleMouseUp() {
      this.timers.clearTimer('mouse-scroll');
      editLogics.mouseUp();
    }
    protected handleClick({ elementX, elementY, button }: MousePadEvent) {
      const mx = Math.floor(elementX / 32);
      const my = Math.floor(elementY / 32);
      editLogics.click(mx, my, button);
    }
    protected handleContextMenu<T>(e: React.MouseEvent<T>) {
      e.preventDefault();
    }
    protected handleFocus() {
      editLogics.focus('main');
    }
    protected handleBlur() {
      editLogics.blur('main');
    }
  },
);
