import { Store } from '../scripts/reflux-util';
import { CustomPartsData } from '../defs/map';
import * as customPartsActions from '../actions/custom-parts';

export interface CustomPartsState {
  /**
   * カスタムパーツの一覧
   */
  customParts: CustomPartsData;
}

export class CustomPartsStore extends Store<CustomPartsState> {
  constructor() {
    super();
    this.listenables = [customPartsActions];
    this.state = {
      customParts: {},
    };
  }
  /**
   * カスタムパーツ定義を読み込む
   */
  public onLoadCustomParts({
    customParts,
  }: customPartsActions.LoadCustomPartsAction) {
    this.setState({
      customParts,
    });
  }
}

export default new CustomPartsStore();
