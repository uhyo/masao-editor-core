//chipとパターンの対応表
var chipTable={
    A: {
        pattern: 100,
        name: "主人公"
    },
    B: {
        pattern: 140,
        name: "亀（足元に空白があると向きを変える）"
    },
    C: {
        pattern: 140,
        name: "亀（足元に空白があると落ちる）"
    },
    D: {
        pattern: 140,
        name: "亀（足元に空白があると落ちる 3匹連続）"
    },
    E: {
        pattern: 143,
        name: "ピカチー"
    },
    F: {
        pattern: 150,
        name: "チコリン"
    },
    G: {
        pattern: 152,
        name: "ヒノララシ"
    },
    H: {
        pattern: 147,
        name: "ポッピー（上下移動）"
    },
    I: {
        pattern: 147,
        name: "ポッピー（直進）"
    },
    J: {
        pattern: 147,
        name: "ポッピー（直進　3羽連続）"
    },
    K: {
        pattern: {
            chip: 190,
            width: 96
        },
        name: "動く床（上下移動）"
    },
    L: {
        pattern: {
            chip: 190,
            width: 96
        },
        name: "動く床（左右移動）"
    },
    M: {
        pattern: {
            chip: 190,
            width: 96
        },
        name: "動く床（左右移動×2）"
    },
    N: {
        pattern: {
            chip: 184,
            x: 96,
            y: 576,
            dx: -32,
            dy: 0,
            width: 96,
            height: 64
        },
        name: "ドッスンスン"
    },
    O: {
        pattern: 154,
        name: "マリリ"
    },
    P: {
        pattern: 158,
        name: "ヤチャモ"
    },
    Q: {
        pattern: 160,
        name: "ミズタロウ"
    },
    R: {
        pattern: 164,
        name: "エアームズ"
    },
    S: {
        pattern: 196,
        name: "グラーダ"
    },
    T: {
        pattern: 198,
        name: "カイオール"
    },
    U: {
        pattern: 50,
        name: "ファイヤーバー（左回り）"
    },
    V: {
        pattern: 50,
        name: "ファイヤーバー（右回り）"
    },
    W: {
        pattern: 166,
        name: "タイキング"
    },
    X: {
        pattern: 167,
        name: "クラゲッソ"
    },
    Y: {
        pattern: 86,
        name: "水草"
    },
    Z: {
        pattern: 248,
        name: "センクウザ"
    },
    a: {
        pattern: 20,
        name: "ブロック1"
    },
    b: {
        pattern: 21,
        name: "ブロック2"
    },
    c: {
        pattern: 22,
        name: "ブロック3"
    },
    d: {
        pattern: 23,
        name: "ブロック4"
    },
    e: {
        pattern: 24,
        name: "ブロック5"
    },
    f: {
        pattern: 25,
        name: "ブロック6"
    },
    g: {
        pattern: 26,
        name: "ブロック7"
    },
    h: {
        pattern: 27,
        name: "ブロック8"
    },
    i: {
        pattern: 28,
        name: "ブロック9"
    },
    j: {
        pattern: 29,
        name: "ブロック10"
    },
    k: {
        pattern: [40,90],
        name: "？ブロック（コイン）"
    },
    l: {
        pattern: [40,90],
        name: "？ブロック（コイン3枚）"
    },
    m: {
        pattern: [40,42],
        name: "？ブロック（ファイヤーボール）"
    },
    n: {
        pattern: [40,43],
        name: "？ブロック（バリア）"
    },
    o: {
        pattern: [40,44],
        name: "？ブロック（タイム）"
    },
    p: {
        pattern: [40,45],
        name: "？ブロック（ジェット）"
    },
    q: {
        pattern: [40,46],
        name: "？ブロック（ヘルメット）"
    },
    r: {
        pattern: [40,47],
        name: "？ブロック（しっぽ）"
    },
    s: {
        pattern: [40,48],
        name: "？ブロック（ドリル）"
    },
    t: {
        pattern: [40,49],
        name: "？ブロック（グレネード）"
    },
    u: {
        pattern: {
            chip: 60,
            width: 64
        },
        name: "リンク土管1",
        width: 64
    },
    v: {
        pattern: {
            chip: 62,
            width: 64
        },
        name: "リンク土管2",
    },
    w: {
        pattern: {
            chip: 64,
            width: 64
        },
        name: "リンク土管3"
    },
    x: {
        pattern: {
            chip: 66,
            width: 64
        },
        name: "リンク土管4"
    },
    y: {
        pattern: [40,59],
        name: "？ブロック（1up茸）"
    },
    z: {
        pattern: 69,
        name: "すべる床"
    },
    "+": {
        pattern: 36,
        name: "一言メッセージ1"
    },
    "-": {
        pattern: 37,
        name: "一言メッセージ2"
    },
    "*": {
        pattern: 38,
        name: "一言メッセージ3"
    },
    "/": {
        pattern: 39,
        name: "一言メッセージ4"
    },
    "1": {
        pattern: 1,
        name: "雲の左側"
    },
    "2": {
        pattern: 2,
        name: "雲の右側"
    },
    "3": {
        pattern: 3,
        name: "草"
    },
    "4": {
        pattern: 4,
        name: "水"
    },
    "5": {
        pattern: 5,
        name: "上向きのトゲ"
    },
    "6": {
        pattern: 6,
        name: "下向きのトゲ"
    },
    "7": {
        pattern: 96,
        name: "ろうそく"
    },
    "8": {
        pattern: 94,
        name: "星"
    },
    "9": {
        pattern: 90,
        name: "コイン"
    },
    "{": {
        pattern: 140,
        name: "亀（追尾）"
    },
    "[": {
        pattern: 35,
        name: "下から通れる床"
    },
    "]": {
        pattern: 30,
        name: "ハシゴ"
    },
    "<": {
        pattern: 18,
        name: "上り坂"
    },
    ">": {
        pattern: 19,
        name: "下り坂"
    },
    ".": {
        pattern: 0,
        name: "空白"
    }
};


exports.chipTable = chipTable;
exports.chipList = Object.keys(chipTable);

function cssColor(r,g,b){
    return `rgb(${r},${g},${b})`;
}
exports.cssColor = cssColor;

//ctxの(x,y)座標にchipをdrawする
//pattern: パターン画像
function drawChip(ctx,pattern,chip,x,y,full){
    if(chip==="."){
        return;
    }
    var t=chipTable[chip];
    if(t==null){
        return;
    }
    var p=t.pattern;
    if(!Array.isArray(p)){
        p=[p];
    }
    for(var i=0;i<p.length;i++){
        let pi=p[i];
        var chip = "number"===typeof pi ? pi : pi.chip;
        let sx,sy;
        //その番号を描画
        if(full){
            sy=pi.y || Math.floor(chip/10)*32, sx=pi.x || (chip%10)*32;
            let width=pi.width || 32, height=pi.height || 32;
            let xx = x+(pi.dx||0), yy=y+(pi.dy||0);
            ctx.drawImage(pattern, sx, sy, width, height, xx, yy, width, height);
        }else{
            sy=Math.floor(chip/10)*32, sx=(chip%10)*32;
            ctx.drawImage(pattern, sx, sy, 32, 32, x, y, 32, 32);
        }
    }
}

exports.drawChip = drawChip;
