import { ChipCode, chipRenderRect } from '../../../../../scripts/chip';
import { Rect } from '../../../../../scripts/rect';
import { ParamsState, CustomPartsState } from '../../../../../stores';

/**
 * Return the range of pollution of given chip.
 */
export function chipPollution<K extends 'map' | 'layer'>(
  type: K,
  c: K extends 'map' ? ChipCode : number,
  params: ParamsState,
  customParts: CustomPartsState,
): Rect {
  if (type === 'layer') {
    // layerのチップは全部普通
    return {
      minX: 0,
      minY: 0,
      maxX: 1,
      maxY: 1,
    };
  }
  // mapの場合は広い範囲に描画されるかも
  const renderRect = chipRenderRect(params, customParts.customParts, c);

  // タイル単位に変換
  const updateRect = {
    minX: Math.floor(renderRect.minX / 32),
    minY: Math.floor(renderRect.minY / 32),
    maxX: Math.ceil(renderRect.maxX / 32),
    maxY: Math.ceil(renderRect.maxY / 32),
  };
  return updateRect;
}
