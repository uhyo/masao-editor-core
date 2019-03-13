import * as editActions from '../../actions/edit';
import { ToolState, Mode, Action } from '../../actions/edit';
import * as mapActions from '../../actions/map';
import * as historyActions from '../../actions/history';
import editStore, { EditStore } from '../../stores/edit';
import mapStore from '../../stores/map';
import updateStore from '../../stores/update';
import { ChipCode } from '../../scripts/chip';
import { isInArea, availableArea } from './area';
import { scroll } from './scroll';
import { RectTool, SelectTool } from '../../actions/edit/tool';
import { Rect } from '.';

type Screen = editActions.Screen;
/**
 * Type of chip per screen.
 * TODO
 */
type ChipCodeForScreen<T extends editActions.Screen> = T extends 'layer'
  ? number
  : ChipCode;

/**
 * Set of logics for one tool.
 */
export interface ToolLogic<T> {
  /**
   * Function called when mouse button is pressed.
   */
  mouseDown(mode: Mode, x: number, y: number, tool: T): void;
  /**
   * Function called when mouse moved.
   */
  mouseMove(x: number, y: number, tool: T): void;
  /**
   * Function called when mouse is up.
   */
  mouseUp(tool: T): void;
  /**
   * Function to determine whether mousemove handler should be registerd.
   */
  useMouseMove(tool: T): boolean;
}
type ToolLogicCollection = {
  [T in ToolState['type']]: ToolLogic<Extract<ToolState, { type: T }>>
};

/**
 * Normal logic of mousedown (create new tool according to current mode)
 */
const normalMouseDownLogic = (mode: Mode, x: number, y: number) => {
  const edit = editStore.state;
  const { scroll_x, scroll_y, screen, stage } = edit;
  let tool: editActions.ToolState | null = null;
  if (mode === 'pen') {
    tool = {
      type: 'pen',
    };
  } else if (mode === 'eraser') {
    tool = {
      type: 'eraser',
    };
  } else if (mode === 'hand') {
    tool = {
      type: 'hand',
      mouse_sx: x,
      mouse_sy: y,
      scroll_sx: scroll_x,
      scroll_sy: scroll_y,
    };
  } else if (mode === 'spuit') {
    const rx = x + scroll_x;
    const ry = y + scroll_y;

    if (screen === 'layer') {
      const map = mapStore.state.data[stage - 1].layer;
      const chip = map[ry] ? map[ry][rx] || 0 : 0;
      editActions.changePenLayer({
        pen: chip,
        mode: true,
      });
    } else {
      const map = mapStore.state.data[stage - 1].map;
      const chip = map[ry] ? map[ry][rx] || 0 : 0;
      editActions.changePen({
        pen: chip,
        mode: true,
      });
    }
  } else if (mode === 'rect') {
    const rx = x + scroll_x;
    const ry = y + scroll_y;

    // 有効範囲内か確認
    if (isInArea(rx, ry, availableArea())) {
      tool = {
        type: 'rect',
        start_x: rx,
        start_y: ry,
        end_x: rx,
        end_y: ry,
      };
    }
  } else if (mode === 'fill') {
    const rx = x + scroll_x;
    const ry = y + scroll_y;

    // 有効範囲内か確認
    if (isInArea(rx, ry, availableArea())) {
      const pen = getCurrentPen();

      mapUpdateFillAction(screen)({
        stage,
        x: rx,
        y: ry,
        chip: pen,
      });
      historyActions.addHistory({
        stage,
        stageData: mapStore.state.data[stage - 1],
      });
    }
  } else if (mode === 'select') {
    const rx = x + scroll_x;
    const ry = y + scroll_y;

    if (isInArea(rx, ry, availableArea())) {
      tool = {
        type: 'select',
        selecting: true,
        start_x: rx,
        start_y: ry,
        end_x: rx,
        end_y: ry,
      };
    }
  }
  editActions.setTool({
    tool,
  });

  if (tool != null && mode !== 'hand') {
    toolLogics[tool.type].mouseMove(x, y, tool as any);
  }
  return tool;
};
/**
 * Logic for when no tool is active.
 */
export const noToolLogic: ToolLogic<null> = {
  mouseDown: normalMouseDownLogic,
  mouseMove: () => {},
  mouseUp: () => {},
  useMouseMove: () => false,
};

function getCurrentMapData(editStore: EditStore) {
  const edit = editStore.state;
  const { screen, stage } = edit;
  const stageData = mapStore.state.data[stage - 1];

  const mapdata = screen === 'layer' ? stageData.layer : stageData.map;
  return {
    mapdata,
  };
}
/**
 * Logics for each tool.
 */
export const toolLogics: ToolLogicCollection = {
  pen: {
    mouseDown: normalMouseDownLogic,
    mouseMove(x, y) {
      const { mapdata } = getCurrentMapData(editStore);
      const pen = getCurrentPen();
      const { screen, stage } = editStore.state;
      const { x: cx, y: cy } = getMapPoint(x, y);

      if (!isInArea(cx, cy, availableArea())) {
        // 有効範囲外
        return;
      }

      if (mapdata[cy] && mapdata[cy][cx] !== pen) {
        updateStore.update();
        mapUpdateAction(screen)({
          stage,
          x: cx,
          y: cy,
          chip: pen,
        });
      }
    },
    mouseUp() {
      editActions.setTool({
        tool: null,
      });
      addCurrentStageHistory();
    },
    useMouseMove: () => true,
  },
  eraser: {
    mouseDown: normalMouseDownLogic,
    mouseMove(x, y) {
      const { mapdata } = getCurrentMapData(editStore);
      const { stage, screen } = editStore.state;

      const { x: cx, y: cy } = getMapPoint(x, y);

      if (!isInArea(cx, cy, availableArea())) {
        // 有効範囲外
        return;
      }

      if (mapdata[cy] && mapdata[cy][cx] !== 0) {
        updateStore.update();
        mapUpdateAction(screen)({
          stage,
          x: cx,
          y: cy,
          chip: 0,
        });
      }
    },
    mouseUp() {
      editActions.setTool({
        tool: null,
      });
      addCurrentStageHistory();
    },
    useMouseMove: () => true,
  },
  hand: {
    mouseDown: normalMouseDownLogic,
    mouseMove(x, y, tool) {
      // スクロール座標を計算
      let sx = tool.mouse_sx - x + tool.scroll_sx;
      let sy = tool.mouse_sy - y + tool.scroll_sy;

      scroll({
        x: sx,
        y: sy,
      });
    },
    mouseUp() {
      editActions.setTool({
        tool: null,
      });
    },
    useMouseMove: () => true,
  },
  rect: {
    mouseDown: normalMouseDownLogic,
    mouseMove: rectLikeMouseMove,
    mouseUp(tool) {
      const { stage, screen } = editStore.state;
      const { start_x, start_y, end_x, end_y } = tool;
      const [left, right] =
        start_x <= end_x ? [start_x, end_x] : [end_x, start_x];
      const [top, bottom] =
        start_y <= end_y ? [start_y, end_y] : [end_y, start_y];

      const chip = getCurrentPen();

      updateStore.update();
      mapUpdateRectAction(screen)({
        stage,
        left,
        top,
        right,
        bottom,
        chip,
      });

      editActions.setTool({
        tool: null,
      });
      addCurrentStageHistory();
    },
    useMouseMove: () => true,
  },
  select: {
    mouseDown(mode, x, y, tool) {
      if (mode === 'fill') {
        // if fill is done on selection, then special treatment.
        const rect = rectLikeToolToRect(tool);
        const { x: cx, y: cy } = getMapPoint(x, y);
        if (isInArea(cx, cy, rect)) {
          const { screen, stage } = editStore.state;
          const chip = getCurrentPen();
          updateStore.update();
          mapUpdateRectAction(screen)({
            stage,
            chip,
            ...rect,
          });
          editActions.setTool({
            tool: null,
          });
          return;
        }
      }
      normalMouseDownLogic(mode, x, y);
    },
    mouseMove(x, y, tool) {
      if (tool.selecting) {
        rectLikeMouseMove(x, y, tool);
      } else {
        // 選択範囲に入っていればポインタを設定
        const { x: cx, y: cy } = getMapPoint(x, y);
        const pointer = isInArea(cx, cy, rectLikeToolToRect(tool))
          ? 'move'
          : null;
        editActions.setPointer({
          pointer,
        });
      }
    },
    mouseUp(tool) {
      // select tool remains, others disappear.
      editActions.setTool({
        tool: {
          ...tool,
          selecting: false,
        },
      });
    },
    useMouseMove: () => true,
  },
};

/**
 * Add to the history current stage.
 */
function addCurrentStageHistory() {
  const stage = editStore.state.stage;
  historyActions.addHistory({
    stage,
    stageData: mapStore.state.data[stage - 1],
  });
}

/**
 * Convert rect-like object to a normalized Rect.
 */
function rectLikeToolToRect({
  start_x,
  start_y,
  end_x,
  end_y,
}: RectTool | SelectTool): Rect {
  const left = Math.min(start_x, end_x);
  const right = Math.max(start_x, end_x);
  const top = Math.min(start_y, end_y);
  const bottom = Math.max(start_y, end_y);
  return { left, right, top, bottom };
}

/**
 * Get current code of pen.
 */
function getCurrentPen(): ChipCode {
  const { screen, pen, pen_layer } = editStore.state;
  return screen === 'layer' ? pen_layer : pen;
}

/**
 * Convert screen position to map position.
 */
function getMapPoint(x: number, y: number) {
  const { scroll_x, scroll_y } = editStore.state;
  return {
    x: x + scroll_x,
    y: y + scroll_y,
  };
}
/**
 * Handle mosemove for rect-like tool.
 */
function rectLikeMouseMove(x: number, y: number, tool: RectTool | SelectTool) {
  // マウスで句形範囲をしているときの動作
  const { scroll_x, scroll_y } = editStore.state;
  const { end_x, end_y } = tool;

  let rx = x + scroll_x;
  let ry = y + scroll_y;

  const {
    left: sc_left,
    right: sc_right,
    top: sc_top,
    bottom: sc_bottom,
  } = availableArea();

  // 画面内に収まるように補正
  if (rx < sc_left) {
    rx = sc_left;
  } else if (rx >= sc_right) {
    rx = sc_right - 1;
  }
  if (ry < sc_top) {
    ry = sc_top;
  } else if (ry >= sc_bottom) {
    ry = sc_bottom - 1;
  }

  if (end_x !== rx || end_y !== ry) {
    // 前と変わっているときのみアクションを発火する最適化
    editActions.setTool({
      tool: {
        ...tool,
        end_x: rx,
        end_y: ry,
      },
    });
  }
}

function mapUpdateAction<S extends Screen>(
  screen: S,
): Action<mapActions.UpdateMapAction<ChipCodeForScreen<S>>> {
  if (screen === 'layer') {
    return mapActions.updateLayer as any;
  } else {
    return mapActions.updateMap;
  }
}
function mapUpdateRectAction<S extends Screen>(
  screen: S,
): Action<mapActions.UpdateMapRectAction<ChipCodeForScreen<S>>> {
  if (screen === 'layer') {
    return mapActions.updateLayerRect as any;
  } else {
    return mapActions.updateMapRect;
  }
}
/**
 * Update map to fill dedicated area.
 */
function mapUpdateFillAction<S extends Screen>(
  screen: S,
): Action<mapActions.UpdateMapFillAction<ChipCodeForScreen<S>>> {
  if (screen === 'layer') {
    return mapActions.updateLayerFill as any;
  } else {
    return mapActions.updateMapFill;
  }
}