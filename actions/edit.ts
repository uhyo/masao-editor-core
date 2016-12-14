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
    mode: string;
}
export const changeMode = createAction<ChangeModeAction>();

export interface ChangeViewAction {
    width: number;
    height: number;
}
export const changeView = createAction<ChangeViewAction>();

export interface ChangePenAction {
    pen: string;
    mode?: boolean;
}
export const changePen = createAction<ChangePenAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {pen: "."};
        }else if(obj.pen==null){
            return {pen: "."};
        }
        return;
    },
});
export const changePenLayer = createAction<ChangePenAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {
                pen: ".."
            };
        }else if(obj.pen==null){
            return {pen: ".."};
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
    mode?: string;
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
