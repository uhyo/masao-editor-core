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
