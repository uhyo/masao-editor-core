import { EditState, ParamsState } from '../../../../../../stores';
import {
  cssColor,
  complementColor,
  stageBackColor,
} from '../../../../../../scripts/util';

/**
 * Draw current tool.
 */
export function drawTool(
  ctx: CanvasRenderingContext2D,
  edit: EditState,
  params: ParamsState,
): void {
  const { tool, scroll_x, scroll_y } = edit;
  if (tool && (tool.type === 'rect' || tool.type === 'select')) {
    const { start_x, start_y, end_x, end_y } = tool;

    // 四角形を描画
    const pcl = cssColor(complementColor(stageBackColor(params, edit)));

    ctx.save();
    ctx.fillStyle = pcl;
    ctx.strokeStyle = pcl;

    const left = Math.min(start_x, end_x);
    const top = Math.min(start_y, end_y);
    const right = Math.max(start_x, end_x);
    const bottom = Math.max(start_y, end_y);

    const sx = (left - scroll_x) * 32;
    const sy = (top - scroll_y) * 32;
    const w = (right - left) * 32 + 31;
    const h = (bottom - top) * 32 + 31;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + w, sy);
    ctx.lineTo(sx + w, sy + h);
    ctx.lineTo(sx, sy + h);
    ctx.closePath();

    if (tool.type === 'rect') {
      ctx.globalAlpha = 0.25;
      ctx.fill();
      ctx.globalAlpha = 0.75;
      ctx.stroke();
    } else if (tool.type === 'select') {
      ctx.globalAlpha = 0.15;
      ctx.fill();
      ctx.globalAlpha = 0.75;
      ctx.setLineDash([5, 8]);
      ctx.stroke();
    }

    ctx.restore();
  }
}
