// history logic
import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';

import editStore from '../stores/edit';
import historyStore from '../stores/history';
import mapStore, { StageData } from '../stores/map';
import updateStore from '../stores/update';

import { changeMapSize } from './edit';

export function back(stage: number): void {
  const oldStage = mapStore.state.data[stage - 1];
  historyActions.back({
    stage,
  });
  // 最新のやつを反映
  const newStage = historyStore.state.data[stage - 1].current;
  mapActions.loadMap({
    stage,
    ...newStage,
  });

  stageChange(stage, oldStage, newStage);
  updateStore.update();
}

export function forward(stage: number): void {
  const oldStage = mapStore.state.data[stage - 1];
  historyActions.forward({
    stage,
  });
  const newStage = historyStore.state.data[stage - 1].current;
  mapActions.loadMap({
    stage,
    ...historyStore.state.data[stage - 1].current,
  });

  stageChange(stage, oldStage, newStage);
  updateStore.update();
}

function stageChange(
  stage: number,
  oldStage: StageData,
  newStage: StageData,
): void {
  if (stage === editStore.state.stage) {
    if (
      oldStage.size.x !== newStage.size.x ||
      oldStage.size.y !== newStage.size.y
    ) {
      // ステージサイズの変更があった
      changeMapSize(newStage.size.x, newStage.size.y);
    }
  }
}
