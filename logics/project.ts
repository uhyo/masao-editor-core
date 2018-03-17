import * as projectActions from '../actions/project';
import updateStore from '../stores/update';

/**
 * 正男のバージョンを切り替える
 */
export function changeVersion(version: '2.8' | 'fx16' | 'kani2'): void {
  projectActions.changeVersion({ version });
  updateStore.update();
}

/**
 * 拡張スクリプトを変える
 */
export function changeScript(script: string): void {
  projectActions.changeScript({ script });
  updateStore.update();
}
