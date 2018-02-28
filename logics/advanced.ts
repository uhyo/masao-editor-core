// advanced-mapをON/OFFするlogic

import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';
import mapStore from '../stores/map';

export function setAdvanced(advanced: boolean): void {
  const map = mapStore.state;
  if (map.advanced === false && advanced === true) {
    // OK
    mapActions.setAdvanced({
      advanced,
    });
  } else if (mapStore.state.advanced === true && advanced === false) {
    // OFFにするとき壊れないように注意
    if (map.data.some(({ size }) => size.x !== 180 || size.y !== 30)) {
      // これはむり
      return;
    }
    // OK!
    mapActions.setAdvanced({
      advanced,
    });
    // historyを消す
    for (let i = 0; i < mapStore.state.stages; i++) {
      const stageData = mapStore.state.data[i];
      historyActions.newHistory({
        stage: i + 1,
        stageData,
      });
    }
  }
}
