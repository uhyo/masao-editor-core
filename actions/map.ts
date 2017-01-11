import {
    createAction,
} from '../scripts/reflux-util';

export interface UpdateMapAction{
    stage: number;
    x: number;
    y: number;
    chip: number;
}
export interface UpdateLayerAction{
    stage: number;
    x: number;
    y: number;
    chip: number;
}
export const updateMap = createAction<UpdateMapAction>();
export const updateLayer = createAction<UpdateLayerAction>();

export interface SetAdvancedAction{
    advanced: boolean;
}
export const setAdvanced = createAction<SetAdvancedAction>();

export interface ResizeMapAction{
    stage: number;

    // 4方向の大きさ変更
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export const resizeMap = createAction<ResizeMapAction>();
