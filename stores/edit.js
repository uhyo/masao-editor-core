var Reflux=require('reflux');

var editActions=require('../actions/edit');

/* edit store
 *
 * # マップの表示位置
 * scroll_x: number
 * scroll_y: number
 * # ペンの選択
 * pen: string
 */
module.exports = Reflux.createStore({
    init(){
        //スクロール座標
        this.scroll_x = 0, this.scroll_y = 20;
        this.pen=".";
    },
    getInitialState(){
        return this.makeState();
    },
    listenables: editActions,
    makeState(){
        return {
            scroll_x: this.scroll_x,
            scroll_y: this.scroll_y,
            pen: this.pen
        };
    },
    onChangePen({pen}){
        this.pen=pen;
        this.trigger(this.makeState());
    }
});
