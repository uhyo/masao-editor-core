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
        pattern: 190,
        name: "動く床（上下移動）"
    },
    L: {
        pattern: 190,
        name: "動く床（左右移動）"
    },
    M: {
        pattern: 190,
        name: "動く床（左右移動×2）"
    },
    N: {
        pattern: 184,
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
        pattern: 40,
        name: "？ブロック（コイン）"
    },
    l: {
        pattern: 40,
        name: "？ブロック（コイン3枚）"
    },
    m: {
        pattern: 40,
        name: "？ブロック（ファイヤーボール）"
    },
    n: {
        pattern: 40,
        name: "？ブロック（バリア）"
    },
    o: {
        pattern: 40,
        name: "？ブロック（タイム）"
    },
    p: {
        pattern: 40,
        name: "？ブロック（ジェット）"
    },
    q: {
        pattern: 40,
        name: "？ブロック（ヘルメット）"
    },
    r: {
        pattern: 40,
        name: "？ブロック（しっぽ）"
    },
    s: {
        pattern: 40,
        name: "？ブロック（ドリル）"
    },
    t: {
        pattern: 40,
        name: "？ブロック（グレネード）"
    },
    u: {
        pattern: 60,
        name: "リンク土管1"
    },
    v: {
        pattern: 60,
        name: "リンク土管2"
    },
    w: {
        pattern: 60,
        name: "リンク土管3"
    },
    x: {
        pattern: 60,
        name: "リンク土管4"
    },
    y: {
        pattern: 40,
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
function drawChip(ctx,pattern,chip,x,y){
    var t=chipTable[chip];
    if(t==null){
        return;
    }
    var sy=Math.floor(t.pattern/10), sx=t.pattern%10;
    //その番号を描画
    ctx.drawImage(pattern, sx*32, sy*32, 32, 32, x, y, 32,32);
}

exports.drawChip = drawChip;
