import * as React from 'react';

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
import { ChipDisplay } from '../../../components/chip-display';

export interface IPropChipSelect {
  // 画像ファイル
  images: Images;

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
    this.drawMainChipFromCode = this.drawMainChipFromCode.bind(this);
    this.drawMapchipChipFromCode = this.drawMapchipChipFromCode.bind(this);
  }
  /**
   * Function to generate cursor position from CursorState.
   */
  private getCursorPosition(
    cursor: editActions.CursorState | null,
  ): number | null {
    if (cursor == null || cursor.type !== 'chipselect') {
      return null;
    }
    return cursor.id;
  }
  /**
   * Return the number of chips.
   */
  private chipNumber() {
    const {
      advanced,
      customParts: { customParts },
      edit: { screen },
    } = this.props;
    if (screen === 'layer') {
      return 256;
    } else {
      return editLogics.chipNumber(advanced, customParts);
    }
  }
  render() {
    const {
      params,
      edit,
      customParts: { customParts },
      images,
    } = this.props;
    const { cursor, chipselect_width, chipselect_scroll, screen } = edit;
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

    /// renderer of chip.
    const chipRenderer =
      screen === 'layer' ? this.drawMapchipChip : this.drawMainChip;
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
          scrollY={chipselect_scroll}
          onFocusChange={this.handleFocusChange}
          onScroll={this.handleScroll}
          onResize={this.handleResize}
          onChipSelect={this.handleChipSelect}
          onDrawChip={chipRenderer}
        />
        <div style={chipselectedStyle}>
          <div>
            <p>
              選択中： <code>{pen}</code> {name}
            </p>
          </div>
          <div>
            <ChipDisplay
              images={images}
              chipId={pen}
              onDrawChip={
                screen === 'layer'
                  ? this.drawMapchipChipFromCode
                  : this.drawMainChipFromCode
              }
            />
          </div>
        </div>
      </div>
    );
  }
  protected handleResize(width: number, _height: number, scroll: number) {
    editActions.changeChipselectSize({ width });
    editActions.changeChipselectScroll({ y: scroll });
  }
  protected handleScroll(y: number) {
    editActions.changeChipselectScroll({ y });
  }
  protected handleChipSelect(chipIndex: number) {
    const {
      advanced,
      customParts: { customParts },
      edit: { screen },
    } = this.props;

    if (screen === 'layer') {
      editActions.changePenLayer({
        pen: chipIndex,
      });
    } else {
      editActions.changePen({
        pen: editLogics.chipList(advanced, customParts)[chipIndex],
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
    const chipList = editLogics.chipList(advanced, customParts);
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
   * Function to draw one chip using ChipCode.
   */
  private drawMainChipFromCode(
    ctx: CanvasRenderingContext2D,
    images: IntoImages<Images>,
    x: number,
    y: number,
    chipCode: chip.ChipCode,
  ): void {
    const {
      params,
      customParts: { customParts },
    } = this.props;
    chip.drawChip(ctx, images, params, customParts, chipCode, x, y, false);
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
  /**
   * Function to draw one mapchip from ChipCode.
   * It just ignores invalid code.
   */
  private drawMapchipChipFromCode(
    ctx: CanvasRenderingContext2D,
    images: IntoImages<Images>,
    x: number,
    y: number,
    chipCode: chip.ChipCode,
  ): void {
    if ('string' === typeof chipCode) {
      return;
    }
    this.drawMapchipChip(ctx, images, x, y, chipCode);
  }
}
