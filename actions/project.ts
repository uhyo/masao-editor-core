import {
    createAction,
} from '../scripts/reflux-util';

export interface ChangeVersionAction{
    version: '2.8' | 'fx16' | 'kani2';
}
export const changeVersion = createAction<ChangeVersionAction>();
