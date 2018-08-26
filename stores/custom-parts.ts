import { Store } from '../scripts/reflux-util';
import { CustomPartsData } from '../defs/map';
import * as customPartsActions from '../actions/custom-parts';

export interface CustomPartsState {
  /**
   * カスタムパーツの一覧
   */
  customParts: CustomPartsData;
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
}

export default new CustomPartsStore();
