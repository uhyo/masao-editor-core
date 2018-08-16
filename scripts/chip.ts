//chipの情報
import { Rect, containerRect } from './rect';

import {
  MainChipRendering,
  SubChipRendering,
  Chip,
} from './chip-data/interface';

import { dossunsun_pattern, unknown_pattern } from './chip-data/patterns';

import { athleticTable } from './chip-data/athletics';
import { enemyTable } from './chip-data/enemies';

/**
 * Code of chip.
 */
export type ChipCode = number | string;

/* categoryの種類
 * masao: 正男
 * block: ブロック
 * enemy: 敵
 * athletic: 仕掛け
 * bg: 背景
 * water: 水
 * item: アイテム
 */
function keyToNum<T>(obj: Record<string, T>): Record<string, T> {
  const result: Record<string, T> = {};
  for (let k in obj) {
    const code = k === '.' ? 0 : k.charCodeAt(0);
    result[code] = obj[k];
  }
  return result;
}
const chipTable: Record<string, Chip> = keyToNum({
  A: {
    pattern: 100,
    name: '主人公',
    category: 'masao',
  },
  B: {
    pattern: [
      {
        chip: 140,
      },
      {
        subx: 0,
        suby: 0,
      },
    ],
    name: '亀（足元に空白があると向きを変える）',
    category: 'enemy',
  },
  C: {
    pattern: [
      {
        chip: 140,
      },
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '亀（足元に空白があると落ちる）',
    category: 'enemy',
  },
  D: {
    pattern: [
      {
        chip: 140,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: '亀（足元に空白があると落ちる 3匹連続）',
  },
  E: {
    pattern: 143,
    name: 'ピカチー',
    category: 'enemy',
  },
  F: {
    pattern: 150,
    name: 'チコリン',
    category: 'enemy',
  },
  G: {
    pattern: 152,
    name: 'ヒノララシ',
    category: 'enemy',
  },
  H: {
    pattern: [
      {
        chip: 147,
      },
      {
        subx: 16,
        suby: 0,
      },
    ],
    name: 'ポッピー（上下移動）',
    category: 'enemy',
  },
  I: {
    pattern: [
      {
        chip: 147,
      },
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: 'ポッピー（直進）',
    category: 'enemy',
  },
  J: {
    pattern: [
      {
        chip: 147,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'ポッピー（直進　3羽連続）',
    category: 'enemy',
  },
  K: {
    pattern: {
      chip: 190,
      width: 96,
    },
    name: '動く床（上下移動）',
    category: 'athletic',
  },
  L: {
    pattern: {
      chip: 190,
      width: 96,
    },
    name: '動く床（左右移動）',
    category: 'athletic',
  },
  M: {
    pattern: {
      chip: 190,
      width: 96,
    },
    name: '動く床（左右移動×2）',
    category: 'athletic',
  },
  N: {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン',
    category: 'athletic',
  },
  O: {
    pattern: 154,
    name: 'マリリ',
    category: 'enemy',
  },
  P: {
    pattern: 158,
    name: 'ヤチャモ',
    category: 'enemy',
  },
  Q: {
    pattern: 160,
    name: 'ミズタロウ',
    category: 'enemy',
  },
  R: {
    pattern: 164,
    name: 'エアームズ',
    category: 'enemy',
  },
  S: {
    pattern: 196,
    name: 'グラーダ',
    category: 'enemy',
  },
  T: {
    pattern: 198,
    name: 'カイオール',
    category: 'enemy',
  },
  U: {
    pattern: [
      50,
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: 'ファイヤーバー（左回り）',
    category: 'athletic',
  },
  V: {
    pattern: [
      50,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: 'ファイヤーバー（右回り）',
    category: 'athletic',
  },
  W: {
    pattern: 166,
    name: 'タイキング',
    category: 'enemy',
  },
  X: {
    pattern: 167,
    name: 'クラゲッソ',
    category: 'enemy',
  },
  Y: {
    pattern: 86,
    name: '水草',
    category: 'bg',
  },
  Z: {
    pattern: 248,
    name: 'センクウザ',
    category: 'enemy',
  },
  a: {
    pattern: 20,
    name: 'ブロック1',
    category: 'block',
  },
  b: {
    pattern: 21,
    name: 'ブロック2',
    category: 'block',
  },
  c: {
    pattern: 22,
    name: 'ブロック3',
    category: 'block',
  },
  d: {
    pattern: 23,
    name: 'ブロック4',
    category: 'block',
  },
  e: {
    pattern: 24,
    name: 'ブロック5',
    category: 'block',
  },
  f: {
    pattern: 25,
    name: 'ブロック6',
    category: 'block',
  },
  g: {
    pattern: 26,
    name: 'ブロック7',
    category: 'block',
  },
  h: {
    pattern: 27,
    name: 'ブロック8',
    category: 'block',
  },
  i: {
    pattern: 28,
    name: 'ブロック9',
    category: 'block',
  },
  j: {
    pattern: 29,
    name: 'ブロック10',
    category: 'block',
  },
  k: {
    pattern: [40, 90],
    name: '？ブロック（コイン）',
    category: 'block',
  },
  l: {
    pattern: [
      40,
      90,
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: '？ブロック（コイン3枚）',
    category: 'block',
  },
  m: {
    pattern: [40, 42],
    name: '？ブロック（ファイヤーボール）',
    category: 'block',
  },
  n: {
    pattern: [40, 43],
    name: '？ブロック（バリア）',
    category: 'block',
  },
  o: {
    pattern: [40, 44],
    name: '？ブロック（タイム）',
    category: 'block',
  },
  p: {
    pattern: [40, 45],
    name: '？ブロック（ジェット）',
    category: 'block',
  },
  q: {
    pattern: [40, 46],
    name: '？ブロック（ヘルメット）',
    category: 'block',
  },
  r: {
    pattern: [40, 47],
    name: '？ブロック（しっぽ）',
    category: 'block',
  },
  s: {
    pattern: [40, 48],
    name: '？ブロック（ドリル）',
    category: 'block',
  },
  t: {
    pattern: [40, 49],
    name: '？ブロック（グレネード）',
    category: 'block',
  },
  u: {
    pattern: {
      chip: 60,
      width: 64,
    },
    name: 'リンク土管1',
    category: 'athletic',
  },
  v: {
    pattern: {
      chip: 62,
      width: 64,
    },
    name: 'リンク土管2',
    category: 'athletic',
  },
  w: {
    pattern: {
      chip: 64,
      width: 64,
    },
    name: 'リンク土管3',
    category: 'athletic',
  },
  x: {
    pattern: {
      chip: 66,
      width: 64,
    },
    name: 'リンク土管4',
    category: 'athletic',
  },
  y: {
    pattern: [40, 59],
    name: '？ブロック（1up茸）',
    category: 'block',
  },
  z: {
    pattern: 69,
    name: 'すべる床',
    category: 'lblock',
  },
  '+': {
    pattern: 36,
    name: '一言メッセージ1',
    category: 'bg',
  },
  '-': {
    pattern: 37,
    name: '一言メッセージ2',
    category: 'bg',
  },
  '*': {
    pattern: 38,
    name: '一言メッセージ3',
    category: 'bg',
  },
  '/': {
    pattern: 39,
    name: '一言メッセージ4',
    category: 'bg',
  },
  '1': {
    pattern: 1,
    name: '雲の左側',
    category: 'bg',
  },
  '2': {
    pattern: 2,
    name: '雲の右側',
    category: 'bg',
  },
  '3': {
    pattern: 3,
    name: '草',
    category: 'bg',
  },
  '4': {
    pattern: 4,
    name: '水',
    category: 'water',
  },
  '5': {
    pattern: 5,
    name: '上向きのトゲ',
    category: 'athletic',
  },
  '6': {
    pattern: 6,
    name: '下向きのトゲ',
    category: 'athletic',
  },
  '7': {
    pattern: 96,
    name: 'ろうそく',
    category: 'bg',
  },
  '8': {
    pattern: 94,
    name: '星',
    category: 'item',
  },
  '9': {
    pattern: 90,
    name: 'コイン',
    category: 'item',
  },
  '{': {
    pattern: 140,
    name: '亀（追尾）',
    category: 'enemy',
  },
  '}': {
    pattern: 143,
    name: '重力無視の追跡ピカチー等',
    category: 'enemy',
  },
  '[': {
    pattern: 35,
    name: '下から通れる床',
    category: 'athletic',
  },
  ']': {
    pattern: 30,
    name: 'ハシゴ',
    category: 'athletic',
  },
  '<': {
    pattern: 18,
    name: '上り坂',
    category: 'block',
  },
  '>': {
    pattern: 19,
    name: '下り坂',
    category: 'block',
  },
  '.': {
    pattern: 0,
    name: '空白',
  },
});

export const chipList = Object.keys(chipTable).map(key => Number(key));
// advanced-mapで使えるやつ
export const advancedChipList = [
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
  const t = chipFor(params, chip);
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
  const t = chipFor(params, chip);
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

//チップオブジェクト
export function chipFor(params: Record<string, string>, chip: ChipCode): Chip {
  if ('string' === typeof chip) {
    // TODO currently, return unknown for string chip.
    return {
      pattern: unknown_pattern,
      name: '不明',
    };
  }
  let pa = athleticTypeParam[chip];
  if (pa != null && params[pa] !== '1') {
    //変わったアスレチックだ
    return athleticTable[params[pa]];
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
    };
  } else if (chip >= 1000 && chip < 5000) {
    // athleticだ
    const obj = athleticTable[chip - 1000];
    if (obj != null) {
      return obj;
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
  return {
    pattern: unknown_pattern,
    name: '不明',
  };
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
