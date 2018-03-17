import * as paramActions from '../actions/params';
import updateStore from '../stores/update';

/**
 * paramを一つ変更する
 */
export function changeParam(param: string, value: string): void {
  paramActions.changeParam({ param, value });
  updateStore.update();
}

/**
 * paramを複数変更する
 */
export function changeParams(params: Record<string, string>): void {
  paramActions.changeParams(params);
  updateStore.update();
}

/**
 * paramを全部戻す
 */
export function resetParams(params: Record<string, string>): void {
  paramActions.resetParams(params);
  updateStore.update();
}
