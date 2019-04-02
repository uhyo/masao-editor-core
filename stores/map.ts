//map store
import { Store } from '../scripts/reflux-util';
import { ChipCode } from '../scripts/chip';

import { CustomPartsData } from '../defs/map';
import * as mapActions from '../actions/map';

export interface MapState {
  /**
   * advancedステージデータを使用するか
   */
  advanced: boolean;
  /**
   * ステージ数
   */
  stages: number;
  /**
   * 各ステージのデータ
   */
  data: Array<StageData>;
  /**
   * マップに対する最終更新のデータ
   */
  lastUpdate: LastUpdateData;
  /**
   * カスタムパーツの一覧
   */
  customParts: CustomPartsData;
}
export interface StageData {
  size: {
    x: number;
    y: number;
  };
  map: Array<Array<ChipCode>>;
  layer: Array<Array<number>>;
}

export type LastUpdateData =
  | {
      type: 'all';
      size: boolean;
    }
  | {
      type: 'map';
      x: number;
      y: number;
      width: number;
      height: number;
      stage: number;
    }
  | {
      type: 'layer';
      x: number;
      y: number;
      width: number;
      height: number;
      stage: number;
    };

export class MapStore extends Store<MapState> {
  constructor() {
    super();
    this.listenables = [mapActions];
    // TODO
    const data = [0, 1, 2, 3].map(() => this.initStage());
    this.state = {
      advanced: false,
      stages: 4,
      data,
      lastUpdate: {
        type: 'all',
        size: true,
      },
      customParts: {},
    };
  }
  private initStage(): StageData {
    const width = 180;
    const height = 30;
    const map = [];
    const layer = [];
    // TODO
    for (let i = 0; i < height; i++) {
      const r2m = [];
      const r2l = [];
      for (let j = 0; j < width; j++) {
        r2m.push(0);
        r2l.push(0);
      }
      map.push(r2m);
      layer.push(r2l);
    }
    return {
      size: {
        x: width,
        y: height,
      },
      map,
      layer,
    };
  }
  public onSetAdvanced({ advanced }: mapActions.SetAdvancedAction) {
    if (this.state.advanced === true && advanced === false) {
      // マップから変なのを消す
      const data = this.state.data.map(({ size, map, layer }) => ({
        size,
        map: map.map(row => row.map(c => (isUnAdvancedChip(c) ? c : 0))),
        layer,
      }));
      this.setState({
        advanced,
        data,
      });
    } else {
      this.setState({
        advanced,
      });
    }
  }
  public onUpdateMap({
    stage,
    x,
    y,
    chip,
  }: mapActions.UpdateMapAction<ChipCode>) {
    const { data } = this.state;
    const st = this.state.data[stage - 1].map;
    if (st) {
      const row = st[y];
      if (row) {
        if (row[x] === chip) {
          //変わっていない
          return;
        }
        const d = data.map((st, i) => {
          if (i === stage - 1) {
            const map = st.map.map((a, i) => {
              if (i === y) {
                return a.map((c, i) => {
                  if (i === x) {
                    return chip;
                  } else {
                    return c;
                  }
                });
              } else {
                return a;
              }
            });
            return {
              ...st,
              map,
            };
          } else {
            return st;
          }
        });
        this.setState({
          data: d,
          lastUpdate: {
            type: 'map',
            stage,
            x,
            y,
            width: 1,
            height: 1,
          },
        });
      }
    }
  }
  public onUpdateLayer({
    stage,
    x,
    y,
    chip,
  }: mapActions.UpdateMapAction<number>) {
    const { data } = this.state;
    const st = data[stage - 1].layer;
    if (st) {
      const row = st[y];
      if (row) {
        if (row[x] === chip) {
          //変わっていない
          return;
        }
        const d = data.map((st, i) => {
          if (i === stage - 1) {
            const l = st.layer.map((a, i) => {
              if (i === y) {
                return a.map((c, i) => {
                  if (i === x) {
                    return chip;
                  } else {
                    return c;
                  }
                });
              } else {
                return a;
              }
            });
            return {
              ...st,
              layer: l,
            };
          } else {
            return st;
          }
        });
        this.setState({
          data: d,
          lastUpdate: {
            type: 'layer',
            stage,
            x,
            y,
            width: 1,
            height: 1,
          },
        });
      }
    }
  }
  public onUpdateMapRect({
    stage,
    left,
    top,
    right,
    bottom,
    chip,
  }: mapActions.UpdateMapRectAction<ChipCode>): void {
    const { data } = this.state;
    const st = this.state.data[stage - 1].map;
    if (st) {
      const d = data.map((st, i) => {
        if (i === stage - 1) {
          const map = st.map.map((row, y) => {
            if (top <= y && y <= bottom) {
              const row2 = new Array(st.size.x);
              let x = 0;
              for (; x < left; x++) {
                row2[x] = row[x];
              }
              for (; x <= right; x++) {
                row2[x] = chip;
              }
              for (; x < st.size.x; x++) {
                row2[x] = row[x];
              }
              return row2;
            } else {
              return row;
            }
          });
          return {
            ...st,
            map,
          };
        } else {
          return st;
        }
      });
      this.setState({
        data: d,
        lastUpdate: {
          type: 'map',
          stage,
          x: left,
          y: top,
          width: right - left + 1,
          height: bottom - top + 1,
        },
      });
    }
  }
  public onUpdateLayerRect({
    stage,
    left,
    top,
    right,
    bottom,
    chip,
  }: mapActions.UpdateMapRectAction<number>): void {
    const { data } = this.state;
    const st = this.state.data[stage - 1].map;
    if (st) {
      const d = data.map((st, i) => {
        if (i === stage - 1) {
          const layer = st.layer.map((row, y) => {
            if (top <= y && y <= bottom) {
              const row2 = new Array(st.size.x);
              let x = 0;
              for (; x < left; x++) {
                row2[x] = row[x];
              }
              for (; x <= right; x++) {
                row2[x] = chip;
              }
              for (; x < st.size.x; x++) {
                row2[x] = row[x];
              }
              return row2;
            } else {
              return row;
            }
          });
          return {
            ...st,
            layer,
          };
        } else {
          return st;
        }
      });
      this.setState({
        data: d,
        lastUpdate: {
          type: 'layer',
          stage,
          x: left,
          y: top,
          width: right - left + 1,
          height: bottom - top + 1,
        },
      });
    }
  }
  public onUpdateMapFill({
    stage,
    x,
    y,
    chip,
  }: mapActions.UpdateMapFillAction<ChipCode>) {
    const { size, map } = this.state.data[stage - 1];
    if (chip === map[y][x]) {
      return;
    }
    const { map: map2, left, right, top, bottom } = fillMap(
      x,
      y,
      chip,
      map,
      size.x,
      size.y,
    );
    const data = this.state.data.map((st, i) => {
      if (i !== stage - 1) {
        return st;
      } else {
        return {
          ...st,
          map: map2,
        };
      }
    });
    this.setState({
      data,
      lastUpdate: {
        type: 'map',
        stage,
        x: left,
        y: top,
        width: right - left + 1,
        height: bottom - top + 1,
      },
    });
  }
  public onUpdateLayerFill({
    stage,
    x,
    y,
    chip,
  }: mapActions.UpdateMapFillAction<number>) {
    const { size, layer } = this.state.data[stage - 1];
    if (chip === layer[y][x]) {
      return;
    }
    const { map: layer2, left, right, top, bottom } = fillMap(
      x,
      y,
      chip,
      layer,
      size.x,
      size.y,
    );
    const data = this.state.data.map((st, i) => {
      if (i !== stage - 1) {
        return st;
      } else {
        return {
          ...st,
          layer: layer2,
        };
      }
    });
    this.setState({
      data,
      lastUpdate: {
        type: 'layer',
        stage,
        x: left,
        y: top,
        width: right - left + 1,
        height: bottom - top + 1,
      },
    });
  }
  public onWriteFloatingToMap({
    stage,
    map,
    floating,
  }: mapActions.WriteFloatingToMapAction) {
    if (stage <= 0 || this.state.stages < stage) {
      return;
    }
    const allowAdvancedChip = map === 'map' && this.state.advanced;
    const data = this.state.data.map((st, i) => {
      if (i !== stage - 1) {
        return st;
      }
      const newMap = (st[map] as ChipCode[][]).map((row, y) => {
        if (y < floating.y || floating.y + floating.height <= y) {
          return row;
        }
        const fy = y - floating.y;
        const frow = floating.data[fy];
        const newRow = new Array<ChipCode>(st.size.x);
        for (let x = 0; x < floating.x; x++) {
          newRow[x] = row[x];
        }
        for (let x = 0; x < floating.width; x++) {
          const chip = frow[x];
          if (!allowAdvancedChip && !isUnAdvancedChip(chip)) {
            newRow[floating.x + x] = 0;
          } else {
            newRow[floating.x + x] = frow[x];
          }
        }
        for (let x = floating.x + floating.width; x < st.size.x; x++) {
          newRow[x] = row[x];
        }
        return newRow;
      });
      return {
        ...st,
        [map]: newMap,
      };
    });
    this.setState({
      data,
      lastUpdate: {
        type: map,
        stage,
        x: floating.x,
        y: floating.y,
        width: floating.width,
        height: floating.height,
        // TypeScript can't infer that this is valid
      } as LastUpdateData,
    });
  }
  public onResizeMap({
    stage,
    left,
    top,
    right,
    bottom,
  }: mapActions.ResizeMapAction) {
    if (!this.state.advanced) {
      return;
    }
    if (stage <= 0 || this.state.stages < stage) {
      return;
    }
    const data = this.state.data.map((st, i) => {
      if (i !== stage - 1) {
        return st;
      }
      // サイズを変更
      const size = {
        x: st.size.x + left + right,
        y: st.size.y + top + bottom,
      };
      const map: Array<Array<ChipCode>> = [];
      const layer: Array<Array<number>> = [];
      for (let y = 0; y < size.y; y++) {
        const y2 = y - top;
        const rowm: Array<ChipCode> = new Array(size.x);
        const rowl: Array<number> = new Array(size.x);
        if (y2 < 0 || st.size.y <= y2) {
          // データが存在しない領域
          rowm.fill(0);
          rowl.fill(0);
        } else {
          const drm = st.map[y2];
          const drl = st.layer[y2];
          for (let x = 0; x < size.x; x++) {
            const x2 = x - left;
            if (x2 < 0 || st.size.x <= x2) {
              rowm[x] = 0;
              rowl[x] = 0;
            } else {
              rowm[x] = drm[x2];
              rowl[x] = drl[x2];
            }
          }
        }
        map.push(rowm);
        layer.push(rowl);
      }
      return {
        size,
        map,
        layer,
      };
    });
    this.setState({
      data,
      lastUpdate: {
        type: 'all',
        size: true,
      },
    });
  }
  // マップをそのまま受け入れる
  public onLoadMap({ stage, size, map, layer }: mapActions.LoadMapAction) {
    if (stage <= 0 || this.state.stages < stage) {
      return;
    }
    const data = this.state.data.map((st, i) => {
      if (i !== stage - 1) {
        return st;
      }
      return {
        size,
        map,
        layer,
      };
    });
    this.setState({
      data,
      lastUpdate: {
        type: 'all',
        size: true,
      },
    });
  }
}

/**
 * Returns whether given chip is not an advanced chip.
 */
function isUnAdvancedChip(c: ChipCode) {
  return 'number' === typeof c && 0 <= c && c < 256;
}

// 塗りつぶし
function fillMap<C>(
  x: number,
  y: number,
  chip: C,
  map: Array<Array<C>>,
  width: number,
  height: number,
) {
  // これと同じのは塗りつぶす
  const f = map[y][x];
  if (f === chip) {
    return {
      map,
      left: x,
      top: y,
      right: x,
      bottom: y,
    };
  }
  // いわゆるscanline algorithm

  // まずはshallow copy
  const newmap = [...map];
  newmap[y] = [...newmap[y]];
  // mapに変更が加わった範囲
  let ctop = y;
  let cbottom = y;
  let cleft = x;
  let cright = x;

  const stack: Array<{
    left: number;
    right: number;
    y: number;
  }> = [];
  stack.push({
    left: scanLeft(x, y),
    right: scanRight(x, y),
    y,
  });

  while (stack.length > 0) {
    const { left, right, y } = stack.shift()!;

    updateLine(left, right, y);
    // 上下を探索
    if (0 < y) {
      searchLine(left, right, y - 1);
    }
    if (y < height - 1) {
      searchLine(left, right, y + 1);
    }
  }
  // 変更が加わった範囲をアレする
  return {
    map: newmap,
    left: cleft,
    top: ctop,
    right: cright,
    bottom: cbottom,
  };

  function updateLine(left: number, right: number, y: number) {
    if (left < cleft) {
      cleft = left;
    }
    if (right > cright) {
      cright = right;
    }
    if (y < ctop) {
      ctop = y;
      newmap[y] = [...newmap[y]];
    } else if (y > cbottom) {
      cbottom = y;
      newmap[y] = [...newmap[y]];
    }
    for (let x = left; x <= right; x++) {
      newmap[y][x] = chip;
    }
  }

  function searchLine(left: number, right: number, y: number) {
    let l = null;
    for (let x = left; x <= right; x++) {
      const c = newmap[y][x];
      if (c === f && l == null) {
        if (x === left) {
          l = scanLeft(x, y);
        } else {
          l = x;
        }
      } else if (c !== f && l != null) {
        let r = x - 1;
        stack.push({
          left: l,
          right: r,
          y,
        });
        l = null;
      }
    }
    if (l != null) {
      const r = scanRight(right, y);
      stack.push({
        left: l,
        right: r,
        y: y,
      });
    }
  }

  function scanLeft(x: number, y: number): number {
    let result = x;
    while (0 < result && newmap[y][result - 1] === f) {
      result--;
    }
    return result;
  }
  function scanRight(x: number, y: number): number {
    let result = x;
    while (result < width - 1 && newmap[y][result + 1] === f) {
      result++;
    }
    return result;
  }
}

export default new MapStore();
