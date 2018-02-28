import * as masao from 'masao';
import { Store } from '../scripts/reflux-util';

import * as paramActions from '../actions/params';

export type ParamsState = Record<string, string>;
export class ParamsStore extends Store<ParamsState> {
  constructor() {
    super();
    this.listenables = paramActions;
    this.state = masao.param.addDefaults({});
  }
  public onChangeParam({ param, value }: paramActions.ChangeParamAction) {
    this.setState({
      [param]: value,
    });
  }
  public onChangeParams(obj: Record<string, string>) {
    this.setState(obj);
  }
  public onResetParams(obj: Record<string, string>) {
    this.setState(obj);
  }
}
export default new ParamsStore();
