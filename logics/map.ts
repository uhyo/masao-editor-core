// load new maps
import { CustomPartsData } from '../defs/map';
import * as mapActions from '../actions/map';
import * as customPartsActions from '../actions/custom-parts';
import * as historyActions from '../actions/history';

import mapStore, { MapState } from '../stores/map';

import { mapStringToChip, layerStringToChip, ChipCode } from '../scripts/chip';
import { countElements2 } from '../scripts/util/count-elements';

// マップを全部読みなおした
export function loadAdvancedMap(
  data: Array<{
    size: {
      x: number;
      y: number;
    };
    map?: Array<Array<string | number>>;
    layer?: Array<Array<string | number>>;
  }>,
  customParts: CustomPartsData,
): void {
  const l = data.length;
  for (let i = 0; i < l; i++) {
    // TODO 暫定的に4まで対応
    if (i >= 4) {
      break;
    }
    const { size, map, layer } = data[i];
    // メインレイヤーのデータを読み込み
    const map2: ChipCode[][] = [];
    for (let y = 0; y < size.y; y++) {
      const row: ChipCode[] = new Array(size.x);
      row.fill(0);
      if (map != null && map[y] != null) {
        for (const [x, c] of map[y].entries()) {
          if ('string' === typeof c) {
            // カスタムパーツ
            row[x] = c;
          } else if (0 <= c) {
            // 通常チップは0以上で整数に変換
            row[x] = c | 0;
          }
        }
      }
      map2.push(row);
    }

    const layer2: number[][] = [];
    for (let y = 0; y < size.y; y++) {
      const row: number[] = new Array(size.x);
      row.fill(0);
      if (layer != null && layer[y] != null) {
        for (const [x, c] of layer[y].entries()) {
          if ('number' === typeof c && 0 <= c && c < 256) {
            row[x] = c | 0;
          }
        }
      }
      layer2.push(row);
    }
    mapActions.loadMap({
      size,
      map: map2,
      layer: layer2,
      stage: i + 1,
    });
    // TODO: how do we provide names?
    customPartsActions.loadCustomParts({
      customParts,
    });
    historyActions.newHistory({
      stage: i + 1,
      stageData: {
        size,
        map: map2,
        layer: layer2,
      },
    });
  }
}

// paramの変更をmapに適用
export function loadParamMap(params: Record<string, string>): void {
  if (mapStore.state.advanced) {
    return;
  }
  mapStore.state.data.forEach((_, i) => {
    const size = {
      x: 180,
      y: 30,
    };
    const map = zerofill2(size.x, size.y);
    const layer = zerofill2(size.x, size.y);

    const ssfx = ['', '-s', '-t', '-f'][i];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 30; j++) {
        let p = params[`map${i}-${j}${ssfx}`];
        if (p != null) {
          for (let k = 0; k < 60; k++) {
            map[j][i * 60 + k] = mapStringToChip(p.charAt(k));
          }
        }
        p = params[`layer${i}-${j}${ssfx}`];
        if (p != null) {
          for (let k = 0; k < 60; k++) {
            layer[j][i * 60 + k] = layerStringToChip(p.slice(k * 2, k * 2 + 2));
          }
        }
      }
    }
    mapActions.loadMap({
      stage: i + 1,
      size,
      map,
      layer,
    });
    historyActions.newHistory({
      stage: i + 1,
      stageData: {
        size,
        map,
        layer,
      },
    });
  });
}

function zerofill2(x: number, y: number): Array<Array<number>> {
  const result = [];
  for (let i = 0; i < y; i++) {
    result.push(new Array(x).fill(0));
  }
  return result;
}

/**
 * Count all occurences of given chip in the map.
 */
export function countChipInMap(map: MapState, chip: ChipCode): number {
  return map.data
    .map(stage => countElements2(stage.map, chip))
    .reduce((a, b) => a + b, 0);
}
