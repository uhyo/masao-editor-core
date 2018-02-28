import { Action, createAction } from '../scripts/reflux-util';
import { Command } from '../logics/command';

export { Action };

export interface SetKeyBindingAction {
  binding: Record<string, Command>;
}
export const setKeyBinding = createAction<SetKeyBindingAction>();
