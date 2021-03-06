import { NativeChip } from './interface';
import { fromNativeTable } from './native';
import { dossunsun_pattern } from './patterns';

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

const nativeChipTable: Record<string, NativeChip> = keyToNum({
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

/**
 * Table from regular chip code to chips.
 */
export const chipTable = fromNativeTable(nativeChipTable);
