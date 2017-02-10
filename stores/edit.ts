import * as editActions from '../actions/edit';
import {
    setAdvanced,
    SetAdvancedAction,
} from '../actions/map';
import {
    Mode,
    ToolState,
} from '../actions/edit';
import {
    Store,
} from '../scripts/reflux-util';

export type Screen = 'map' | 'layer' | 'params' | 'project';
// ツールの使用中状態

export interface EditState{
    /**
     * スクリーン
     */
    screen: Screen;
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
    mode: Mode;
    /**
     * ペン（メインマップ）
     */
    pen: number; // TODO
    /**
     * ペン（背景レイヤー）
     */
    pen_layer: number; // TODO
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
     * ツール状態
     */
    tool: ToolState | null;

    /**
     * チップ選択画面の横幅
     */
    chipselect_width: number;
    /**
     * チップ選択画面の縦幅
     */
    chipselect_height: number;
    /**
     * チップ選択画面のスクロール位置(Y)
     */
    chipselect_scroll: number;
}
export class EditStore extends Store<EditState>{
    constructor(){
        super();
        this.listenables = [editActions, {
            setAdvanced,
        }];
        this.state = {
            screen: 'map',
            view_width: 16,
            view_height: 10,
            scroll_x: 0,
            scroll_y: 20,
            stage: 1,
            mode: 'pen',
            pen: 0,
            pen_layer: 0,
            param_type: '',
            grid: false,
            render_map: false,
            render_layer: false,
            tool: null,
            chipselect_width: 8,
            chipselect_height: 9,
            chipselect_scroll: 0,
        };
    }
    onChangeScreen({screen}: editActions.ChangeScreenAction){
        if (this.state.screen !== screen){
            this.setState({
                screen,
                chipselect_scroll: 0,
            });
        }
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
        this.setState({
            view_width: width,
            view_height: height,
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
    onSetTool({tool}: editActions.SetToolAction){
        this.setState({
            tool,
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
    onChangeChipselectSize({width, height}: editActions.ChangeChipselectSizeAction){
        if (width !== this.state.chipselect_width || height !== this.state.chipselect_height){
            this.setState({
                chipselect_width: width,
                chipselect_height: height,
            });
        }
    }
    onChangeChipselectScroll({y}: editActions.ChangeChipselectScrollAction){
        if (y !== this.state.chipselect_scroll){
            this.setState({
                chipselect_scroll: y,
            });
        }
    }
    onSetAdvanced({}: SetAdvancedAction){
        // advancedのON/OFFでchipselectの大きさが変わるので
        this.setState({
            chipselect_scroll: 0,
        });
    }
}

export default new EditStore();
