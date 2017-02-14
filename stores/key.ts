// key-command binding
import {
    Store,
} from '../scripts/reflux-util';
import {
    Command,
} from '../logics/command';

const defaultBinding: Record<string, Command> = {
    // 進む-戻る
    'Ctrl:z': 'back',
    'Ctrl:Shift:z': 'forward',
    'Ctrl:r': 'forward',
};

export interface KeyState{
    binding: Record<string, Command>;
}

export class KeyStore extends Store<KeyState>{
    constructor(){
        super();
        this.listenables = [];

        this.state = {
            binding: defaultBinding,
        };
    }
}

export default new KeyStore();
