import { Store } from '../scripts/reflux-util';
import { CustomPartsData } from '../defs/map';
import * as customPartsActions from '../actions/custom-parts';

export interface CustomPartsState {
  /**
   * カスタムパーツの一覧
   */
  customParts: CustomPartsData;
  /**
   * 現在カスタムパーツ選択欄がフォーカスされているか
   */
  focus: 'chipselect' | null;
  /**
   * 現在選択されているカスタムパーツ
   */
  currentChip: number | null;
  /**
   * カスタムパーツ選択画面のカーソルの位置
   */
  cursorPosition: number | null;
}

export class CustomPartsStore extends Store<CustomPartsState> {
  constructor() {
    super();
    this.listenables = [customPartsActions];
    this.state = {
      customParts: {},
      focus: null,
      currentChip: null,
      cursorPosition: null,
    };
  }
  /**
   * カスタムパーツ定義を読み込む
   */
  public onLoadCustomParts({
    customParts,
  }: customPartsActions.LoadCustomPartsAction) {
    // 選択済みチップを更新
    const newCurrentChip = Object.keys(customParts).length > 0 ? 0 : null;
    this.setState({
      customParts,
      currentChip: newCurrentChip,
    });
  }
  /**
   * フォーカス状態をセット
   */
  public onSetFocus({ focus }: customPartsActions.SetFocusAction) {
    this.setState({ focus });
  }
  /**
   * カーソルの位置をセット
   */
  public onSetCursor({ cursor }: customPartsActions.SetCursorAction) {
    this.setState({ cursorPosition: cursor });
  }
  /**
   * 現在のチップを選択
   */
  public onSetCurrentChip({
    chipIndex,
  }: customPartsActions.SetCurrentChipAction) {
    this.setState({ currentChip: chipIndex });
  }
  /**
   * カスタムパーツの名前を変更
   */
  public onSetCustomChipName({
    chipCode,
    name,
  }: customPartsActions.SetCustomChipNameAction) {
    this.setState({
      customParts: {
        ...this.state.customParts,
        [chipCode]: {
          ...this.state.customParts[chipCode]!,
          name,
        },
      },
    });
  }
  /**
   * カスタムパーツのベースを変更
   */
  public onSetCustomChipBase({
    chipCode,
    base,
  }: customPartsActions.SetCustomChipBaseAction) {
    const { customParts } = this.state;
    const current = customParts[chipCode];
    if (current == null) {
      // TODO ???
      return;
    }
    if (current.extends === base) {
      // not changed
      return;
    }
    this.setState({
      customParts: {
        ...customParts,
        [chipCode]: {
          ...current,
          extends: base,
          properties: {},
        },
      },
    });
  }
  /**
   * カスタムパーツのプロパティを設定
   */
  public onSetCustomPropertyValue({
    chipCode,
    propertyName,
    value,
  }: customPartsActions.SetCustomPropertyValueAction) {
    this.setState({
      customParts: {
        ...this.state.customParts,
        [chipCode]: {
          ...this.state.customParts[chipCode]!,
          properties: {
            ...this.state.customParts[chipCode]!.properties,
            [propertyName]: value,
          },
        },
      },
    });
  }
  /**
   * 新しいカスタムパーツを追加
   */
  public onAddNewCustomParts({
    chipCode,
    definition,
  }: customPartsActions.AddNewCustomPartsAction) {
    this.setState({
      customParts: {
        ...this.state.customParts,
        [chipCode]: definition,
      },
    });
  }
  /**
   * カスタムパーツを消去
   */
  public onDeleteCustomParts({
    chipCode,
  }: customPartsActions.DeleteCustomPartsAction) {
    const { customParts, cursorPosition, currentChip } = this.state;
    const removedIndex = Object.keys(customParts).indexOf(chipCode);
    const newCursorPosition =
      cursorPosition == null
        ? null
        : removedIndex <= cursorPosition
          ? cursorPosition === 0
            ? null
            : cursorPosition - 1
          : cursorPosition;
    const newCurrentChip =
      currentChip == null || currentChip === removedIndex ? null : currentChip;
    const { [chipCode]: _, ...rest } = this.state.customParts;
    this.setState({
      customParts: rest,
      cursorPosition: newCursorPosition,
      currentChip: newCurrentChip,
    });
  }
}

export default new CustomPartsStore();
