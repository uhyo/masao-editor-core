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
import { GridCanvas } from './grid-canvas';

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

    componentWillUnmount() {
      this.timers.clean();
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
        },
        stage: { size },
      } = this.props;
      const width = view_width * 32;
      const height = view_height * 32;

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
                      <GridCanvas
                        edit={this.props.edit}
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
    protected handleMouseDown({ elementX, elementY, button }: MousePadEvent) {
      //マウスが下がった

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
