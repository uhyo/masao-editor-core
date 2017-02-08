//edit actions
import {
    createAction,
} from '../scripts/reflux-util';

export type Mode = 'pen' | 'eraser' | 'hand' | 'spuit';

// ツールの使用中状態
export interface PenTool{
    type: 'pen';
}
export interface EraserTool{
    type: 'eraser';
}
export interface HandTool{
    type: 'hand';

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

export type ToolState = PenTool | EraserTool | HandTool;

export interface ChangeScreenAction {
    screen: 'map' | 'layer' | 'params' | 'project';
}
export const changeScreen = createAction<ChangeScreenAction>();

export interface ChangeStageAction {
    stage: number;
}
export const changeStage = createAction<ChangeStageAction>();

export interface ChangeModeAction {
    mode: Mode;
}
export const changeMode = createAction<ChangeModeAction>();

export interface ChangeViewAction {
    width: number;
    height: number;
}
export const changeView = createAction<ChangeViewAction>();

export interface ChangePenAction {
    pen: number;
    mode?: boolean;
}
export const changePen = createAction<ChangePenAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {pen: 0};
        }else if(obj.pen==null){
            return {pen: 0};
        }
        return;
    },
});
export interface ChangePenLayerAction {
    pen: number;
    mode?: boolean;
}
export const changePenLayer = createAction<ChangePenLayerAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {
                pen: 0,
            };
        }else if(obj.pen==null){
            return {pen: 0};
        }
        return;
    },
});

export interface ChangeParamTypeAction {
    param_type: string;
}
export const changeParamType = createAction<ChangeParamTypeAction>();

export interface ChangeGridAction {
    grid: boolean;
}
export const changeGrid = createAction<ChangeGridAction>();

export interface ChangeRenderModeAction {
    render_map?: boolean;
    render_layer?: boolean;
}
export const changeRenderMode = createAction<ChangeRenderModeAction>();

export interface SetToolAction {
    tool: ToolState | null;
}
export const setTool = createAction<SetToolAction>();

export interface MouseDownAction {
    x: number;
    y: number;
    mode?: Mode;
}
export const mouseDown = createAction<MouseDownAction>();

export interface ScrollAction {
    x: number;
    y: number;
}
export const scroll = createAction<ScrollAction>();

export interface ChangeChipselectSizeAction {
    width: number;
    height: number;
}
export const changeChipselectSize = createAction<ChangeChipselectSizeAction>();

export interface ChangeChipselectScrollAction {
    y: number;
}
export const changeChipselectScroll = createAction<ChangeChipselectScrollAction>();
