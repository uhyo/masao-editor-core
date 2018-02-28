import { Action, createAction } from '../scripts/reflux-util';

export { Action };

export interface ChangeVersionAction {
  version: '2.8' | 'fx16' | 'kani2';
}
export const changeVersion = createAction<ChangeVersionAction>();

export interface ChangeScriptAction {
  script: string;
}
export const changeScript = createAction<ChangeScriptAction>();
