import { EditState, ParamsState } from '../../../../../../stores';
import {
  cssColor,
  complementColor,
  stageBackColor,
} from '../../../../../../scripts/util';

/**
 * Draw current cursor on given canvas.
 */
export function drawCursor(
  ctx: CanvasRenderingContext2D,
  edit: EditState,
  params: ParamsState,
): void {
  const { cursor, scroll_x, scroll_y } = edit;
  if (cursor && cursor.type === 'main') {
    const { x, y } = cursor;

    // カーソルがあるので描画
    const pcl = cssColor(complementColor(stageBackColor(params, edit)));

    ctx.save();
    ctx.strokeStyle = pcl;

    const sx = (x - scroll_x) * 32 + 0.5;
    const sy = (y - scroll_y) * 32 + 0.5;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 31, sy);
    ctx.lineTo(sx + 31, sy + 31);
    ctx.lineTo(sx, sy + 31);
    ctx.closePath();

    ctx.stroke();

    ctx.restore();
  }
}
