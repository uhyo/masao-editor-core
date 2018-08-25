//chipの情報
import { Rect, containerRect } from './rect';

import {
  MainChipRendering,
  SubChipRendering,
  Chip,
} from './chip-data/interface';

import { unknown_pattern } from './chip-data/patterns';

import { athleticTable } from './chip-data/athletics';
import { enemyTable } from './chip-data/enemies';

import { CustomPartsData } from '../defs/map';
import { getCustomChipName } from './custom-parts';
import { chipTable } from './chip-data/regular';
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

//アスレチックのやつとparamの対応
const athleticTypeParam: Record<string, string> = {
  k: 'coin1_type',
  l: 'coin3_type',
  u: 'dokan1_type',
  v: 'dokan2_type',
  w: 'dokan3_type',
  x: 'dokan4_type',
  N: 'dossunsun_type',
  U: 'firebar1_type',
  V: 'firebar2_type',
  K: 'ugokuyuka1_type',
  L: 'ugokuyuka2_type',
  M: 'ugokuyuka3_type',
};

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
    let pi = p[i];
    if ('number' === typeof pi) {
      pi = {
        chip: pi,
      };
    }
    const chip = (pi as MainChipRendering).chip;
    let sx, sy;
    //その番号を描画
    if (chip != null) {
      pi = pi as MainChipRendering;
      if (full) {
        (sy = pi.y || Math.floor(chip / 10) * 32),
          (sx = pi.x || (chip % 10) * 32);
        let width = pi.width || 32,
          height = pi.height || 32;
        let xx = x + (pi.dx || 0),
          yy = y + (pi.dy || 0);
        if (pi.rotate === 1) {
          //90度回転
          ctx.save();
          ctx.translate(xx + width / 2, yy + height / 2);
          ctx.rotate(Math.PI / 2);
          ctx.translate(-xx - width / 2, -yy - height / 2);
        } else if (pi.rotate === 2) {
          //180
          ctx.save();
          ctx.translate(xx + width / 2, yy + height / 2);
          ctx.rotate(Math.PI);
          ctx.translate(-xx - width / 2, -yy - height / 2);
        } else if (pi.rotate === 3) {
          //270
          ctx.save();
          ctx.translate(xx + width / 2, yy + height / 2);
          ctx.rotate((Math.PI * 3) / 4);
          ctx.translate(-xx - width / 2, -yy - height / 2);
        }
        ctx.drawImage(
          images.pattern,
          sx,
          sy,
          width,
          height,
          xx,
          yy,
          width,
          height,
        );
        if ('number' === typeof pi.rotate && pi.rotate > 0) {
          ctx.restore();
        }
      } else {
        (sy = Math.floor(chip / 10) * 32), (sx = (chip % 10) * 32);
        if (pi.rotate === 1) {
          //90度回転
          ctx.save();
          ctx.translate(x + 16, y + 16);
          ctx.rotate(Math.PI / 2);
          ctx.translate(-x - 16, -y - 16);
        } else if (pi.rotate === 2) {
          //180
          ctx.save();
          ctx.translate(x + 16, y + 16);
          ctx.rotate(Math.PI);
          ctx.translate(-x - 16, -y - 16);
        } else if (pi.rotate === 3) {
          //270
          ctx.save();
          ctx.translate(x + 16, y + 16);
          ctx.rotate((Math.PI * 3) / 4);
          ctx.translate(-x - 16, -y - 16);
        }
        ctx.drawImage(images.pattern, sx, sy, 32, 32, x, y, 32, 32);
        if ('number' === typeof pi.rotate && pi.rotate > 0) {
          ctx.restore();
        }
      }
    } else if (
      (pi as SubChipRendering).subx != null &&
      (pi as SubChipRendering).suby != null
    ) {
      pi = pi as SubChipRendering;
      //subを描画
      let width = pi.width || 16,
        height = pi.height || 16;
      let xx = pi.dx || 0,
        yy = pi.dy || 0;
      ctx.drawImage(
        images.chips,
        pi.subx,
        pi.suby,
        width,
        height,
        x + 16 + xx,
        y + 16 + yy,
        width,
        height,
      );
    }
  }
}

// チップの描画範囲を返す（相対座標）
export function chipRenderRect(
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: number,
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
      const width = pi.width || 32;
      const height = pi.height || 32;
      const dx = pi.dx || 0;
      const dy = pi.dy || 0;
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
      // subの場合
      const width = pi.width || 16;
      const height = pi.height || 16;
      const dx = pi.dx || 0;
      const dy = pi.dy || 0;
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

/**
 * Get a chip object for given code.
 */
export function chipFor(
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: ChipCode,
): Chip {
  if ('string' === typeof chip) {
    // custom parts.
    // get name of custom parts.
    const name = getCustomChipName(customParts, chip) || '不明';
    // get chip and override name.
    const c = lookupChip(params, customParts, chip);
    if (c != null) {
      const { pattern, nativeName, nativeCode } = c;
      return {
        pattern,
        name,
        nativeName,
        nativeCode,
      };
    } else {
      // undefined chip.
      return {
        pattern: unknown_pattern,
        name: '不明',
        nativeName: '不明',
        // ???
        nativeCode: 0,
      };
    }
  }
  // it's native.
  return (
    lookupChip(params, customParts, chip) || {
      pattern: unknown_pattern,
      name: '不明',
      nativeName: '不明',
      nativeCode: 0,
    }
  );
}

/**
 * Look up native chip definition, recursing for custom chips.
 */
function lookupChip(
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: ChipCode,
  // flags to prevent infinite loops.
  visitedFlag: Record<string, boolean | undefined> = {},
): Chip | null {
  if ('string' === typeof chip) {
    if (visitedFlag[chip]) {
      // Infinite loop
      return null;
    }
    visitedFlag[chip] = true;
    const ccp = customParts[chip];
    if (ccp == null) {
      // This chip is undefined.
      return null;
    }
    // Refer to its parent.
    return lookupChip(params, customParts, ccp.extends, visitedFlag);
  }
  // otherwise, do normal process for native chip.
  let pa = athleticTypeParam[chip];
  if (pa != null && params[pa] !== '1') {
    //変わったアスレチックだ
    const ac = athleticTable[params[pa]];
    return {
      ...ac,
      nativeCode: chip,
      nativeName: ac.name,
    };
  } else if (chip === 106 && params['layer_mode'] === '2') {
    //ブロック10はレイヤーありのとき透明になる
    return {
      pattern: [
        {
          subx: 0,
          suby: 32,
          width: 32,
          height: 32,
          dx: -16,
          dy: -16,
        },
        {
          subx: 80,
          suby: 16,
        },
      ],
      name: 'ブロック10（透明）',
      category: 'block',
      nativeName: 'ブロック10',
      nativeCode: chip,
    };
  } else if (chip === 91 && params['layer_mode'] === '2') {
    //下から通れる床
    return {
      pattern: [
        {
          subx: 128,
          suby: 32,
          width: 32,
          height: 32,
          dx: -16,
          dy: -16,
        },
      ],
      name: '下から通れる床（透明）',
      category: 'block',
      nativeName: '下から通れる床',
      nativeCode: chip,
    };
  } else if (chip === 93 && params['layer_mode'] === '2') {
    //ハシゴ
    return {
      pattern: [
        {
          subx: 128,
          suby: 0,
          width: 32,
          height: 32,
          dx: -16,
          dy: -16,
        },
      ],
      name: 'ハシゴ（透明）',
      category: 'block',
      nativeName: 'ハシゴ',
      nativeCode: chip,
    };
  } else if (chip === 60 && params['layer_mode'] === '2') {
    //坂も透明になる
    return {
      pattern: [
        {
          subx: 96,
          suby: 0,
          width: 32,
          height: 32,
          dx: -16,
          dy: -16,
        },
      ],
      name: '上り坂（透明）',
      category: 'block',
      nativeName: '上り坂',
      nativeCode: chip,
    };
  } else if (chip === 62 && params['layer_mode'] === '2') {
    //坂も透明になる
    return {
      pattern: [
        {
          subx: 96,
          suby: 32,
          width: 32,
          height: 32,
          dx: -16,
          dy: -16,
        },
      ],
      name: '下り坂（透明）',
      category: 'block',
      nativeName: '下り坂',
      nativeCode: chip,
    };
  } else if (chip >= 1000 && chip < 5000) {
    // athleticだ
    const obj = athleticTable[chip - 1000];
    if (obj != null) {
      return {
        ...obj,
        nativeCode: chip,
        nativeName: obj.name,
      };
    }
  } else if (chip >= 5000 && chip < 10000) {
    // enemyだ
    const obj = enemyTable[chip - 5000];
    if (obj != null) {
      return obj;
    }
  }
  const obj = chipTable[chip];
  if (obj != null) {
    return obj;
  }
  // 不明だ
  return null;
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
