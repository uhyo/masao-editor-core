// command
import editStore from '../stores/edit';
import * as historyLogics from './history';

// 定義されたコマンド
export type Command =
    // history command
    'back' | 'forward';

export function run(command: Command): void{
    switch(command){
        case 'back': {
            historyLogics.back(editStore.state.stage);
            break;
        }
        case 'forward': {
            historyLogics.forward(editStore.state.stage);
            break;
        }
    }
}
