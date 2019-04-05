import editStore from '../../stores/edit';
import {
  mapUpdateRectAction,
  rectLikeToolToRect,
  addCurrentStageHistory,
  mapUpdateAction,
} from './tool';
import { setTool, setFloating } from '../../actions/edit';

/**
 * Logic for delete button.
 */
export function deleteLogic() {
  const {
    stage,
    screen,
    tool,
    floating,
    cursor,
    cursorEnabled,
  } = editStore.state;
  if (screen !== 'map' && screen !== 'layer') {
    return;
  }
  if (tool != null && tool.type === 'select') {
    // selectツールの場合は全削除
    mapUpdateRectAction(screen)({
      stage,
      chip: 0,
      ...rectLikeToolToRect(tool),
    });
    setTool({
      tool: null,
    });
    addCurrentStageHistory();
    return;
  }
  if (floating != null) {
    // floatingは単に消す
    setFloating({
      floating: null,
    });
    return;
  }
  if (cursorEnabled && cursor != null && cursor.type === 'main') {
    // カーソルの場合は消す
    mapUpdateAction(screen)({
      stage,
      chip: 0,
      x: cursor.x,
      y: cursor.y,
    });
  }
}
