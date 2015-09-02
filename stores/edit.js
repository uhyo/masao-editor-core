var Reflux=require('reflux');

/* edit store
 *
 * scroll_x: number
 * scroll_y: number
 */
module.exports = Reflux.createStore({
    init(){
        //スクロール座標
        this.scroll_x = 0, this.scroll_y = 20;
    },
    getInitialState(){
        return this.makeState();
    },
    makeState(){
        return {
            scroll_x: this.scroll_x,
            scroll_y: this.scroll_y
        };
    }
});
