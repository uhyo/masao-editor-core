import * as editActions from '../../actions/edit';
import editStore from '../../stores/edit';
import commandStore from '../../stores/command';
import { getCurrentGame } from '../game';
import { isInArea, availableArea } from './area';
import { noToolLogic, toolLogics, ToolLogic } from './tool';

/**
 * Get logic for given tool.
 * @param tool tool to get logic from. If omitted, current tool is selected.
 */
function getToolLogic(
  tool = editStore.state.tool,
): [ToolLogic<unknown>, editActions.ToolState | null] {
  const logic = tool == null ? noToolLogic : toolLogics[tool.type];
  return [logic, tool];
}

/**
 * マウスによるツールの設定
 * @returns クリック後のツール
 */
export function mouseDown(
  mode: editActions.Mode,
  x: number,
  y: number,
): editActions.ToolState | null {
  const [logic, tool] = getToolLogic();
  logic.mouseDown(mode, x, y, tool);
  return tool;
}

// ツールでマウスが動く
export function mouseMove(
  x: number,
  y: number,
  tool: editActions.ToolState | null = editStore.state.tool,
): void {
  const [logic] = getToolLogic(tool);
  logic.mouseMove(x, y, tool as any);
}

export function mouseUp(): void {
  const [logic, tool] = getToolLogic();
  logic.mouseUp(tool as any);
}

/**
 * Returns whether mouse move is enabled for current tool.
 */
export function isMouseMoveEnabled(): boolean {
  const [logic, tool] = getToolLogic();
  return logic.useMouseMove(tool);
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
