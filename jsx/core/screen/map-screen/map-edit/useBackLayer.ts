import { useMemo, useEffect } from 'react';
import MapUpdator from './updator';
import BackLayer from './backlayer';
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

/**
 * Returns a pair of updator and backlayer.
 */
export function useBackLayer(
  stage: StageData,
  edit: EditState,
  params: ParamsState,
  customParts: CustomPartsState,
  lastUpdate: LastUpdateData,
  drawChipOn: (
    type: 'map' | 'layer',
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => void,
) {
  const timers = useTimers();
  const result = useMemo(() => {
    const chipPollutionMap = (c: ChipCode) =>
      chipPollution('map', c, params, customParts);
    const chipPollutionLayer = (c: number) =>
      chipPollution('layer', c, params, customParts);
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
      drawChipOn.bind(null, 'map'),
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
      drawChipOn.bind(null, 'layer'),
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
      return prevStage !== stage || lastUpdate.type === 'all';
    },
    [edit.stage, lastUpdate],
  );
  // query for resetting backlayer.
  // TODO use `as const`
  const backLayerResetSignal = useUpdateSignal<[number, LastUpdateData]>(
    ([prevStage, _], [stage, lastUpdate]) => {
      // mapが刷新された場合（lastUpdateがall）
      // 違うステージに移動した場合
      // TODO: imagesが変わった場合
      return prevStage !== stage || lastUpdate.type === 'all';
    },
    [edit.stage, lastUpdate],
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
    if (lastUpdate.type === 'map' || lastUpdate.type === 'layer') {
      const { stage: updatedStage, x, y, width, height } = lastUpdate;
      if (updatedStage !== edit.stage) {
        // it's on another stage.
        return;
      }
      if (lastUpdate.type === 'map') {
        const points = result.mapUpdator.update(x, y, width, height, stage.map);
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
  }, [lastUpdate]);
  return result;
}

export type BackLayers = ReturnType<typeof useBackLayer>;
