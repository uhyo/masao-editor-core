import * as editActions from '../../actions/edit';
import * as mapActions from '../../actions/map';
import * as historyActions from '../../actions/history';
import editStore from '../../stores/edit';
import mapStore from '../../stores/map';

/**
 * floatingを定着させる
 */
export function mergeFloatingIntoMap(floating: editActions.FloatingState) {
  const { screen, stage } = editStore.state;
  if (screen !== 'map' && screen !== 'layer') {
    return;
  }

  mapActions.writeFloatingToMap({
    stage,
    map: screen,
    floating,
  });
  editActions.setFloating({
    floating: null,
  });
  historyActions.addHistory({
    stage,
    stageData: mapStore.state.data[stage - 1],
  });
}
