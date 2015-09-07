var Reflux=require('reflux');

var editActions=require('../actions/edit');

/* edit store
 *
 * # 画面の大きさ
 * view_width: number
 * view_height: number
 * # マップの表示位置
 * scroll_x: number
 * scroll_y: number
 * # エディットモード
 * mode: string
 * # ペンの選択
 * pen: string
 *
 * ### エディットオプション
 * # グリッド
 * grid: boolean
 *
 * ### 編集状態
 * # マウスの押下状態
 * mouse_down: boolean
 * # マウスが押下された場所（px単位）
 * mouse_sx: number
 * mouse_sy: number
 * # マウスが押下されたときのスクロール状態
 * scroll_sx: number
 * scroll_sy: number
 */
module.exports = Reflux.createStore({
    init(){
        this.view_width=16, this.view_height=10;
        //スクロール座標
        this.scroll_x = 0, this.scroll_y = 20;
        //モード
        this.mode="pen";
        //ペン
        this.pen=".";
        //グリッド
        this.grid=false;
        //マウスの押下状態
        this.mouse_down=false;
        this.mouse_sx=null;
        this.mouse_sy=null;
        this.scroll_sx=null;
        this.scroll_sy=null;
    },
    getInitialState(){
        return this.makeState();
    },
    listenables: editActions,
    makeState(){
        return {
            view_width: this.view_width,
            view_height: this.view_height,
            scroll_x: this.scroll_x,
            scroll_y: this.scroll_y,
            mode: this.mode,
            pen: this.pen,
            grid: this.grid,
            mouse_down: this.mouse_down,
            mouse_sx: this.mouse_sx,
            mouse_sy: this.mouse_sy,
            scroll_sx: this.scroll_sx,
            scroll_sy: this.scroll_sy
        };
    },
    onChangeMode({mode}){
        this.mode=mode;
        this.trigger(this.makeState());
    },
    onChangePen({pen}){
        this.pen=pen;
        this.trigger(this.makeState());
    },
    onChangeGrid({grid}){
        this.grid=grid;
        this.trigger(this.makeState());
    },
    onMouseDown({x,y}){
        this.mouse_down=true;
        this.mouse_sx=x;
        this.mouse_sy=y;
        this.scroll_sx=this.scroll_x;
        this.scroll_sy=this.scroll_y;
        this.trigger(this.makeState());
    },
    onMouseUp(){
        this.mouse_down=false;
        this.mouse_sx=null;
        this.mouse_sy=null;
        this.trigger(this.makeState());
    },
    onScroll({x,y}){
        if(x!==this.scroll_x || y!==this.scroll_y){
            this.scroll_x=x;
            this.scroll_y=y;
            this.trigger(this.makeState());
        }
    }
});
