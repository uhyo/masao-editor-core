import {
    Action,
    createAction,
} from '../scripts/reflux-util';

export {
    Action,
};

/*
 * changeParam({
 *   param: string
 *   value: string
 * });
 *
 * changeParams({
 *   [param1]: [value1],...
 * });
 *
 * resetParams({
 *   [param1]: [value1],...
 * });
 */

export interface ChangeParamAction{
    param: string;
    value: string;
}
export const changeParam = createAction<ChangeParamAction>();
export const changeParams = createAction<Record<string, string>>();
export const resetParams = createAction<Record<string, string>>();
