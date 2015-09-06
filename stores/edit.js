var Reflux=require('reflux');

var editActions=require('../actions/edit');

/* edit store
 *
 * # マップの表示位置
 * scroll_x: number
 * scroll_y: number
 * # エディットモード
 * mode: string
 * # ペンの選択
 * pen: string
 * # マウスの押下状態
 * mouse_down: boolean
 * # マウスが押下された場所（px単位）
 * mouse_sx: number
 * mouse_sy: number
 */
module.exports = Reflux.createStore({
    init(){
        //スクロール座標
        this.scroll_x = 0, this.scroll_y = 20;
        //モード
        this.mode="pen";
        //ペン
        this.pen=".";
        //マウスの押下状態
        this.mouse_down=false;
        this.mouse_sx=null;
        this.mouse_sy=null;
    },
    getInitialState(){
        return this.makeState();
    },
    listenables: editActions,
    makeState(){
        return {
            scroll_x: this.scroll_x,
            scroll_y: this.scroll_y,
            mode: this.mode,
            pen: this.pen,
            mouse_down: this.mouse_down,
            mouse_sx: this.mouse_sx,
            mouse_sy: this.mouse_sy
        };
    },
    onChangePen({pen}){
        this.pen=pen;
        this.trigger(this.makeState());
    },
    onMouseDown({x,y}){
        this.mouse_down=true;
        this.mouse_sx=x;
        this.mouse_sy=y;
        this.trigger(this.makeState());
    },
    onMouseUp(){
        this.mouse_down=false;
        this.mouse_sx=null;
        this.mouse_sy=null;
        this.trigger(this.makeState());
    }
});
