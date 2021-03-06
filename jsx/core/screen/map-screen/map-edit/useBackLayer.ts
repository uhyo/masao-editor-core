import { useMemo, useEffect } from 'react';
import MapUpdator from './updator';
import BackLayer, { DrawCallback } from './backlayer';
import { chipPollution } from './chip-pollution';
import {
  ParamsState,
  CustomPartsState,
  StageData,
  LastUpdateData,
  EditState,
} from '../../../../../stores';
import { ChipCode } from '../../../../../scripts/chip';
import { useTimers } from '../../../../../scripts/timers';
import { useUpdateSignal } from '../../../../../scripts/useUpdateSignal';
import { IntoImages } from '../../../../components/load-images';
import { Images } from '../../../../../defs/images';
import { drawMapChip, drawLayerChip } from './draw-chip';
import { useRefMemo } from '../../../../../scripts/useRefMemo';
import { resetLastUpdate } from '../../../../../actions/map';

/**
 * Returns a pair of updator and backlayer.
 */
export function useBackLayer(
  images: IntoImages<Images> | null,
  stage: StageData,
  edit: EditState,
  params: ParamsState,
  customParts: CustomPartsState,
  lastUpdate: LastUpdateData,
) {
  const timers = useTimers();
  /**
   * Store some objects for use by callbacks.
   */
  const savedStates = useRefMemo(
    () => (
      console.log('memo'),
      {
        stage,
        images,
        params,
        customParts,
      }
    ),
    [stage, images, params, customParts],
  );
  const result = useMemo(() => {
    const chipPollutionMap = (c: ChipCode) =>
      chipPollution('map', c, params, customParts);
    const chipPollutionLayer = (c: number) =>
      chipPollution('layer', c, params, customParts);

    const drawMapChipCallback: DrawCallback = (ctx, x, y) => {
      const { stage, images, params, customParts } = savedStates.current;
      const c = stage.map[y][x];
      drawMapChip(ctx, x, y, c, images, params, customParts);
    };
    const drawLayerChipCallback: DrawCallback = (ctx, x, y) => {
      const { stage, images } = savedStates.current;
      const c = stage.layer[y][x] || 0;
      drawLayerChip(ctx, x, y, c, images);
    };
    const mapUpdator = new MapUpdator(
      stage.size.x,
      stage.size.y,
      chipPollutionMap,
    );
    const mapBacklayer = new BackLayer(
      stage.size.x,
      stage.size.y,
      32,
      mapUpdator,
      drawMapChipCallback,
    );
    const layerUpdator = new MapUpdator(
      stage.size.x,
      stage.size.y,
      chipPollutionLayer,
    );
    const layerBacklayer = new BackLayer(
      stage.size.x,
      stage.size.y,
      32,
      layerUpdator,
      drawLayerChipCallback,
    );
    mapBacklayer.clear();
    layerBacklayer.clear();
    return {
      mapUpdator,
      mapBacklayer,
      layerUpdator,
      layerBacklayer,
    };
  }, []);

  // query for restting updator.
  const updatorResetSignal = useUpdateSignal<[number, LastUpdateData]>(
    ([prevStage, _], [stage, lastUpdate]) => {
      // mapが刷新された場合
      // 違うステージに移動した場合
      return prevStage !== stage || isAllUpdate(lastUpdate);
    },
    [edit.stage, lastUpdate],
  );
  // query for resetting backlayer.
  // TODO use `as const`
  const backLayerResetSignal = useUpdateSignal<
    [number, LastUpdateData, IntoImages<Images> | null]
  >(
    ([prevStage, _, prevImages], [stage, lastUpdate, images]) => {
      // mapが刷新された場合（lastUpdateがall）
      // 違うステージに移動した場合
      // 画像セットが更新された場合
      return (
        prevStage !== stage || isAllUpdate(lastUpdate) || prevImages !== images
      );
    },
    [edit.stage, lastUpdate, images],
  );
  // reset updator when whole rerendering of map occured.
  useEffect(() => {
    result.mapUpdator.resize(stage.size.x, stage.size.y);
    result.mapUpdator.resetMap(stage.map);
    result.layerUpdator.resize(stage.size.x, stage.size.y);
    result.layerUpdator.resetMap(stage.layer);
  }, [updatorResetSignal]);
  // reset backlayer when whole update of map is needed.
  useEffect(() => {
    const { x, y } = stage.size;
    // reset backlayer.
    result.mapBacklayer.resize(x, y);
    result.layerBacklayer.resize(x, y);
    // set up expansion of backlayer.
    const expandMap = () => {
      timers.addTimer('expand-map', 1000, () => {
        const flag = result.mapBacklayer.expand();
        if (flag) {
          expandMap();
        } else {
          expandLayer();
        }
      });
    };
    const expandLayer = () => {
      timers.addTimer('expand-map', 1000, () => {
        const flag = result.layerBacklayer.expand();
        if (flag) {
          expandLayer();
        }
      });
    };
    expandMap();
    return () => timers.clearTimer('expand-map');
  }, [backLayerResetSignal]);
  // update backLayer according to lastUpdate
  useEffect(() => {
    // case type === 'all' is handled separately
    for (const luData of lastUpdate) {
      if (luData.type === 'map' || luData.type === 'layer') {
        const { stage: updatedStage, x, y, width, height } = luData;
        if (updatedStage !== edit.stage) {
          // it's on another stage.
          return;
        }
        if (luData.type === 'map') {
          const points = result.mapUpdator.update(
            x,
            y,
            width,
            height,
            stage.map,
          );
          result.mapBacklayer.update(points);
        } else {
          const points = result.layerUpdator.update(
            x,
            y,
            width,
            height,
            stage.layer,
          );
          result.layerBacklayer.update(points);
        }
      }
    }
    resetLastUpdate();
  }, [lastUpdate]);
  return result;
}

export type BackLayers = ReturnType<typeof useBackLayer>;

/**
 * Returns whether lastUpdate includes 'all'.
 */
function isAllUpdate(lastUpdate: LastUpdateData): boolean {
  return lastUpdate.some(obj => obj.type === 'all');
}
