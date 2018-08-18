/*
 * Generation of game object.
 */
import * as masao from '../../scripts/masao';
import {
  chipToMapString,
  chipToLayerString,
  ChipCode,
} from '../../scripts/chip';

type MasaoJSONFormat = masao.format.MasaoJSONFormat;

import mapStore, { MapState } from '../../stores/map';
import customPartsStore, { CustomPartsState } from '../../stores/custom-parts';
import projectStore from '../../stores/project';
import paramsStore from '../../stores/params';

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
  /**
   * Name of field of extensional data.
   */
  extField?: string;
}
/**
 * Generate an object of current game.
 */
export function getCurrentGame(
  options: GetCurrentGameOption = {},
): MasaoJSONFormat {
  const extField =
    options.extField != null ? options.extField : masao.extFieldDefault;
  const map = mapStore.state;
  const customParts = customPartsStore.state;
  const project = projectStore.state;
  const params = paramsStore.state;

  const { params: mp, advancedMap, ext } = mapToParam(
    map,
    customParts,
    options.masaoPosition,
  );

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
  // add extensions.
  if (ext != null) {
    (obj as any)[extField] = ext;
  }
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
  customParts: CustomPartsState,
  masaoPosition?: { x: number; y: number },
): {
  params: Record<string, string>;
  advancedMap: AdvancedMap | undefined;
  ext?: masao.MJSExtFields;
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
    const { customParts: cp, ext } = generateCustomPartsData(customParts);
    return {
      params: {},
      advancedMap: {
        stages,
        customParts: cp,
      },
      ext,
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
        const j = m[y].map(chipcodeToMapString).join('');
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
 * generate custom parts definition data.
 */
function generateCustomPartsData(
  customParts: CustomPartsState,
): {
  customParts: AdvancedMap['customParts'];
  ext: masao.MJSExtFields['customParts'];
} {
  const result: AdvancedMap['customParts'] = {};
  const ext: Record<string, { name: string }> = {};
  for (const key in customParts.customParts) {
    const cpo = customParts.customParts[key];
    if (cpo == null) {
      continue;
    }
    result[key] = {
      extends: cpo.extends,
      properties: cpo.properties,
    };
    ext[key] = {
      name: cpo.name,
    };
  }
  // return undefined if empty.
  const finalResult = Object.keys(result).length === 0 ? undefined : result;
  return {
    customParts: finalResult,
    ext,
  };
}

/**
 * Convert chip to legacy map string, converting custom chip to zero.
 */
function chipcodeToMapString(chip: ChipCode): string {
  if ('number' === typeof chip) {
    return chipToMapString(chip);
  } else {
    return chipToMapString(0);
  }
}

/**
 * Set masao position to specified point.
 */
function setMasaoPosition(
  map: Array<Array<ChipCode>>,
  masaoPosition?: { x: number; y: number },
): Array<Array<ChipCode>> {
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
