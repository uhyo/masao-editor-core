import {
    createAction,
} from '../scripts/reflux-util';

export type Chip = number;

export interface UpdateMapAction{
    // 1 -- 4
    stage: number;
    x: number;
    y: number;
    chip: Chip;
}
export interface UpdateLayerAction{
    // 1 -- 4
    stage: number;
    x: number;
    y: number;
    chip: number;
}
export const updateMap = createAction<UpdateMapAction>();
export const updateLayer = createAction<UpdateLayerAction>();

/**
 * 矩形でマップを更新するアクション
 */
export interface UpdateMapRectAction<C>{
    // 1 -- 4
    stage: number;
    // 開始位置
    left: number;
    top: number;
    right: number;
    bottom: number;
    chip: C;
}
export const updateMapRect = createAction<UpdateMapRectAction<Chip>>();
export const updateLayerRect = createAction<UpdateMapRectAction<number>>();

export interface SetAdvancedAction{
    advanced: boolean;
}
export const setAdvanced = createAction<SetAdvancedAction>();

export interface ResizeMapAction{
    // 1 -- 4
    stage: number;

    // 4方向の大きさ変更
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export const resizeMap = createAction<ResizeMapAction>();

// advanced-mapを全部読んだときの顔
export interface LoadMapAction{
    // 1 -- 4
    stage: number;
    size: {
        x: number;
        y: number;
    };
    map: Array<Array<number>>;
    layer: Array<Array<number>>;
}
export const loadMap = createAction<LoadMapAction>();
