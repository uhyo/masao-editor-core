import * as editActions from '../actions/edit';
import { setAdvanced, SetAdvancedAction } from '../actions/map';
import {
  Mode,
  Screen,
  ToolState,
  CursorState,
  FocusPlace,
  PointerState,
} from '../actions/edit';
import { Store } from '../scripts/reflux-util';
import { ChipCode } from '../scripts/chip';

// ツールの使用中状態

export interface EditState {
  /**
   * スクリーン
   */
  screen: Screen;
  /**
   * マップ編集画面の大きさx
   */
  view_width: number;
  /**
   * マップ編集画面の大きさy
   */
  view_height: number;
  /**
   * マップ編集画面の余りpx数x
   */
  view_width_remainder: number;
  /**
   * マップ編集画面の余りpx数y
   */
  view_height_remainder: number;
  /**
   * マップの表示位置x
   */
  scroll_x: number;
  /**
   * マップの表示位置y
   */
  scroll_y: number;
  /**
   * マップ編集画面のスクロールが右端に吸い付くかどうか
   */
  scroll_stick_right: boolean;
  /**
   * マップ編集画面のスクロールが左端に吸い付くかどうか
   */
  scroll_stick_bottom: boolean;
  /**
   * ステージ番号. 1, 2, 3, 4
   */
  stage: number;
  /**
   * エディットモード
   */
  mode: Mode;
  /**
   * ペン（メインマップ）
   */
  pen: ChipCode; // TODO
  /**
   * ペン（背景レイヤー）
   */
  pen_layer: number; // TODO
  /**
   * どのparamTypeを編集しているか
   */
  param_type: string; // TODO

  /**
   * グリッド表示
   */
  grid: boolean;
  /**
   * マップも表示
   */
  render_map: boolean;
  /**
   * 背景レイヤーも表示
   */
  render_layer: boolean;

  /**
   * ツール状態
   */
  tool: ToolState | null;

  /**
   * チップ選択画面の横幅
   */
  chipselect_width: number;
  /**
   * チップ選択画面のスクロール位置(Y)
   */
  chipselect_scroll: number;

  /**
   * フォーカスがどこにあるかを管理
   */
  focus: FocusPlace | null;
  /**
   * カーソルを利用するか
   */
  cursorEnabled: boolean;
  /**
   * キーボード用のカーソル
   */
  cursor: CursorState | null;

  /**
   * ポインタの状態
   */
  pointer: PointerState | null;

  /**
   * JSの警告をOKしたか
   */
  js_confirm: boolean;
}
export class EditStore extends Store<EditState> {
  constructor() {
    super();
    this.listenables = [
      editActions,
      {
        setAdvanced,
      },
    ];
    this.state = {
      screen: 'map',
      view_width: 16,
      view_height: 10,
      view_width_remainder: 0,
      view_height_remainder: 0,
      scroll_x: 0,
      scroll_y: 20,
      scroll_stick_right: false,
      scroll_stick_bottom: false,
      stage: 1,
      mode: 'pen',
      pen: 0,
      pen_layer: 0,
      param_type: '',
      grid: false,
      render_map: false,
      render_layer: false,
      tool: null,
      chipselect_width: 8,
      chipselect_scroll: 0,
      focus: null,
      cursor: null,
      cursorEnabled: false,
      pointer: null,
      js_confirm: false,
    };
  }
  onChangeScreen({ screen }: editActions.ChangeScreenAction) {
    if (this.state.screen !== screen) {
      this.setState({
        screen,
        chipselect_scroll: 0,
      });
    }
  }
  onChangeStage({ stage }: editActions.ChangeStageAction) {
    this.setState({
      stage,
    });
  }
  onChangeMode({ mode }: editActions.ChangeModeAction) {
    this.setState({
      mode,
    });
  }
  onChangeView({
    width,
    height,
    widthRemainder,
    heightRemainder,
  }: editActions.ChangeViewAction) {
    this.setState({
      view_width: width,
      view_height: height,
      view_width_remainder: widthRemainder,
      view_height_remainder: heightRemainder,
    });
  }
  onChangePen({ pen, mode }: editActions.ChangePenAction) {
    this.setState({
      pen,
      mode: mode === true ? 'pen' : this.state.mode,
    });
  }
  onChangePenLayer({ pen, mode }: editActions.ChangePenLayerAction) {
    this.setState({
      pen_layer: pen,
      mode: mode === true ? 'pen' : this.state.mode,
    });
  }
  onChangeParamType({ param_type }: editActions.ChangeParamTypeAction) {
    this.setState({
      param_type,
    });
  }
  onChangeGrid({ grid }: editActions.ChangeGridAction) {
    this.setState({
      grid,
    });
  }
  onChangeRenderMode({
    render_map,
    render_layer,
  }: editActions.ChangeRenderModeAction) {
    this.setState({
      render_map: render_map != null ? render_map : this.state.render_map,
      render_layer:
        render_layer != null ? render_layer : this.state.render_layer,
    });
  }
  onSetTool({ tool }: editActions.SetToolAction) {
    this.setState({
      tool,
    });
  }
  onScroll({ x, y, stickRight, stickBottom }: editActions.ScrollAction) {
    if (
      x !== this.state.scroll_x ||
      y !== this.state.scroll_y ||
      stickRight !== this.state.scroll_stick_right ||
      stickBottom !== this.state.scroll_stick_bottom
    ) {
      this.setState({
        scroll_x: x,
        scroll_y: y,
        scroll_stick_right: stickRight,
        scroll_stick_bottom: stickBottom,
      });
    }
  }
  onChangeChipselectSize({ width }: editActions.ChangeChipselectSizeAction) {
    if (width !== this.state.chipselect_width) {
      this.setState({
        chipselect_width: width,
      });
    }
  }
  onChangeChipselectScroll({ y }: editActions.ChangeChipselectScrollAction) {
    if (y !== this.state.chipselect_scroll) {
      this.setState({
        chipselect_scroll: y,
      });
    }
  }
  onSetAdvanced({  }: SetAdvancedAction) {
    // advancedのON/OFFでchipselectの大きさが変わるので
    this.setState({
      chipselect_scroll: 0,
    });
  }
  onSetFocus({ focus }: editActions.SetFocusAction) {
    this.setState({
      focus,
    });
  }
  onSetCursor({ cursor }: editActions.SetCursorAction) {
    this.setState({
      cursor,
      cursorEnabled: this.state.cursorEnabled || cursor != null,
    });
  }
  onSetPointer({ pointer }: editActions.SetPointerAction) {
    if (pointer !== this.state.pointer) {
      this.setState({
        pointer,
      });
    }
  }
  onJsConfirm({ confirm }: editActions.JsConfirmAction) {
    this.setState({
      js_confirm: confirm,
    });
  }
}

export default new EditStore();
