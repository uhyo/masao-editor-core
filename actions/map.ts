import {
    createAction,
} from '../scripts/reflux-util';

export type Chip = number;

export interface UpdateMapAction{
    stage: number;
    x: number;
    y: number;
    chip: Chip;
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

// advanced-mapを全部読んだときの顔
export interface LoadAdvancedMapAction{
    stage: number;
    size: {
        x: number;
        y: number;
    };
    map: Array<Array<number>>;
    layer: Array<Array<number>>;
}
export const loadMap = createAction<LoadAdvancedMapAction>();
