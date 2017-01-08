//edit actions
import {
    createAction,
} from '../scripts/reflux-util';

export interface ChangeScreenAction {
    screen: 'map' | 'layer' | 'params' | 'project';
}
export const changeScreen = createAction<ChangeScreenAction>();

export interface ChangeStageAction {
    stage: number;
}
export const changeStage = createAction<ChangeStageAction>();

export interface ChangeModeAction {
    mode: 'pen' | 'eraser' | 'hand' | 'spuit';
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

export interface MouseDownAction {
    x: number;
    y: number;
    mode?: ChangeModeAction['mode'];
}
export const mouseDown = createAction<MouseDownAction>();

export interface MouseUpAction {
}
export const mouseUp = createAction<MouseUpAction>();

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
