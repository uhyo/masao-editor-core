import {
    Chip,
} from './interface';
// 敵データのテーブル

export const enemyTable: Record<string, Chip> = {
    "100": {
        pattern: [140, {
            subx: 0,
            suby: 0,
        }],
        name: "亀（足元に空白があると向きを変える）",
        category: "enemy",
    },
    "110": {
        pattern: [140, {
            subx: 48,
            suby: 0
        }],
        name: "亀（足元に空白があると落ちる）",
        category: "enemy"
    },
    "200": {
        pattern: 143,
        name: "ピカチー（電撃）",
        category: "enemy"
    },
    "201": {
        pattern: 143,
        name: "ピカチー（みずでっぽう　水平発射）",
        category: "enemy"
    },
    "202": {
        pattern: 143,
        name: "ピカチー（電撃３発）",
        category: "enemy"
    },
    "203": {
        pattern: 143,
        name: "ピカチー（プラズマ砲）",
        category: "enemy"
    },
    "300": {
        pattern: 150,
        name: "チコリン（はっぱカッター）",
        category: "enemy"
    },
    "301": {
        pattern: 150,
        name: "チコリン（はっぱカッター　地形で消える）",
        category: "enemy"
    },
    "310": {
        pattern: 150,
        name: "チコリン（ヒノララシを8匹投げる）",
        category: "enemy"
    },
    "311": {
        pattern: 150,
        name: "チコリン（ヒノララシを無限に投げる）",
        category: "enemy"
    },
    "312": {
        pattern: 150,
        name: "チコリン（マリリを８匹投げる）",
        category: "enemy"
    },
    "313": {
        pattern: 150,
        name: "チコリン（マリリ無限に投げる）",
        category: "enemy"
    },
    "320": {
        pattern: 150,
        name: "チコリン（はっぱカッター　乱れ射ち）",
        category: "enemy"
    },
    "330": {
        pattern: 150,
        name: "チコリン（ソーラービーム　左へ発射）",
        category: "enemy"
    },
    "335": {
        pattern: 150,
        name: "チコリン（ソーラービーム　右へ発射）",
        category: "enemy"
    },
    "400": {
        pattern: 152,
        name: "ヒノララシ",
        category: "enemy"
    },
    "500": {
        pattern: [{
            chip: 147
        },{
            subx: 16,
            suby: 0
        }],
        name: "ポッピー（上下移動）",
        category: "enemy"
    },
    "510": {
        pattern: [{
            chip: 147
        },{
            subx: 48,
            suby: 0
        }],
        name: "ポッピー（直進）",
        category: "enemy"
    },
    "520": {
        pattern: 147,
        name: "ポッピー（火の粉）",
        category: "enemy"
    },
    "530": {
        pattern: 147,
        name: "ポッピー（火の粉　３連射）",
        category: "enemy"
    },
    "540": {
        pattern: 147,
        name: "ポッピー（バブル光線３発）",
        category: "enemy"
    },
    "550": {
        pattern: 147,
        name: "ポッピー（ハリケンブラスト）",
        category: "enemy"
    },
    "600": {
        pattern: 154,
        name: "マリリ（ジャンプで進む）",
        category: "enemy"
    },
    "601": {
        pattern: 154,
        name: "マリリ（その場でジャンプ）",
        category: "enemy"
    },
    "602": {
        pattern: 154,
        name: "マリリ（左右にジャンプ）",
        category: "enemy"
    },
    "660": {
        pattern: [154, {
            subx: 0,
            suby: 0,
        }],
        name: "マリリ（左右移動）",
        category: "enemy"
    },
    "670": {
        pattern: 154,
        name: "マリリ（体当たり）",
        category: "enemy"
    },
    "700": {
        pattern: 158,
        name: "ヤチャモ（火の粉）",
        category: "enemy"
    },
    "701": {
        pattern: 158,
        name: "ヤチャモ（何もしない）",
        category: "enemy"
    },
    "702": {
        pattern: 158,
        name: "ヤチャモ（グレネード）",
        category: "enemy"
    },
    "703": {
        pattern: 158,
        name: "ヤチャモ（はっぱカッター３発）",
        category: "enemy"
    },
    "704": {
        pattern: 158,
        name: "ヤチャモ（プラズマ砲）",
        category: "enemy"
    },
    "710": {
        pattern: 158,
        name: "ヤチャモ（火の粉　速射）",
        category: "enemy"
    },
    "711": {
        pattern: 158,
        name: "ヤチャモ（火の粉　３速射）",
        category: "enemy"
    },
    "720": {
        pattern: 158,
        name: "ヤチャモ（破壊光線　左へ発射）",
        category: "enemy"
    },
    "725": {
        pattern: 158,
        name: "ヤチャモ（破壊光線　右へ発射）",
        category: "enemy"
    },
    "800": {
        pattern: 160,
        name: "ミズタロウ（みずでっぽう）",
        category: "enemy"
    },
    "801": {
        pattern: 160,
        name: "ミズタロウ（はっぱカッター３発）",
        category: "enemy"
    },
    "803": {
        pattern: 160,
        name: "ミズタロウ（電撃）",
        category: "enemy"
    },
    "804": {
        pattern: 160,
        name: "ミズタロウ（ハリケンブラスト）",
        category: "enemy"
    },
    "900": {
        pattern: 164,
        name: "エアームズ（壁に当たると止まる）",
        category: "enemy"
    },
    "920": {
        pattern: 164,
        name: "エアームズ（その場で爆弾投下）",
        category: "enemy"
    },
    "921": {
        pattern: 164,
        name: "エアームズ（その場でグレネード投下）",
        category: "enemy"
    },
    "930": {
        pattern: 164,
        name: "エアームズ（左右に動いて爆弾投下）",
        category: "enemy"
    },
    "950": {
        pattern: 164,
        name: "エアームズ（壁に当たると向きを変える）",
        category: "enemy"
    },
    "1000": {
        pattern: [166, {
            subx: 0,
            suby: 0,
        }],
        name: "タイキング（左右移動 水中専用）",
        category: "enemy"
    },
    "1050": {
        pattern: 166,
        name: "タイキング（はねる）",
        category: "enemy"
    },
    "1060": {
        pattern: 166,
        name: "タイキング（縄張りをまもる）",
        category: "enemy"
    },
    "1070": {
        pattern: [166, {
            subx: 0,
            suby: 16,
        }],
        name: "タイキング（左回り）",
        category: "enemy"
    },
    "1080": {
        pattern: [166, {
            subx: 16,
            suby: 16,
        }],
        name: "タイキング（右回り）",
        category: "enemy"
    },
    "1100": {
        pattern: 167,
        name: "クラゲッソ（バブル光線 水中専用）",
        category: "enemy"
    },
    "1150": {
        pattern: 167,
        name: "クラゲッソ（近づくと落ちる）",
        category: "enemy"
    },
    "1160": {
        pattern: 167,
        name: "クラゲッソ（縄張りをまもる）",
        category: "enemy"
    },
    "1170": {
        pattern: [167, {
            subx: 0,
            suby: 16,
        }],
        name: "クラゲッソ（左回り）",
        category: "enemy"
    },
    "1180": {
        pattern: [167, {
            subx: 16,
            suby: 16,
        }],
        name: "クラゲッソ（右回り）",
        category: "enemy"
    },
    "1200": {
        pattern: 140,
        name: "亀（追尾）",
        category: "enemy"
    },
    "1400": {
        pattern: 143,
        name: "ピカチー（追尾）",
        category: "enemy"
    },
};


