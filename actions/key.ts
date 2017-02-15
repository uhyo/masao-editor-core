import {
    createAction,
} from '../scripts/reflux-util';
import {
    Command,
} from '../logics/command';

export interface SetKeyBindingAction{
    binding: Record<string, Command>;
}
export const setKeyBinding = createAction<SetKeyBindingAction>();
