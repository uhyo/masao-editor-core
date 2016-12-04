"use strict";
var Reflux=require('reflux');

var editActions=require('../actions/edit');

/* edit store
 * # スクリーン
 * screen: string // ["map","layer","params"]
 *
 * # マップ編集画面の大きさ
 * view_width: number
 * view_height: number
 * # マップの表示位置
 * scroll_x: number
 * scroll_y: number
 * # ステージ
 * stage: number // [1,2,3,4]
 * # エディットモード
 * mode: string
 * # 一時的（現在）
 * mode_current: string
 * # ペンの選択
 * pen: string
 * pen_layer: string
 *
 * # どのparamTypeを編集しているか
 * param_type: string
 *
 * ### エディットオプション
 * # グリッド
 * grid: boolean
 * # マップも表示
 * render_map: boolean  
 * # 背景レイヤーも表示
 * render_layer: boolean
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
        this.screen = "map";
        this.view_width=16, this.view_height=10;
        //スクロール座標
        this.scroll_x=0, this.scroll_y=20;
        //ステージ
        this.stage=1;
        //モード
        this.mode="pen";
        //ペン
        this.pen=".";
        this.pen_layer="..";
        //param
        this.param_type="";
        //グリッド
        this.grid=false;
        //もう一方も表示
        this.render_map=false;
        this.render_layer=false;
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
            screen: this.screen,
            view_width: this.view_width,
            view_height: this.view_height,
            scroll_x: this.scroll_x,
            scroll_y: this.scroll_y,
            stage: this.stage,
            mode: this.mode,
            mode_current: this.mode_current,
            pen: this.pen,
            pen_layer: this.pen_layer,
            param_type: this.param_type,
            grid: this.grid,
            render_map: this.render_map,
            render_layer: this.render_layer,
            mouse_down: this.mouse_down,
            mouse_sx: this.mouse_sx,
            mouse_sy: this.mouse_sy,
            scroll_sx: this.scroll_sx,
            scroll_sy: this.scroll_sy
        };
    },
    onChangeScreen({screen}){
        this.screen=screen;
        this.trigger(this.makeState());
    },
    onChangeStage({stage}){
        this.stage=stage;
        this.trigger(this.makeState());
    },
    onChangeMode({mode}){
        this.mode=mode;
        this.trigger(this.makeState());
    },
    onChangeView({width, height}){
        this.view_width = width;
        this.view_height = height;
        // マップの大きさを超えないように (TODO)
        this.scroll_x = Math.min(this.scroll_x, 180 - this.view_width);
        this.scroll_y = Math.min(this.scroll_y, 30 - this.view_height);

        this.trigger(this.makeState());
    },
    onChangePen({pen,mode}){
        this.pen=pen;
        if(mode===true){
            this.mode="pen";
        }
        this.trigger(this.makeState());
    },
    onChangePenLayer({pen,mode}){
        this.pen_layer=pen;
        if(mode===true){
            this.mode="pen";
        }
        this.trigger(this.makeState());
    },
    onChangeParamType({param_type}){
        this.param_type=param_type;
        this.trigger(this.makeState());
    },
    onChangeGrid({grid}){
        this.grid=grid;
        this.trigger(this.makeState());
    },
    onChangeRenderMode({render_map, render_layer}){
        if(render_map!=null){
            this.render_map=render_map;
        }
        if(render_layer!=null){
            this.render_layer=render_layer;
        }
        this.trigger(this.makeState());
    },
    onMouseDown({x,y,mode}){
        this.mouse_down=true;
        this.mouse_sx=x;
        this.mouse_sy=y;
        this.scroll_sx=this.scroll_x;
        this.scroll_sy=this.scroll_y;
        this.mode_current = mode || this.mode;
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
