import { Action } from '../../scripts/reflux-util';
import * as editActions from '../../actions/edit';
import * as mapActions from '../../actions/map';
import * as historyActions from '../../actions/history';
import editStore from '../../stores/edit';
import mapStore from '../../stores/map';
import commandStore from '../../stores/command';
import updateStore from '../../stores/update';
import { getCurrentGame } from '../game';
import { isInArea, availableArea } from './area';
import { scroll } from './scroll';
import { ChipCode } from '../../scripts/chip';

type Screen = editActions.Screen;
/**
 * Type of chip per screen.
 * TODO
 */
type ChipCodeForScreen<T extends editActions.Screen> = T extends 'layer'
  ? number
  : ChipCode;

// マウスによるツールの設定
export function mouseDown(
  mode: editActions.Mode,
  x: number,
  y: number,
): editActions.ToolState | null {
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
      const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

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
    mouseMove(x, y, tool);
  }
  return tool;
}

// ツールでマウスが動く
export function mouseMove(
  x: number,
  y: number,
  tool: editActions.ToolState | null = editStore.state.tool,
): void {
  if (tool == null) {
    return;
  }
  const edit = editStore.state;
  const { screen, scroll_x, scroll_y } = edit;
  const stage = mapStore.state.data[edit.stage - 1];

  const mapdata = screen === 'layer' ? stage.layer : stage.map;
  const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

  const {
    left: sc_left,
    top: sc_top,
    right: sc_right,
    bottom: sc_bottom,
  } = availableArea();

  if (tool.type === 'pen') {
    const cx = x + scroll_x;
    const cy = y + scroll_y;

    if (cx < sc_left || cy < sc_top || cx >= sc_right || cy >= sc_bottom) {
      // 有効範囲外
      return;
    }

    if (mapdata[cy] && mapdata[cy][cx] !== pen) {
      updateStore.update();
      mapUpdateAction(screen)({
        stage: edit.stage,
        x: cx,
        y: cy,
        chip: pen,
      });
    }
  } else if (tool.type === 'eraser') {
    const cx = x + scroll_x;
    const cy = y + scroll_y;

    if (cx < sc_left || cy < sc_top || cx >= sc_right || cy >= sc_bottom) {
      // ステージ外
      return;
    }

    if (mapdata[cy] && mapdata[cy][cx] !== 0) {
      updateStore.update();
      mapUpdateAction(screen)({
        stage: edit.stage,
        x: cx,
        y: cy,
        chip: 0,
      });
    }
  } else if (tool.type === 'hand') {
    // スクロール座標を計算
    let sx = tool.mouse_sx - x + tool.scroll_sx;
    let sy = tool.mouse_sy - y + tool.scroll_sy;

    scroll({
      x: sx,
      y: sy,
    });
  } else if (
    tool.type === 'rect' ||
    (tool.type === 'select' && tool.selecting)
  ) {
    // 四角形の描画
    const { end_x, end_y } = tool;

    let rx = x + scroll_x;
    let ry = y + scroll_y;

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
      editActions.setTool({
        tool: {
          ...tool,
          end_x: rx,
          end_y: ry,
        },
      });
    }
  }
}

export function mouseUp(): void {
  const edit = editStore.state;
  const { tool, screen, stage } = edit;

  if (tool == null) {
    return;
  }

  if (tool.type === 'rect') {
    const { start_x, start_y, end_x, end_y } = tool;
    const [left, right] =
      start_x <= end_x ? [start_x, end_x] : [end_x, start_x];
    const [top, bottom] =
      start_y <= end_y ? [start_y, end_y] : [end_y, start_y];

    const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

    updateStore.update();
    mapUpdateRectAction(screen)({
      stage,
      left,
      top,
      right,
      bottom,
      chip: pen,
    });

    editActions.setTool({
      tool: null,
    });
  } else if (tool.type === 'select') {
    // select tool remains, others disappear.
    editActions.setTool({
      tool: {
        ...tool,
        selecting: false,
      },
    });
  } else {
    // other tools disappear.
    editActions.setTool({
      tool: null,
    });
  }

  if (tool.type === 'pen' || tool.type === 'eraser' || tool.type === 'rect') {
    const stage = editStore.state.stage;
    historyActions.addHistory({
      stage,
      stageData: mapStore.state.data[stage - 1],
    });
  }
}

/**
 * マウスクリック
 */
export function click(x: number, y: number, button: number | null): void {
  if (button === 1) {
    // 中クリック: この位置からテストプレイ
    const { scroll_x, scroll_y, stage } = editStore.state;
    const mx = x + scroll_x;
    const my = y + scroll_y;

    if (isInArea(mx, my, availableArea())) {
      commandStore.invokeCommand({
        type: 'testplay',
        game: getCurrentGame({
          masaoPosition: {
            x: mx,
            y: my,
          },
        }),
        stage,
      });
    }
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
