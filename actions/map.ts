import {
    createAction,
} from '../scripts/reflux-util';

//map.updateMap({
//  stage: number,
//  x: number,
//  y: number,
//  chip: string
//});
//map.updateLayer({
//  stage: number,
//  x: number,
//  y: number,
//  chip: strinp
//});

export interface UpdateMapAction{
    stage: number;
    x: number;
    y: number;
    chip: string;
}
export const updateMap = createAction<UpdateMapAction>();
export const updateLayer = createAction<UpdateMapAction>();
