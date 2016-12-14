import * as extend from 'extend';
import * as editActions from '../actions/edit';
import {
    Store,
} from '../scripts/reflux-util';

export interface EditState{
    /**
     * スクリーン
     */
    screen: 'map' | 'layer' | 'params' | 'project';
    /**
     * マップ編集画面の大きさx
     */
    view_width: number;
    /**
     * マップ編集画面の大きさy
     */
    view_height: number;
    /**
     * マップの表示位置x
     */
    scroll_x: number;
    /**
     * マップの表示位置y
     */
    scroll_y: number;
    /**
     * ステージ番号
     */
    stage: number;
    /**
     * エディットモード
     */
    mode: string; // TODO
    /**
     * 一時的（現在）
     */
    mode_current: string; // TODO
    /**
     * ペン（メインマップ）
     */
    pen: string; // TODO
    /**
     * ペン（背景レイヤー）
     */
    pen_layer: string; // TODO
    /**
     * どのparamTypeを編集しているか
     */
    param_type: string; // TODO

    /**
     * グリッド表示
     */
    grid: boolean;
    /**
     * マップも表示
     */
    render_map: boolean;
    /**
     * 背景レイヤーも表示
     */
    render_layer: boolean;

    /**
     * マップが押されているか
     */
    mouse_down: boolean;
    /**
     * マウスが押された場所x
     */
    mouse_sx: number;
    /**
     * マウスが押された場所y
     */
    mouse_sy: number;
    /**
     * マウスが押されたときのスクロール状態x
     */
    scroll_sx: number;
    /**
     * マウスが押されたときのスクロール状態y
     */
    scroll_sy: number;
}
export class EditStore extends Store<EditState>{
    constructor(){
        super();
        this.listenables = editActions;
        this.state = {
            screen: 'map',
            view_width: 16,
            view_height: 10,
            scroll_x: 0,
            scroll_y: 20,
            stage: 1,
            mode: 'pen',
            mode_current: 'pen',
            pen: '.',
            pen_layer: '..',
            param_type: '',
            grid: false,
            render_map: false,
            render_layer: false,
            mouse_down: false,
            mouse_sx: Number.NaN,
            mouse_sy: Number.NaN,
            scroll_sx: Number.NaN,
            scroll_sy: Number.NaN,
        };
    }
    onChangeScreen({screen}: editActions.ChangeScreenAction){
        this.setState({
            screen,
        });
    }
    onChangeStage({stage}: editActions.ChangeStageAction){
        this.setState({
            stage,
        });
    }
    onChangeMode({mode}: editActions.ChangeModeAction){
        this.setState({
            mode,
        });
    }
    onChangeView({width, height}: editActions.ChangeViewAction){
        // TODO
        this.setState({
            view_width: width,
            view_height: height,
            scroll_x: Math.min(this.state.scroll_x, 180 - width),
            scroll_y: Math.min(this.state.scroll_y, 30 - height),
        });
    }
    onChangePen({pen,mode}: editActions.ChangePenAction){
        this.setState({
            pen,
            mode: mode === true ? 'pen' : this.state.mode,
        });
    }
    onChangePenLayer({pen,mode}: editActions.ChangePenAction){
        this.setState({
            pen_layer: pen,
            mode: mode === true ? 'pen' : this.state.mode,
        });
    }
    onChangeParamType({param_type}: editActions.ChangeParamTypeAction){
        this.setState({
            param_type,
        });
    }
    onChangeGrid({grid}: editActions.ChangeGridAction){
        this.setState({
            grid,
        });
    }
    onChangeRenderMode({render_map, render_layer}: editActions.ChangeRenderModeAction){
        this.setState({
            render_map: render_map != null ? render_map : this.state.render_map,
            render_layer: render_layer != null ? render_layer : this.state.render_layer,
        });
    }
    onMouseDown({x,y,mode}: editActions.MouseDownAction){
        this.setState({
            mouse_down: true,
            mouse_sx: x,
            mouse_sy: y,
            scroll_sx: this.state.scroll_x,
            scroll_sy: this.state.scroll_y,
            mode_current: mode || this.state.mode,
        });
    }
    onMouseUp(){
        this.setState({
            mouse_down: false,
            mouse_sx: Number.NaN,
            mouse_sy: Number.NaN,
        });
    }
    onScroll({x,y}: editActions.ScrollAction){
        if (x !== this.state.scroll_x || y !== this.state.scroll_y){
            this.setState({
                scroll_x: x,
                scroll_y: y,
            });
        }
    }
}

export default new EditStore();
