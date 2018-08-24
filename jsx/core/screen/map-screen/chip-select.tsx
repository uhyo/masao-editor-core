import * as React from 'react';
import memoizeOne from 'memoize-one';

import * as chip from '../../../../scripts/chip';
import * as util from '../../../../scripts/util';

import * as editActions from '../../../../actions/edit';
import * as editLogics from '../../../../logics/edit';

import {
  EditState,
  CustomPartsState,
  ParamsState,
  ProjectState,
} from '../../../../stores';

import * as styles from '../../css/chip-select.css';

import { ChipList } from '../../../components/chip-select';
import { IntoImages } from '../../../components/load-images';
import { Images } from '../../../../defs/images';

export interface IPropChipSelect {
  // 画像ファイル
  pattern: string;
  mapchip: string;
  chips: string;

  // advanced-mapか
  advanced: boolean;

  params: ParamsState;
  edit: EditState;
  customParts: CustomPartsState;
  project: ProjectState;
}
export default class ChipSelect extends React.Component<IPropChipSelect, {}> {
  constructor(props: IPropChipSelect) {
    super(props);

    this.handleChipSelect = this.handleChipSelect.bind(this);
    this.drawMainChip = this.drawMainChip.bind(this);
    this.drawMapchipChip = this.drawMapchipChip.bind(this);

    this.getImagesObject = memoizeOne(this.getImagesObject);
  }
  /**
   * Function to pack image urls into an object.
   */
  private getImagesObject(pattern: string, mapchip: string, chips: string) {
    return {
      pattern,
      mapchip,
      chips,
    };
  }
  /**
   * Function to generate cursor position from CursorState.
   */
  private getCursorPosition(
    cursor: editActions.CursorState | null,
  ): number | null {
    if (cursor == null || cursor.type === 'main') {
      return null;
    }
    return cursor.id;
  }
  /**
   * Return the number of chips.
   */
  private chipNumber() {
    const {
      edit: { screen },
      customParts: { customParts },
      advanced,
    } = this.props;
    if (screen === 'layer') {
      return 256;
    } else {
      return this.getCurrentChipList(advanced, customParts).length;
    }
  }
  /**
   * Memoized function to get current list of current chip list.
   */
  private getCurrentChipList = memoizeOne(getCurrentChipList);
  /**
   * Ref to focusable area.
   */
  protected focusarea: HTMLElement | null = null;
  /**
   * Ref to main canvas.
   */
  protected canvas: HTMLCanvasElement | null = null;
  /**
   * Ref t chip preview canvas.
   */
  protected previewCanvas: HTMLCanvasElement | null = null;

  draw() {
    /*
    //下のやつも描画
    const canvas = this.previewCanvas;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (screen === 'layer') {
      const pen_layer = this.props.edit.pen_layer;
      if (pen_layer !== 0) {
        ctx.drawImage(
          this.images.mapchip,
          (pen_layer & 15) * 32,
          (pen_layer >> 4) * 32,
          32,
          32,
          32,
          0,
          32,
          32,
        );
      }
    } else {
      chip.drawChip(
        ctx,
        this.images,
        params,
        customParts,
        this.props.edit.pen,
        32,
        0,
        true,
      );
    }
    */
  }
  render() {
    const {
      params,
      edit,
      customParts: { customParts },
      pattern,
      mapchip,
      chips,
    } = this.props;
    const {
      cursor,
      chipselect_width,
      chipselect_height,
      chipselect_scroll,
      screen,
    } = edit;
    // var w= screen==="layer" ? 16 : 8;
    // const ks = advanced ? chip.advancedChipList : chip.chipList;
    // var h= screen==="layer" ? Math.ceil(256/w) : Math.ceil(ks.length/w);
    let pen, name;
    if (edit.screen === 'layer') {
      pen = this.props.edit.pen_layer;
      if (pen === 0) {
        name = '（空白）';
      } else {
        name = '(' + pen.toString(16) + ')';
      }
    } else {
      pen = this.props.edit.pen;
      let t = chip.chipFor(this.props.params, customParts, pen);
      if (t != null) {
        name = t.name;
      }
    }

    // 画像URLのセット
    const images = this.getImagesObject(pattern, mapchip, chips);
    // 描画するチップのリスト
    const chipNumber = this.chipNumber();
    // 色
    const stageBackColorObject = util.stageBackColor(params, edit);
    const backgroundColor = util.cssColor(stageBackColorObject);
    const cursorColor = util.cssColor(
      util.complementColor(stageBackColorObject),
    );
    // カーソル位置
    const cursorPosition = this.getCursorPosition(cursor);

    // ???
    const chipselectedStyle = { width: `${chipselect_width * 32}px` };

    return (
      <div className={styles.wrapper}>
        <ChipList
          className={styles.mainContainer}
          images={images}
          chipNumber={chipNumber}
          backgroundColor={backgroundColor}
          cursorColor={cursorColor}
          cursorPosition={cursorPosition}
          chipsWidth={chipselect_width}
          chipsHeight={chipselect_height}
          scrollY={chipselect_scroll}
          onFocusChange={this.handleFocusChange}
          onScroll={this.handleScroll}
          onResize={this.handleResize}
          onChipSelect={this.handleChipSelect}
          onDrawChip={
            screen === 'layer' ? this.drawMapchipChip : this.drawMainChip
          }
        />
        <div style={chipselectedStyle}>
          <div>
            <p>
              選択中： <code>{pen}</code> {name}
            </p>
          </div>
          <div>
            <canvas
              ref={e => (this.previewCanvas = e)}
              width="96"
              height="64"
            />
          </div>
        </div>
      </div>
    );
  }
  protected handleResize(width: number, height: number, scroll: number) {
    editActions.changeChipselectSize({ width, height });
    editActions.changeChipselectScroll({ y: scroll });
  }
  protected handleScroll(y: number) {
    editActions.changeChipselectScroll({ y });
  }
  protected handleChipSelect(chipIndex: number) {
    const {
      edit: { screen },
      advanced,
      customParts: { customParts },
    } = this.props;

    if (screen === 'layer') {
      editActions.changePenLayer({
        pen: chipIndex,
      });
    } else {
      editActions.changePen({
        pen: this.getCurrentChipList(advanced, customParts)[chipIndex],
      });
    }
  }
  private handleFocusChange(focus: boolean) {
    if (focus) {
      editLogics.focus('chipselect');
    } else {
      editLogics.blur('chipselect');
    }
  }
  /**
   * Function to draw one chip.
   */
  private drawMainChip(
    ctx: CanvasRenderingContext2D,
    images: IntoImages<Images>,
    x: number,
    y: number,
    chipIndex: number,
  ): void {
    const {
      advanced,
      params,
      customParts: { customParts },
    } = this.props;
    const chipList = this.getCurrentChipList(advanced, customParts);
    chip.drawChip(
      ctx,
      images,
      params,
      customParts,
      chipList[chipIndex],
      x,
      y,
      false,
    );
  }
  /**
   * Function to draw one mapchip.
   */
  private drawMapchipChip(
    ctx: CanvasRenderingContext2D,
    images: IntoImages<Images>,
    x: number,
    y: number,
    chipIndex: number,
  ): void {
    ctx.drawImage(
      images.mapchip,
      (chipIndex & 15) * 32,
      (chipIndex >> 4) * 32,
      32,
      32,
      x,
      y,
      32,
      32,
    );
  }
}

/**
 * Get currently available chips.
 */
function getCurrentChipList(
  advanced: boolean,
  customParts: CustomPartsState['customParts'],
): chip.ChipCode[] {
  if (advanced) {
    return chip.advancedChipList.concat(Object.keys(customParts));
  } else {
    return chip.chipList;
  }
}
