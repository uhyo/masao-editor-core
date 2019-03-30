import { useRef, useEffect, MutableRefObject } from 'react';
import {
  ParamsState,
  CustomPartsState,
  EditState,
} from '../../../../../../stores';
import { cssColor, stageBackColor } from '../../../../../../scripts/util';
import { drawLayerChip, drawMapChip } from '../draw-chip';
import { IntoImages } from '../../../../../components/load-images';
import { Images } from '../../../../../../defs/images';
import { FloatingState } from '../../../../../../actions/edit';

/**
 * Prepare a canvas with content of floating layer.
 */
export function useFloatingCanvas(
  images: IntoImages<Images> | null,
  edit: EditState,
  params: ParamsState,
  customParts: CustomPartsState,
): MutableRefObject<HTMLCanvasElement | null> {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFloatingRef = useRef<FloatingState | null>(null);
  const { stage, floating } = edit;
  useEffect(() => {
    if (floating == null) {
      // free current canvas.
      canvasRef.current = null;
    } else if (
      prevFloatingRef.current == null ||
      prevFloatingRef.current.width !== floating.width ||
      prevFloatingRef.current.height !== floating.height
    ) {
      // Size of floating is different.
      // newly allocate canvas.
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      canvas.width = floating.width * 32;
      canvas.height = floating.height * 32;
    }
    prevFloatingRef.current = floating;
    if (floating && canvasRef.current != null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx == null) {
        return;
      }
      // fill with background color so chips under the floating are not seen.
      ctx.fillStyle = cssColor(stageBackColor(params, edit));
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < floating.height; y++) {
        for (let x = 0; x < floating.width; x++) {
          // TODO
          if (edit.screen === 'layer') {
            drawLayerChip(ctx, x, y, floating.data[y][x] as number, images);
          } else {
            drawMapChip(
              ctx,
              x,
              y,
              floating.data[y][x],
              images,
              params,
              customParts,
            );
          }
        }
      }
    }
  }, [floating, images, params, customParts, stage]);
  return canvasRef;
}
