// Game objectに関するlogic
import * as masao from '../scripts/masao';
import { chipToMapString, chipToLayerString } from '../scripts/chip';

export type MasaoJSONFormat = masao.format.MasaoJSONFormat;

import mapStore, { MapState, Chip } from '../stores/map';
import projectStore from '../stores/project';
import paramsStore from '../stores/params';

/**
 * Option bag to `getCurrentGame`.
 */
export interface GetCurrentGameOption {
  /**
   * A temporal position of masao.
   */
  masaoPosition?: {
    x: number;
    y: number;
  };
}
/**
 * Generate an object of current game.
 */
export function getCurrentGame(
  options: GetCurrentGameOption = {},
): MasaoJSONFormat {
  const map = mapStore.state;
  const project = projectStore.state;
  const params = paramsStore.state;

  const { params: mp, advancedMap } = mapToParam(map, options.masaoPosition);

  const version = project.version;
  const allParams = masao.param.sanitize({
    ...params,
    ...mp,
  });

  const obj = masao.format.make({
    params: allParams,
    version,
    script: project.script || void 0,
    'advanced-map': advancedMap,
  });
  console.log('MADE', obj);
  return obj;
}

type AdvancedMap = masao.format.AdvancedMap;
type StageObject = masao.format.StageObject;
type LayerObject = masao.format.LayerObject;
/**
 * Convert the map to params.
 */
function mapToParam(
  map: MapState,
  masaoPosition?: { x: number; y: number },
): {
  params: Record<string, string>;
  advancedMap: AdvancedMap | undefined;
} {
  if (map.advanced) {
    // advancedなmapを発行
    const stages: Array<StageObject> = [];
    for (let i = 0; i < map.stages; i++) {
      const st = map.data[i];
      const layers: Array<LayerObject> = [
        {
          type: 'main',
          map: setMasaoPosition(st.map, masaoPosition),
        },
        {
          type: 'mapchip',
          map: st.layer,
        },
      ];
      const obj: StageObject = {
        size: st.size,
        layers,
      };
      stages.push(obj);
    }
    return {
      params: {},
      advancedMap: {
        stages,
      },
    };
  } else {
    // 昔のmap形式
    const params: Record<string, string> = {};
    for (let stage = 0; stage < 4; stage++) {
      let stagechar = '';
      if (stage === 1) {
        stagechar = '-s';
      } else if (stage === 2) {
        stagechar = '-t';
      } else if (stage === 3) {
        stagechar = '-f';
      }
      const m = setMasaoPosition(map.data[stage].map, masaoPosition);
      for (let y = 0; y < 30; y++) {
        const j = m[y].map(chipToMapString).join('');
        params[`map0-${y}${stagechar}`] = j.slice(0, 60);
        params[`map1-${y}${stagechar}`] = j.slice(60, 120);
        params[`map2-${y}${stagechar}`] = j.slice(120, 180);
        const k = map.data[stage].layer[y].map(chipToLayerString).join('');
        params[`layer0-${y}${stagechar}`] = k.slice(0, 120);
        params[`layer1-${y}${stagechar}`] = k.slice(120, 240);
        params[`layer2-${y}${stagechar}`] = k.slice(240, 360);
      }
    }
    return {
      params,
      advancedMap: void 0,
    };
  }
}

/**
 * Set masao position to specified point.
 */
function setMasaoPosition(
  map: Array<Array<Chip>>,
  masaoPosition?: { x: number; y: number },
): Array<Array<Chip>> {
  if (masaoPosition == null) {
    return map;
  }
  // 正男をサーチして新しいのを返す
  return map.map((row, y) => {
    // 正男を消す
    // TODO 正男の表現はこれだけ?
    if (row.includes(0x41)) {
      row = row.map(c => (c === 0x41 ? 0 : c));
    }
    if (y === masaoPosition.y) {
      // ここだ!!!!!
      row = row.map((c, x) => (x === masaoPosition.x ? 0x41 : c));
    }
    return row;
  });
}
