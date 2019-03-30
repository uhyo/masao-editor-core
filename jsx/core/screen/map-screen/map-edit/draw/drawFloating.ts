import { EditState, ParamsState } from '../../../../../../stores';
import { MutableRefObject } from 'react';
import {
  cssColor,
  complementColor,
  stageBackColor,
} from '../../../../../../scripts/util';

/**
 * Draw floating map.
 */
export function drawFloating(
  ctx: CanvasRenderingContext2D,
  edit: EditState,
  params: ParamsState,
  floatingCanvasRef: MutableRefObject<HTMLCanvasElement | null>,
) {
  const { floating, scroll_x, scroll_y } = edit;
  if (floating != null && floatingCanvasRef.current != null) {
    const { x, y, width, height } = floating;
    if (floatingCanvasRef.current != null) {
      const canvas = floatingCanvasRef.current;
      // render floating mapchips.
      const dx = (x - scroll_x) * 32;
      const dy = (y - scroll_y) * 32;
      ctx.drawImage(canvas, dx, dy);
      // render borders.
      const pcl = cssColor(complementColor(stageBackColor(params, edit)));

      ctx.save();
      ctx.strokeStyle = pcl;
      const w = width * 32;
      const h = height * 32;

      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + w, dy);
      ctx.lineTo(dx + w, dy + h);
      ctx.lineTo(dx, dy + h);
      ctx.closePath();
      ctx.setLineDash([5, 8]);
      ctx.stroke();
      ctx.restore();
    }
  }
}
