//chipの情報
import { Rect, containerRect } from '../rect';

import { MainChipRendering, SubChipRendering } from '../chip-data/interface';

import { athleticTable } from '../chip-data/athletics';
import { enemyTable } from '../chip-data/enemies';

import { CustomPartsData } from '../../defs/map';
import { chipTable } from '../chip-data/regular';
import { chipFor } from './chip-for';
/**
 * Code of chip.
 */
export type ChipCode = number | string;

export const chipList: ChipCode[] = Object.keys(chipTable).map(key =>
  Number(key),
);
// advanced-mapで使えるやつ
export const advancedChipList: ChipCode[] = [
  ...chipList,
  ...Object.keys(athleticTable).map(key => Number(key) + 1000),
  ...Object.keys(enemyTable).map(key => Number(key) + 5000),
];

//仕掛けのparamに応じたやつ

//ctxの(x,y)座標にchipをdrawする
//images: {
//  pattern: パターン画像
//  params: params
//  chips: 補助チップ
//}
export interface ImagesObject {
  pattern: HTMLImageElement;
  chips: HTMLImageElement;
}

// チップの描画範囲を返す（相対座標）
export function chipRenderRect(
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: ChipCode,
): Rect {
  const rect: Rect = {
    minX: 0,
    minY: 0,
    maxX: 0,
    maxY: 0,
  };
  if (chip === 0) {
    return rect;
  }
  const t = chipFor(params, customParts, chip);
  if (t == null) {
    return rect;
  }
  let p = t.pattern;
  if (!Array.isArray(p)) {
    p = [p];
  }
  const rects = [rect];
  // 各描画要素の影響範囲
  for (var i = 0; i < p.length; i++) {
    let pi = p[i];
    if ('number' === typeof pi) {
      pi = {
        chip: pi,
      };
    }
    const chip = (pi as MainChipRendering).chip;
    if (chip != null) {
      // pi is a MainChipRendering.
      const pim = pi as MainChipRendering;
      const width = pim.width || 32;
      const height = pim.height || 32;
      const dx = pim.dx || 0;
      const dy = pim.dy || 0;
      rects.push({
        minX: dx,
        minY: dy,
        maxX: dx + width,
        maxY: dy + height,
      });
    } else if (
      (pi as SubChipRendering).subx != null &&
      (pi as SubChipRendering).suby != null
    ) {
      // pi is a SubChipRendering.
      const pis = pi as SubChipRendering;
      const width = pis.width || 16;
      const height = pis.height || 16;
      const dx = pis.dx || 0;
      const dy = pis.dy || 0;
      rects.push({
        minX: dx,
        minY: dy,
        maxX: dx + width,
        maxY: dy + height,
      });
    }
  }
  return containerRect(...rects);
}

// 従来の文字列表現チップと数値の相互変換
export function chipToMapString(chip: number): string {
  return chip === 0 ? '.' : String.fromCharCode(chip);
}
export function mapStringToChip(chip: string): number {
  if (chip === '.' || !chip) {
    return 0;
  } else {
    return chip.charCodeAt(0);
  }
}
export function chipToLayerString(chip: number): string {
  if (chip === 0) {
    return '..';
  } else if (chip < 0x10) {
    return '0' + chip.toString(16);
  } else {
    return chip.toString(16);
  }
}
export function layerStringToChip(chip: string): number {
  if (chip === '..' || !chip) {
    return 0;
  } else {
    return parseInt(chip, 16);
  }
}

export { drawChip } from './draw-chip';
export { chipFor } from './chip-for';
