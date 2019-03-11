import { RefObject, useEffect } from 'react';
import { EditState, ParamsState, StageData } from '../../../../../../stores';
import { BackLayers } from '../useBackLayer';
import { prerender } from './prerender';
import { paintBackground } from './paintBackground';
import { setCorrection } from './correction';
import { paintMap } from './paintMap';
import { drawCursor } from './drawCursor';
import { drawTool } from './drawTool';

/**
 * Draw on a given canvas.
 */
export function useDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  backLayers: BackLayers,
  stage: StageData,
  edit: EditState,
  params: ParamsState,
): void {
  useEffect(() => {
    // draw
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    const requestId = requestAnimationFrame(() => {
      const { view_width, view_height } = edit;
      // 描画対象領域の実際の大きさ
      const width = view_width * 32;
      const height = view_height * 32;

      if (process.env.NODE_ENV !== 'production') {
        console.time('useDraw');
      }

      // prerender on backlayer canvas
      prerender(backLayers, edit);
      // clear the whole canvas
      ctx.clearRect(0, 0, width, height);
      // first, paint with background color.
      paintBackground(ctx, stage, edit, params);

      ctx.save();
      // correct view position on right edge or bottom edge.
      setCorrection(ctx, edit);
      // paint maps.
      paintMap(ctx, backLayers, edit);
      // draw tool if exists.
      drawTool(ctx, edit, params);
      // draw cursor if exists.
      drawCursor(ctx, edit, params);

      ctx.restore();
      if (process.env.NODE_ENV !== 'production') {
        console.timeEnd('useDraw');
      }
    });
    return () => cancelAnimationFrame(requestId);
  });
}
