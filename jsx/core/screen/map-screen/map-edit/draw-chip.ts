import { Images } from '../../../../../defs/images';
import { IntoImages } from '../../../../components/load-images';
import { ParamsState, CustomPartsState } from '../../../../../stores';
import * as chip from '../../../../../scripts/chip';

export function drawMapChip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  c: chip.ChipCode,
  images: IntoImages<Images> | null,
  params: ParamsState,
  customParts: CustomPartsState,
): void {
  if (images == null) {
    return;
  }
  chip.drawChip(
    ctx,
    images,
    params,
    customParts.customParts,
    c,
    x * 32,
    y * 32,
    true,
  );
}
export function drawLayerChip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  c: number,
  images: IntoImages<Images> | null,
): void {
  //レイヤ
  if (c === 0 || images == null) {
    return;
  }
  const sx = (c & 15) * 32,
    sy = Math.floor(c >> 4) * 32;
  ctx.drawImage(images.mapchip, sx, sy, 32, 32, x * 32, y * 32, 32, 32);
}
