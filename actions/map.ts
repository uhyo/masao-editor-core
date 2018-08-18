import { CustomPartsData } from '../defs/map';
import { Action, createAction } from '../scripts/reflux-util';
import { ChipCode } from '../scripts/chip';

export { Action };

export interface UpdateMapAction<C> {
  // 1 -- 4
  stage: number;
  x: number;
  y: number;
  chip: C;
}
export const updateMap = createAction<UpdateMapAction<ChipCode>>();
export const updateLayer = createAction<UpdateMapAction<number>>();

/**
 * 矩形でマップを更新するアクション
 */
export interface UpdateMapRectAction<C> {
  // 1 -- 4
  stage: number;
  // 開始位置
  left: number;
  top: number;
  right: number;
  bottom: number;
  chip: C;
}
export const updateMapRect = createAction<UpdateMapRectAction<ChipCode>>();
export const updateLayerRect = createAction<UpdateMapRectAction<number>>();

/**
 * 塗りつぶし
 */
export interface UpdateMapFillAction<C> {
  stage: number;
  x: number;
  y: number;
  chip: C;
}
export const updateMapFill = createAction<UpdateMapFillAction<ChipCode>>();
export const updateLayerFill = createAction<UpdateMapFillAction<number>>();

export interface SetAdvancedAction {
  advanced: boolean;
}
export const setAdvanced = createAction<SetAdvancedAction>();

export interface ResizeMapAction {
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
export interface LoadMapAction {
  // 1 -- 4
  stage: number;
  size: {
    x: number;
    y: number;
  };
  map: Array<Array<ChipCode>>;
  layer: Array<Array<number>>;
}
export const loadMap = createAction<LoadMapAction>();

/**
 * custom partsの定義を読み込んだ
 */
export interface LoadCustomPartsAction {
  customParts: CustomPartsData;
}

/**
 * Action of loading custom parts definitions.
 */
export const loadCustomParts = createAction<LoadCustomPartsAction>();
