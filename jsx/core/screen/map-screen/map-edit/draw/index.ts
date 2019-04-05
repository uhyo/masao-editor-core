import { RefObject, useEffect } from 'react';
import {
  EditState,
  ParamsState,
  StageData,
  LastUpdateData,
  CustomPartsState,
} from '../../../../../../stores';
import { BackLayers } from '../useBackLayer';
import { prerender } from './prerender';
import { paintBackground } from './paintBackground';
import { setCorrection } from './correction';
import { paintMap } from './paintMap';
import { drawCursor } from './drawCursor';
import { drawTool } from './drawTool';
import {
  useUpdateSignal,
  compareArrayInequality,
} from '../../../../../../scripts/useUpdateSignal';
import { IntoImages } from '../../../../../components/load-images';
import { Images } from '../../../../../../defs/images';
import { CursorState } from '../../../../../../actions/edit';
import { useFloatingCanvas } from './useFloatingCanvas';
import { drawFloating } from './drawFloating';

/**
 * Draw on a given canvas.
 */
export function useDraw(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  images: IntoImages<Images> | null,
  backLayers: BackLayers,
  stage: StageData,
  edit: EditState,
  params: ParamsState,
  customParts: CustomPartsState,
  lastUpdate: LastUpdateData,
): void {
  // prepare canvas whose content is floating.
  const floatingCanvas = useFloatingCanvas(images, edit, params, customParts);
  // check some of values have changed.
  const drawSignal1 = useUpdateSignal<any[]>(compareArrayInequality, [
    images,
    edit.stage,
    lastUpdate,
    params,
    edit.view_width,
    edit.view_height,
    edit.view_width_remainder,
    edit.view_height_remainder,
    edit.scroll_stick_right,
    edit.scroll_stick_bottom,
    edit.screen,
    edit.render_map,
    edit.render_layer,
    edit.scroll_x,
    edit.scroll_y,
    edit.tool,
    edit.floating,
  ]);
  const drawSignal2 = useUpdateSignal<[CursorState | null]>(
    ([c1], [c2]) => {
      // カーソルが変化したか判定
      if (c1 === c2) {
        return false;
      }
      if (c1 == null) {
        return c2!.type === 'main';
      }
      if (c2 == null) {
        return c1.type === 'main';
      }
      return c1.type === 'main' || c2.type === 'main';
    },
    [edit.cursor],
  );
  // check values inside edit.
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
      // draw floating if exists.
      drawFloating(ctx, edit, params, floatingCanvas);
      // draw cursor if exists.
      drawCursor(ctx, edit, params);

      ctx.restore();
      if (process.env.NODE_ENV !== 'production') {
        console.timeEnd('useDraw');
      }
    });
    return () => cancelAnimationFrame(requestId);
  }, [drawSignal1, drawSignal2]);
}
