import { CustomPartsData } from '../../defs/map';
import { ChipCode } from '.';
import { Chip } from '../chip-data/interface';
import { athleticTable } from '../chip-data/athletics';
import {
  getCustomChipName,
  getCustomChipColor,
  getNativeCode,
} from '../custom-parts';
import { addRendering, unknown_pattern } from '../chip-data/patterns';
import { enemyTable } from '../chip-data/enemies';
import { chipTable } from '../chip-data/regular';

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

/**
 * Get a chip object for given code.
 * @package
 */
export function chipFor(
  params: Record<string, string>,
  customParts: CustomPartsData,
  chip: ChipCode,
): Chip {
  if ('string' === typeof chip) {
    // custom parts.
    // get name of custom parts.
    const name = getCustomChipName(customParts, chip);
    const color = getCustomChipColor(customParts, chip);
    // get native chip code.
    const nativeCode = getNativeCode(customParts, chip);
    const c = nativeCode != null ? lookupChip(params, nativeCode) : null;
    if (c != null) {
      const { pattern, category, nativeName, nativeCode } = c;
      return {
        // カスタムパーツのサインをpatternに追加
        pattern: addRendering(pattern, {
          color: color || '#000000',
          x: 0,
          y: 0,
          width: 10,
          height: 5,
        }),
        name: name != null ? name : '不明',
        category,
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
    lookupChip(params, chip) || {
      pattern: unknown_pattern,
      name: '不明',
      nativeName: '不明',
      nativeCode: 0,
    }
  );
}

/**
 * Look up native chip definition.
 */
function lookupChip(params: Record<string, string>, chip: number): Chip | null {
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
