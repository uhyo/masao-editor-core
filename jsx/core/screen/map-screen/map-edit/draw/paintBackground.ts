import { EditState, ParamsState, StageData } from '../../../../../../stores';
import { cssColor, stageBackColor } from '../../../../../../scripts/util';

/**
 * Paint given canvas with background color.
 */
export function paintBackground(
  ctx: CanvasRenderingContext2D,
  stage: StageData,
  edit: EditState,
  params: ParamsState,
): void {
  const { scroll_x, scroll_y, view_width, view_height } = edit;
  const width = view_width * 32;
  const height = view_height * 32;
  // first, paint with background color.
  ctx.fillStyle = cssColor(stageBackColor(params, edit));
  // do not paint region outsize of current stage.
  const fillLeft = Math.max(0, -scroll_x * 32);
  const fillTop = Math.max(0, -scroll_y * 32);
  const fillWidth = Math.min(width - fillLeft, (stage.size.x - scroll_x) * 32);
  const fillHeight = Math.min(height - fillTop, (stage.size.y - scroll_y) * 32);
  ctx.fillRect(fillLeft, fillTop, fillWidth, fillHeight);
}
