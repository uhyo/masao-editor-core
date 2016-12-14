import * as extend from 'extend';
import * as masao from 'masao';
import {
    Store,
} from '../scripts/reflux-util';

import * as paramActions from '../actions/params';

export type ParamsState = Record<string, string>;
export class ParamsStore extends Store<ParamsState>{
    constructor(){
        super();
        this.listenables = paramActions;
        this.state = masao.param.addDefaults({});
    }
    private onChangeParam({param,value}: paramActions.ChangeParamAction){
        this.setState(extend({}, this.state, {
            [param]: value,
        }));
    }
    private onChangeParams(obj: Record<string, string>){
        this.setState(extend({}, this.state, obj));
    }
    private onResetParams(obj: Record<string, string>){
        this.setState({
            params: extend({}, obj),
        });
    }
}
export default new ParamsStore();

