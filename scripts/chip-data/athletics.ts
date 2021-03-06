import { NativeChip } from './interface';
import { dossunsun_pattern, emptyblock_pattern } from './patterns';

export const athleticTable: Record<string, NativeChip> = {
  '1': {
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
  '2': {
    pattern: {
      chip: 180,
      width: 96,
    },
    name: '落ちる床（乗ると落ちる）',
    category: 'athletic',
  },
  '3': {
    pattern: {
      chip: 180,
      width: 96,
    },
    name: '落ちる床（ずっと乗っていると落ちる）',
    category: 'athletic',
  },
  '4': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: '動く床（左回り）',
    category: 'athletic',
  },
  '5': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '動く床（右回り）',
    category: 'athletic',
  },
  '6': {
    pattern: [
      198,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '乗れるカイオール',
    category: 'athletic',
  },
  '7': {
    pattern: 32,
    name: 'ジャンプ台',
    category: 'athletic',
  },
  '8': {
    pattern: dossunsun_pattern,
    name: '上ドッスンスン',
    category: 'athletic',
  },
  '9': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '左ドッスンスン',
    category: 'athletic',
  },
  '10': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '右ドッスンスン',
    category: 'athletic',
  },
  '11': {
    pattern: dossunsun_pattern,
    name: '跳ねるドッスンスン',
    category: 'athletic',
  },
  '12': {
    pattern: dossunsun_pattern,
    name: '上がらないドッスンスン',
    category: 'athletic',
  },
  '13': {
    pattern: dossunsun_pattern,
    name: 'エレベータードッスンスン（上昇）',
    category: 'athletic',
  },
  '14': {
    pattern: dossunsun_pattern,
    name: 'エレベータードッスンスン（下降）',
    category: 'athletic',
  },
  '15': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 16,
        suby: 0,
      },
    ],
    name: '上下ドッスンスン',
    category: 'athletic',
  },
  '16': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 0,
        suby: 0,
      },
    ],
    name: '左右ドッスンスン',
    category: 'athletic',
  },
  '17': {
    pattern: dossunsun_pattern,
    name: 'ロングレンジドッスンスン',
    category: 'athletic',
  },
  '18': {
    pattern: [
      50,
      {
        subx: 0,
        suby: 16,
        dx: -16,
        dy: 0,
      },
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: 'ファイヤーバー2本',
    category: 'athletic',
  },
  '19': {
    pattern: [
      50,
      {
        subx: 0,
        suby: 16,
        dx: -16,
        dy: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'ファイヤーバー3本　左回り',
    category: 'athletic',
  },
  '20': {
    pattern: [
      50,
      {
        subx: 16,
        suby: 16,
        dx: -16,
        dy: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'ファイヤーバー3本　右回り',
    category: 'athletic',
  },
  '21': {
    pattern: [
      23,
      {
        subx: 32,
        suby: 16,
      },
    ],
    name: '隠しブロック',
    category: 'athletic',
  },
  '22': {
    pattern: [
      40,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '？ブロック（右にブロック1が10個出る）',
    category: 'athletic',
  },
  '23': {
    pattern: [
      40,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '？ブロック（左にブロック1が10個出る）',
    category: 'athletic',
  },
  '24': {
    pattern: [
      40,
      {
        subx: 80,
        suby: 0,
      },
    ],
    name: '？ブロック（上にハシゴが出る）',
    category: 'athletic',
  },
  '25': {
    pattern: emptyblock_pattern,
    name: 'シーソー（水平）',
    category: 'athletic',
  },
  '26': {
    pattern: emptyblock_pattern,
    name: 'シーソー（左が下）',
    category: 'athletic',
  },
  '27': {
    pattern: emptyblock_pattern,
    name: 'シーソー（右が下）',
    category: 'athletic',
  },
  '28': {
    pattern: emptyblock_pattern,
    name: 'ブランコ',
    category: 'athletic',
  },
  '29': {
    pattern: emptyblock_pattern,
    name: 'ブランコ（2個連続）',
    category: 'athletic',
  },
  '30': {
    pattern: emptyblock_pattern,
    name: 'スウィングバー（左）',
    category: 'athletic',
  },
  '31': {
    pattern: emptyblock_pattern,
    name: 'スウィングバー（右）',
    category: 'athletic',
  },
  '32': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: 'スウィングファイヤーバー（左）',
    category: 'athletic',
  },
  '33': {
    pattern: [
      50,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: 'スウィングファイヤーバー（右）',
    category: 'athletic',
  },
  '34': {
    pattern: 40,
    name: '？ブロック（上にブロック1が10個出る）',
    category: 'athletic',
  },
  '35': {
    pattern: 40,
    name: '？ブロック（上にブロック1が2個出る）',
    category: 'athletic',
  },
  '36': {
    pattern: [
      40,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '？ブロック（右にブロック1が2個出る）',
    category: 'athletic',
  },
  '37': {
    pattern: [
      40,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '？ブロック（左にブロック1が2個出る）',
    category: 'athletic',
  },
  '38': {
    pattern: 40,
    name: '？ブロック（ジャンプ台）',
    category: 'athletic',
  },
  '39': {
    pattern: 40,
    name: '？ブロック（トゲ）',
    category: 'athletic',
  },
  '40': {
    pattern: 40,
    name: '？ブロック（周囲のトゲをコインに変換）',
    category: 'athletic',
  },
  '41': {
    pattern: 40,
    name: '？ブロック（周囲のトゲをブロック1に変換）',
    category: 'athletic',
  },
  '42': {
    pattern: 40,
    name: '？ブロック（周囲のブロック1をコインに変換）',
    category: 'athletic',
  },
  '43': {
    pattern: 40,
    name: '？ブロック（周囲のブロック4を消去）',
    category: 'athletic',
  },
  '44': {
    //TODO: pattern未確認
    pattern: 37,
    name: 'お店',
    category: 'athletic',
  },
  '45': {
    //TODO: pattern未確認
    pattern: 37,
    name: 'ヘルメットかドリルをくれる人',
    category: 'athletic',
  },
  '46': {
    //TODO: pattern未確認
    pattern: 37,
    name: 'グレネードかジェットをくれる人',
    category: 'athletic',
  },
  '47': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（上へ伸びる）',
    category: 'athletic',
  },
  '48': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（下へ伸びる）',
    category: 'athletic',
  },
  '49': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（左へ伸びる）',
    category: 'athletic',
  },
  '50': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（右へ伸びる）',
    category: 'athletic',
  },
  '51': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（上下）',
    category: 'athletic',
  },
  '52': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（左右）',
    category: 'athletic',
  },
  '53': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 16,
        suby: 0,
      },
    ],
    name: '上下ドッスンスン（壁対応）',
    category: 'athletic',
  },
  '54': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 0,
        suby: 0,
      },
    ],
    name: '左右ドッスンスン（壁対応）',
    category: 'athletic',
  },
  '55': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 0,
        suby: 0,
      },
    ],
    name: 'ドッスンスン（乗ると左右移動）',
    category: 'athletic',
  },
  '56': {
    pattern: [26, 139],
    name: '火山',
    category: 'athletic',
  },
  '57': {
    pattern: [26, 139],
    name: '逆火山',
    category: 'athletic',
  },
  '58': {
    pattern: emptyblock_pattern,
    name: '動くT字型（左右）',
    category: 'athletic',
  },
  '59': {
    pattern: emptyblock_pattern,
    name: '動くT字型（2個連続）',
    category: 'athletic',
  },
  '60': {
    pattern: emptyblock_pattern,
    name: 'ロープ',
    category: 'athletic',
  },
  '61': {
    pattern: emptyblock_pattern,
    name: 'ロープ（2個連続）',
    category: 'athletic',
  },
  '62': {
    pattern: [
      198,
      {
        subx: 0,
        suby: 0,
      },
    ],
    name: '乗れるカイオール（方向キーで移動）',
    category: 'athletic',
  },
  '63': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（上へ速射）',
    category: 'athletic',
  },
  '64': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（下へ速射）',
    category: 'athletic',
  },
  '65': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（左へ速射）',
    category: 'athletic',
  },
  '66': {
    pattern: emptyblock_pattern,
    name: 'ファイヤーウォール（右へ速射）',
    category: 'athletic',
  },
  '67': {
    //TODO: pattern未確認
    pattern: 212,
    name: '得点で開く扉',
    category: 'athletic',
  },
  '68': {
    //TODO: pattern未確認
    pattern: 212,
    name: 'コインを全部取ると扉',
    category: 'athletic',
  },
  '69': {
    //TODO: pattern未確認
    pattern: 212,
    name: '周囲のコインを全部取ると扉',
    category: 'athletic',
  },
  '70': {
    //TODO: pattern未確認
    pattern: 212,
    name: '周囲の敵を全部倒すと扉',
    category: 'athletic',
  },
  '71': {
    pattern: emptyblock_pattern,
    name: '人間大砲（右）',
    category: 'athletic',
  },
  '72': {
    pattern: emptyblock_pattern,
    name: '人間大砲（左）',
    category: 'athletic',
  },
  '73': {
    pattern: emptyblock_pattern,
    name: '人間大砲（天井）',
    category: 'athletic',
  },
  '74': {
    pattern: emptyblock_pattern,
    name: '人間大砲（右の壁）',
    category: 'athletic',
  },
  '75': {
    pattern: emptyblock_pattern,
    name: '人間大砲（左の壁）',
    category: 'athletic',
  },
  '76': {
    pattern: 32,
    name: 'ジャンプ台（高性能）',
    category: 'athletic',
  },
  '77': {
    pattern: [
      {
        chip: 32,
        rotate: 1,
      },
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: 'バネ（左）',
    category: 'athletic',
  },
  '78': {
    pattern: [
      {
        chip: 32,
        rotate: 1,
      },
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: 'バネ（右）',
    category: 'athletic',
  },
  '79': {
    pattern: emptyblock_pattern,
    name: 'スポット処理（小）',
    category: 'athletic',
  },
  '80': {
    pattern: emptyblock_pattern,
    name: 'スポット処理（中）',
    category: 'athletic',
  },
  '81': {
    pattern: emptyblock_pattern,
    name: 'スポット処理（大）',
    category: 'athletic',
  },
  '82': {
    //TODO: pattern未確認
    pattern: emptyblock_pattern,
    name: 'スポット処理終了',
    category: 'athletic',
  },
  '83': {
    //TODO: pattern未確認
    pattern: emptyblock_pattern,
    name: 'スポット処理範囲拡大',
    category: 'athletic',
  },
  '84': {
    pattern: 86,
    name: '人食いワカメ（上）',
    category: 'athletic',
  },
  '85': {
    pattern: 86,
    name: '人食いワカメ（下）',
    category: 'athletic',
  },
  '86': {
    pattern: 86,
    name: '人食いワカメ（中央）',
    category: 'athletic',
  },
  '87': {
    pattern: [40, 42],
    name: '？ブロック（水平に飛ぶファイヤーボール）',
    category: 'block',
  },
  '88': {
    pattern: [40, 42],
    name: '？ブロック（跳ねるファイヤーボール）',
    category: 'block',
  },
  '89': {
    pattern: [40, 42],
    name: '？ブロック（ダブルファイヤーボール）',
    category: 'block',
  },
  '90': {
    //TODO: pattern未確認
    pattern: 37,
    name: 'ファイヤーボールセレクトの人',
    category: 'athletic',
  },
  '91': {
    //TODO: pattern未確認
    pattern: 41,
    name: 'ブロック1破壊砲発射（右）',
    category: 'athletic',
  },
  '92': {
    //TODO: pattern未確認
    pattern: 41,
    name: 'ブロック1破壊砲発射（左）',
    category: 'athletic',
  },
  '93': {
    //TODO: pattern未確認
    pattern: 41,
    name: 'ブロック1破壊砲発射（上）',
    category: 'athletic',
  },
  '94': {
    //TODO: pattern未確認
    pattern: 41,
    name: 'ブロック1破壊砲発射（下）',
    category: 'athletic',
  },
  '95': {
    pattern: [40, 49],
    name: '？ブロック（グレネード5発）',
    category: 'block',
  },
  '96': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: '回転ドッスンスン（左回り）',
    category: 'athletic',
  },
  '97': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '回転ドッスンスン（右回り）',
    category: 'athletic',
  },
  '98': {
    //TODO: pattern未確認
    pattern: [
      dossunsun_pattern,
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: '回転巨大ドッスンスン（左回り）',
    category: 'athletic',
  },
  '99': {
    pattern: [
      dossunsun_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '回転巨大ドッスンスン（右回り）',
    category: 'athletic',
  },
  '100': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '強制スクロール（右）',
    category: 'athletic',
  },
  '101': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '強制スクロール（左）',
    category: 'athletic',
  },
  '102': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（上）',
    category: 'athletic',
  },
  '103': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（下）',
    category: 'athletic',
  },
  '104': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（右上）',
    category: 'athletic',
  },
  '105': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（右下）',
    category: 'athletic',
  },
  '106': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（左上）',
    category: 'athletic',
  },
  '107': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（左下）',
    category: 'athletic',
  },
  '108': {
    pattern: [emptyblock_pattern],
    name: '強制スクロールスピードアップ',
    category: 'athletic',
  },
  '109': {
    pattern: [emptyblock_pattern],
    name: '強制スクロールスピードダウン',
    category: 'athletic',
  },
  '110': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール解除',
    category: 'athletic',
  },
  '111': {
    pattern: [emptyblock_pattern],
    name: 'スクロール停止',
    category: 'athletic',
  },
  '112': {
    pattern: [emptyblock_pattern],
    name: '重なると強制スクロール（右）',
    category: 'athletic',
  },
  '113': {
    pattern: [emptyblock_pattern],
    name: '重なると強制スクロール（上）',
    category: 'athletic',
  },
  '114': {
    pattern: [emptyblock_pattern],
    name: '重なると強制スクロール解除',
    category: 'athletic',
  },
  '115': {
    pattern: [emptyblock_pattern],
    name: '横方向スクロールロック',
    category: 'athletic',
  },
  '116': {
    pattern: [emptyblock_pattern],
    name: '強制スクロール（縦自由右方向）',
    category: 'athletic',
  },
  '117': {
    pattern: [emptyblock_pattern],
    name: '左進行用の視界',
    category: 'athletic',
  },
  '118': {
    pattern: [emptyblock_pattern],
    name: '右進行用の視界',
    category: 'athletic',
  },
  '119': {
    pattern: [emptyblock_pattern],
    name: '曲線の上り坂',
    category: 'athletic',
  },
  '120': {
    pattern: [emptyblock_pattern],
    name: '曲線の下り坂',
    category: 'athletic',
  },
  '121': {
    pattern: [emptyblock_pattern],
    name: '曲線の上り坂（線のみ）',
    category: 'athletic',
  },
  '122': {
    pattern: [emptyblock_pattern],
    name: '曲線の下り坂（線のみ）',
    category: 'athletic',
  },
  '123': {
    pattern: [emptyblock_pattern],
    name: '乗れる円',
    category: 'athletic',
  },
  '124': {
    pattern: [emptyblock_pattern],
    name: '乗れる円（大）',
    category: 'athletic',
  },
  '125': {
    pattern: [emptyblock_pattern],
    name: '乗れる半円',
    category: 'athletic',
  },
  '126': {
    pattern: [emptyblock_pattern],
    name: '乗れる半円（線のみ）',
    category: 'athletic',
  },
  '127': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: '人口太陽（左回り）',
    category: 'athletic',
  },
  '128': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '人口太陽（右回り）',
    category: 'athletic',
  },
  '129': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 0,
        suby: 16,
      },
    ],
    name: '人口太陽（棒5本　左回り）',
    category: 'athletic',
  },
  '130': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '人口太陽（棒5本　右回り）',
    category: 'athletic',
  },
  '131': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（左回り）',
    category: 'athletic',
  },
  '132': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（右回り）',
    category: 'athletic',
  },
  '133': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '半円（上下移動　下から）',
    category: 'athletic',
  },
  '134': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '半円（上下移動　上から）',
    category: 'athletic',
  },
  '135': {
    pattern: [emptyblock_pattern],
    name: '半円（乗ると上がる）',
    category: 'athletic',
  },
  '136': {
    pattern: [emptyblock_pattern],
    name: '半円（乗ると下がる）',
    category: 'athletic',
  },
  '137': {
    pattern: [emptyblock_pattern],
    name: '半円（柱付き）',
    category: 'athletic',
  },
  '138': {
    pattern: [emptyblock_pattern],
    name: '円（乗ると下がる）',
    category: 'athletic',
  },
  '139': {
    pattern: [emptyblock_pattern],
    name: '円（乗ると下がる　降りると上がる）',
    category: 'athletic',
  },
  '140': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '円（上下移動　下から）',
    category: 'athletic',
  },
  '141': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 16,
        suby: 16,
      },
    ],
    name: '円（上下移動　上から）',
    category: 'athletic',
  },
  '142': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（2本　左回り）',
    category: 'athletic',
  },
  '143': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（2本　右回り）',
    category: 'athletic',
  },
  '144': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（2本　高速左回り）',
    category: 'athletic',
  },
  '145': {
    pattern: [emptyblock_pattern],
    name: 'ファイヤーリング（2本　高速右回り）',
    category: 'athletic',
  },
  '146': {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン（落ちるだけ）',
    category: 'athletic',
  },
  '147': {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン（動かない）',
    category: 'athletic',
  },
  '148': {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン（左右へ押せる）',
    category: 'athletic',
  },
  '149': {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン（上へ押せる）',
    category: 'athletic',
  },
  '150': {
    pattern: dossunsun_pattern,
    name: 'ドッスンスン（その場で跳ねる）',
    category: 'athletic',
  },
  '151': {
    pattern: emptyblock_pattern,
    name: '長いロープ',
    category: 'athletic',
  },
  '152': {
    pattern: emptyblock_pattern,
    name: '長いロープ（右から）',
    category: 'athletic',
  },
  '153': {
    pattern: emptyblock_pattern,
    name: '長いロープ（捕まると動く）',
    category: 'athletic',
  },
  '154': {
    pattern: emptyblock_pattern,
    name: '長いロープ（捕まると左から動く）',
    category: 'athletic',
  },
  '155': {
    //TODO: pattern未確認
    pattern: emptyblock_pattern,
    name: 'トゲ（左向き　縦4つ）',
    category: 'athletic',
  },
  '156': {
    //TODO: pattern未確認
    pattern: emptyblock_pattern,
    name: 'トゲ（右向き　縦4つ）',
    category: 'athletic',
  },
  '157': {
    pattern: emptyblock_pattern,
    name: '左右に押せるドッスンスンのゴール',
    category: 'athletic',
  },
  '158': {
    pattern: emptyblock_pattern,
    name: '左右に押せるドッスンスンのゴール（ロック機能付き）',
    category: 'athletic',
  },
  '159': {
    //TODO: pattern
    pattern: [
      emptyblock_pattern,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '一方通行（右　縦4つ）',
    category: 'athletic',
  },
  '160': {
    //TODO: pattern
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '一方通行（左　縦4つ）',
    category: 'athletic',
  },
  '161': {
    //TODO: pattern
    pattern: emptyblock_pattern,
    name: '一方通行（上　横4つ）',
    category: 'athletic',
  },
  '162': {
    //TODO: pattern
    pattern: emptyblock_pattern,
    name: '一方通行（下　横4つ）',
    category: 'athletic',
  },
  '163': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: '一方通行（右　縦4つ　表示なし）',
    category: 'athletic',
  },
  '164': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 0,
      },
    ],
    name: '一方通行（左　縦4つ　表示なし）',
    category: 'athletic',
  },
  '165': {
    pattern: emptyblock_pattern,
    name: '一方通行（上　横4つ　表示なし）',
    category: 'athletic',
  },
  '166': {
    pattern: emptyblock_pattern,
    name: '一方通行（下　横4つ　表示なし）',
    category: 'athletic',
  },
  '167': {
    pattern: emptyblock_pattern,
    name: 'ゆれる棒',
    category: 'athletic',
  },
  '168': {
    pattern: emptyblock_pattern,
    name: 'ゆれる棒（左から）',
    category: 'athletic',
  },
  '169': {
    pattern: emptyblock_pattern,
    name: 'ゆれる棒（広角）',
    category: 'athletic',
  },
  '170': {
    pattern: emptyblock_pattern,
    name: 'ゆれる棒（広角　左から）',
    category: 'athletic',
  },
  '171': {
    pattern: emptyblock_pattern,
    name: '跳ねる円',
    category: 'athletic',
  },
  '172': {
    pattern: emptyblock_pattern,
    name: '跳ねる円（大）',
    category: 'athletic',
  },
  '173': {
    pattern: {
      chip: 60,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管1（下向き）',
    category: 'athletic',
  },
  '174': {
    pattern: {
      chip: 62,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管2（下向き）',
    category: 'athletic',
  },
  '175': {
    pattern: {
      chip: 64,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管3（下向き）',
    category: 'athletic',
  },
  '176': {
    pattern: {
      chip: 66,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管4（下向き）',
    category: 'athletic',
  },
  '177': {
    pattern: {
      chip: 60,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管1（下向き・上向きに1に繋がる）',
    category: 'athletic',
  },
  '178': {
    pattern: {
      chip: 62,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管2（下向き・上向き2に繋がる）',
    category: 'athletic',
  },
  '179': {
    pattern: {
      chip: 64,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管3（下向き・上向き3に繋がる）',
    category: 'athletic',
  },
  '180': {
    pattern: {
      chip: 66,
      width: 64,
      rotate: 2,
    },
    name: 'ワープ土管4（下向き・上向き4に繋がる）',
    category: 'athletic',
  },
  '181': {
    //TODO: pattern未確認
    pattern: 10,
    name: 'コンティニュー',
    category: 'athletic',
  },
  '182': {
    //TODO: pattern未確認
    pattern: [40, 10],
    name: '？ブロック（コンティニュー）',
    category: 'athletic',
  },
  '183': {
    pattern: {
      chip: 60,
      width: 64,
      rotate: 3,
    },
    name: 'ワープ土管1（左向き）',
    category: 'athletic',
  },
  '184': {
    pattern: {
      chip: 62,
      width: 64,
      rotate: 3,
    },
    name: 'ワープ土管2（左向き）',
    category: 'athletic',
  },
  '185': {
    pattern: {
      chip: 64,
      width: 64,
      rotate: 3,
    },
    name: 'ワープ土管3（左向き）',
    category: 'athletic',
  },
  '186': {
    pattern: {
      chip: 66,
      width: 64,
      rotate: 3,
    },
    name: 'ワープ土管4（左向き）',
    category: 'athletic',
  },
  '187': {
    pattern: {
      chip: 60,
      width: 64,
      rotate: 1,
    },
    name: 'ワープ土管1（右向き）',
    category: 'athletic',
  },
  '188': {
    pattern: {
      chip: 62,
      width: 64,
      rotate: 1,
    },
    name: 'ワープ土管2（右向き）',
    category: 'athletic',
  },
  '189': {
    pattern: {
      chip: 64,
      width: 64,
      rotate: 1,
    },
    name: 'ワープ土管3（右向き）',
    category: 'athletic',
  },
  '190': {
    pattern: {
      chip: 66,
      width: 64,
      rotate: 1,
    },
    name: 'ワープ土管4（右向き）',
    category: 'athletic',
  },
  '191': {
    pattern: [
      11,
      {
        subx: 80,
        suby: 16,
      },
    ],
    name: 'スイッチ（影響範囲10マス・重なるとON/OFF）',
    category: 'athletic',
  },
  '192': {
    pattern: [
      11,
      {
        subx: 80,
        suby: 16,
      },
    ],
    name: 'スイッチ（影響範囲10マス・上キーでON/OFF）',
    category: 'athletic',
  },
  '193': {
    pattern: [
      213,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式の扉（ONで開く）',
    category: 'athletic',
  },
  '194': {
    pattern: [
      213,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式の扉（ONで閉じる）',
    category: 'athletic',
  },
  '195': {
    pattern: [
      5,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のトゲ（ONでブロック4になる）',
    category: 'athletic',
  },
  '196': {
    pattern: [
      5,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のトゲ（OFFでブロック4になる）',
    category: 'athletic',
  },
  '197': {
    pattern: [
      5,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のトゲ（ONで消える）',
    category: 'athletic',
  },
  '198': {
    pattern: [
      5,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のトゲ（ONで出現）',
    category: 'athletic',
  },
  '199': {
    pattern: [
      30,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のハシゴ（ONで消える）',
    category: 'athletic',
  },
  '200': {
    pattern: [
      30,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式のハシゴ（ONで出現）',
    category: 'athletic',
  },
  '201': {
    pattern: [
      121,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式電撃バリア（縦・ONで消える）',
    category: 'athletic',
  },
  '202': {
    pattern: [
      121,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式電撃バリア（縦・ONで出現）',
    category: 'athletic',
  },
  '203': {
    pattern: [
      121,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式電撃バリア（横・ONで消える）',
    category: 'athletic',
  },
  '204': {
    pattern: [
      121,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式電撃バリア（横・ONで出現）',
    category: 'athletic',
  },
  '205': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動く床（ONで上）',
    category: 'athletic',
  },
  '206': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動く床（ONで下）',
    category: 'athletic',
  },
  '207': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動く床（ONで右）',
    category: 'athletic',
  },
  '208': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動く床（ONで左）',
    category: 'athletic',
  },
  '209': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式長く動く床（ONで上）',
    category: 'athletic',
  },
  '210': {
    pattern: [
      {
        chip: 190,
        width: 96,
      },
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式長く動く床（ONで右）',
    category: 'athletic',
  },
  '211': {
    pattern: [
      11,
      {
        subx: 64,
        suby: 16,
      },
    ],
    name: 'スイッチ（影響範囲5マス・重なるとON/OFF）',
    category: 'athletic',
  },
  '212': {
    pattern: [
      11,
      {
        subx: 64,
        suby: 16,
      },
    ],
    name: 'スイッチ（影響範囲5マス・上キーでON/OFF）',
    category: 'athletic',
  },
  '213': {
    pattern: [
      40,
      12,
      {
        subx: 80,
        suby: 16,
      },
    ],
    name: '？ブロック（スイッチON・影響範囲10マス）',
    category: 'athletic',
  },
  '214': {
    pattern: [
      40,
      11,
      {
        subx: 80,
        suby: 16,
      },
    ],
    name: '？ブロック（スイッチOFF・影響範囲10マス）',
    category: 'athletic',
  },
  '215': {
    pattern: [
      40,
      12,
      {
        subx: 64,
        suby: 16,
      },
    ],
    name: '？ブロック（スイッチON・影響範囲5マス）',
    category: 'athletic',
  },
  '216': {
    pattern: [
      40,
      11,
      {
        subx: 64,
        suby: 16,
      },
    ],
    name: '？ブロック（スイッチOFF・影響範囲5マス）',
    category: 'athletic',
  },
  '217': {
    pattern: 12,
    name: '連動スイッチ（重なるとON/OFF）',
    category: 'athletic',
  },
  '218': {
    pattern: 12,
    name: '連動スイッチ（上キーでON/OFF）',
    category: 'athletic',
  },
  '219': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（上から左）',
    category: 'athletic',
  },
  '220': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（上から右）',
    category: 'athletic',
  },
  '221': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（左から上）',
    category: 'athletic',
  },
  '222': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（右から上）',
    category: 'athletic',
  },
  '223': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（左から下）',
    category: 'athletic',
  },
  '224': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（右から下）',
    category: 'athletic',
  },
  '225': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（下から左）',
    category: 'athletic',
  },
  '226': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ファイヤーバー（下から右）',
    category: 'athletic',
  },
  '227': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 0,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（右から左回り）',
    category: 'athletic',
  },
  '228': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 16,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（左から右回り）',
    category: 'athletic',
  },
  '229': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 16,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（右から右回り）',
    category: 'athletic',
  },
  '230': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 0,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（左から左回り）',
    category: 'athletic',
  },
  '231': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 0,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（上から左回り）',
    category: 'athletic',
  },
  '232': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 16,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（上から右回り）',
    category: 'athletic',
  },
  '233': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 16,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（下から右回り）',
    category: 'athletic',
  },
  '234': {
    pattern: [
      50,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 0,
        suby: 16,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式ファイヤーバー（下から左回り）',
    category: 'athletic',
  },
  '235': {
    pattern: [
      23,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ブロック（ONで消える）',
    category: 'athletic',
  },
  '236': {
    pattern: [
      23,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ブロック（ONで出現）',
    category: 'athletic',
  },
  '237': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで左）',
    category: 'athletic',
  },
  '238': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで右）',
    category: 'athletic',
  },
  '239': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 48,
        suby: 0,
        x: -16,
        y: 0,
      },
    ],
    name: 'スイッチ式速く動くT字型（ONで左）',
    category: 'athletic',
  },
  '240': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
      {
        subx: 64,
        suby: 0,
      },
    ],
    name: 'スイッチ式速く動くT字型（ONで右）',
    category: 'athletic',
  },
  '241': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで左から上）',
    category: 'athletic',
  },
  '242': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで上から左）',
    category: 'athletic',
  },
  '243': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで右から上）',
    category: 'athletic',
  },
  '244': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式動くT字型（ONで上から右）',
    category: 'athletic',
  },
  '245': {
    pattern: 13,
    name: 'KEY1（落ちない）',
    category: 'athletic',
  },
  '246': {
    pattern: 14,
    name: 'KEY2（落ちない）',
    category: 'athletic',
  },
  '247': {
    pattern: [
      213,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 48,
        suby: 32,
      },
    ],
    name: 'KEY1が1つで開く扉',
    category: 'athletic',
  },
  '248': {
    pattern: [
      214,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 32,
        suby: 32,
      },
    ],
    name: 'KEY2が1つで開く扉',
    category: 'athletic',
  },
  '249': {
    pattern: 13,
    name: 'KEY1（落ちる）',
    category: 'athletic',
  },
  '250': {
    pattern: 14,
    name: 'KEY2（落ちる）',
    category: 'athletic',
  },
  '251': {
    pattern: [
      215,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: -16,
      },
      {
        subx: 48,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'KEY1が3つで開く扉',
    category: 'athletic',
  },
  '252': {
    pattern: [
      212,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: -16,
      },
      {
        subx: 32,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'KEY2が3つで開く扉',
    category: 'athletic',
  },
  '253': {
    pattern: [
      28,
      {
        subx: 80,
        suby: 32,
      },
    ],
    name: '乗ると壊れるブロック',
    category: 'athletic',
  },
  '254': {
    pattern: [
      37,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: -16,
      },
      {
        subx: 48,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'KEY1が3つでONの人（周囲10マス）',
    category: 'athletic',
  },
  '255': {
    pattern: [
      213,
      {
        subx: 64,
        suby: 32,
        x: -16,
        y: -16,
      },
      {
        subx: 32,
        suby: 32,
        x: -16,
        y: 0,
      },
      {
        subx: 32,
        suby: 0,
      },
    ],
    name: 'KEY2が3つでONの人（周囲10マス）',
    category: 'athletic',
  },
  '256': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ブロック（縦・ONで消える）',
    category: 'athletic',
  },
  '257': {
    pattern: [
      emptyblock_pattern,
      {
        subx: 48,
        suby: 16,
      },
    ],
    name: 'スイッチ式ブロック（縦・ONで出現）',
    category: 'athletic',
  },
  '258': {
    pattern: [
      167,
      {
        subx: 80,
        suby: 16,
      },
      {
        subx: 80,
        suby: 32,
        x: -16,
        y: 0,
      },
    ],
    name: 'ファイヤーボールなどで破壊するとON（周囲10マス）',
    category: 'athletic',
  },
  '259': {
    pattern: [
      167,
      {
        subx: 64,
        suby: 16,
      },
      {
        subx: 80,
        suby: 32,
        x: -16,
        y: 0,
      },
    ],
    name: 'ファイヤーボールなどで破壊するとON（周囲5マス）',
    category: 'athletic',
  },
  '260': {
    pattern: [
      167,
      {
        subx: 80,
        suby: 16,
      },
      {
        subx: 80,
        suby: 32,
        x: -16,
        y: 0,
      },
    ],
    name: 'しっぽで破壊するとON（周囲10マス）',
    category: 'athletic',
  },
  '261': {
    pattern: [
      167,
      {
        subx: 64,
        suby: 16,
      },
      {
        subx: 80,
        suby: 32,
        x: -16,
        y: 0,
      },
    ],
    name: 'しっぽで破壊するとON（周囲5マス）',
    category: 'athletic',
  },
  '262': {
    pattern: 39,
    name: '得点でグレネードを売る人',
    category: 'athletic',
  },
  '263': {
    pattern: emptyblock_pattern,
    name: '下キーで降りられる上り坂',
    category: 'athletic',
  },
  '264': {
    pattern: emptyblock_pattern,
    name: '下キーで降りられる下り坂',
    category: 'athletic',
  },
};
