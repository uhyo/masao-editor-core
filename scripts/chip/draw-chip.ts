import { ImagesObject, ChipCode } from '.';
import { CustomPartsData } from '../../defs/map';
import { chipFor } from './chip-for';
import {
  MainChipRendering,
  SubChipRendering,
  ColorRendering,
  RenderInstruction,
} from '../chip-data/interface';

/**
 * Draw a chip on given context.
 * @package
 */
export function drawChip(
  ctx: CanvasRenderingContext2D,
  images: ImagesObject,
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: ChipCode,
  x: number,
  y: number,
  full: boolean,
) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('drawchip', process.env.NODE_ENV);
  }
  if (chip === 0) {
    return;
  }
  const t = chipFor(params, customParts, chip);
  if (t == null) {
    return;
  }
  let p = t.pattern;
  if (!Array.isArray(p)) {
    p = [p];
  }
  for (let i = 0; i < p.length; i++) {
    renderOneInstruction(ctx, images, p[i], x, y, full);
  }
}

function renderOneInstruction(
  ctx: CanvasRenderingContext2D,
  images: ImagesObject,
  pat: RenderInstruction,
  x: number,
  y: number,
  full: boolean,
) {
  if ('number' === typeof pat) {
    pat = {
      chip: pat,
    };
  }
  //その番号を描画
  if ((pat as MainChipRendering).chip != null) {
    renderMainRendering(ctx, images, pat as MainChipRendering, x, y, full);
  } else if (
    (pat as SubChipRendering).subx != null &&
    (pat as SubChipRendering).suby != null
  ) {
    //subを描画
    renderSubRendering(ctx, images, pat as SubChipRendering, x, y);
  } else if ((pat as ColorRendering).color != null) {
    // pi is a ColorRendering.
    pat = pat as ColorRendering;
    ctx.fillStyle = pat.color;
    ctx.fillRect(x + pat.x, y + pat.y, pat.width, pat.height);
  }
}

function renderMainRendering(
  ctx: CanvasRenderingContext2D,
  images: ImagesObject,
  pat: MainChipRendering,
  x: number,
  y: number,
  full: boolean,
) {
  const chip = pat.chip;
  if (full) {
    // パターン画像の位置
    const sourceX = pat.x || (chip % 10) * 32;
    const sourceY = pat.y || Math.floor(chip / 10) * 32;
    // 画像の大きさ
    const width = pat.width || 32;
    const height = pat.height || 32;
    // 描画対象位置
    const targetX = x + (pat.dx || 0);
    const targetY = y + (pat.dy || 0);
    ctx.save();
    if (!pat.rotate) {
      // 無回転
      ctx.translate(targetX, targetY);
    } else if (pat.rotate === 1) {
      //90度回転
      ctx.translate(targetX + height, targetY);
      ctx.rotate(Math.PI / 2);
    } else if (pat.rotate === 2) {
      //180
      ctx.translate(targetX + width, targetY + height);
      ctx.rotate(Math.PI);
    } else if (pat.rotate === 3) {
      //270
      ctx.translate(targetX, targetY + width);
      ctx.rotate((Math.PI * 3) / 2);
    }
    ctx.drawImage(
      images.pattern,
      sourceX,
      sourceY,
      width,
      height,
      0,
      0,
      width,
      height,
    );
    ctx.restore();
  } else {
    // パターン画像の位置
    const sourceX = (chip % 10) * 32;
    const sourceY = Math.floor(chip / 10) * 32;
    if (pat.rotate === 1) {
      //90度回転
      ctx.save();
      ctx.translate(x + 16, y + 16);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-x - 16, -y - 16);
    } else if (pat.rotate === 2) {
      //180
      ctx.save();
      ctx.translate(x + 16, y + 16);
      ctx.rotate(Math.PI);
      ctx.translate(-x - 16, -y - 16);
    } else if (pat.rotate === 3) {
      //270
      ctx.save();
      ctx.translate(x + 16, y + 16);
      ctx.rotate((Math.PI * 3) / 2);
      ctx.translate(-x - 16, -y - 16);
    }
    ctx.drawImage(images.pattern, sourceX, sourceY, 32, 32, x, y, 32, 32);
    if ('number' === typeof pat.rotate && pat.rotate > 0) {
      ctx.restore();
    }
  }
}

function renderSubRendering(
  ctx: CanvasRenderingContext2D,
  images: ImagesObject,
  pat: SubChipRendering,
  x: number,
  y: number,
) {
  const width = pat.width || 16;
  const height = pat.height || 16;
  const xx = pat.dx || 0;
  const yy = pat.dy || 0;
  ctx.drawImage(
    images.chips,
    pat.subx,
    pat.suby,
    width,
    height,
    x + 16 + xx,
    y + 16 + yy,
    width,
    height,
  );
}
