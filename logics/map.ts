// load new maps
import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';

import mapStore from '../stores/map';

import {
    mapStringToChip,
    layerStringToChip,
} from '../scripts/chip';

// マップを全部読みなおした
export function loadAdvancedMap(data: Array<{
    size: {
        x: number;
        y: number;
    };
    map?: Array<Array<string | number>>;
    layer?: Array<Array<string | number>>;
}>): void{
    const l = data.length;
    for (let i = 0; i < l; i++){
        // 暫定的に4まで対応
        if (i >= 4){
            break;
        }
        const {
            size,
            map,
            layer,
        } = data[i];
        // TODO
        const map2 = map != null ? map.map(row=> row.map(c=>{
            if ('number' === typeof c && 0 <= c){
                return c|0;
            }else{
                return 0;
            }
        })) : zerofill2(size.x, size.y);
        const layer2 = layer != null ? layer.map(row=> row.map(c=>{
            if ('number' === typeof c && 0 <= c && c < 256){
                return c|0;
            }else{
                return 0;
            }
        })) : zerofill2(size.x, size.y);
        mapActions.loadMap({
            size,
            map: map2,
            layer: layer2,
            stage: i+1,
        });
        historyActions.newHistory({
            stage: i+1,
            stageData: {
                size,
                map: map2,
                layer: layer2,
            },
        });
    }
}

// paramの変更をmapに適用
export function loadParamMap(params: Record<string, string>): void{
    if (mapStore.state.advanced){
        return;
    }
    mapStore.state.data.forEach((_, i)=>{
        const size = {
            x: 180,
            y: 30,
        };
        const map = zerofill2(size.x, size.y);
        const layer = zerofill2(size.x, size.y);

        const ssfx = ['', '-s', '-t', '-f'][i];
        for (let i = 0; i < 3; i++) {
            for(let j = 0; j < 30; j++){
                let p = params[`map${i}-${j}${ssfx}`];
                if(p != null){
                    for(let k = 0; k < 60; k++){
                        map[j][i*60+k] = mapStringToChip(p.charAt(k));
                    }
                }
                p = params[`layer${i}-${j}${ssfx}`];
                if(p != null){
                    for(let k=0; k < 60; k++){
                        layer[j][i*60+k] = layerStringToChip(p.slice(k*2,k*2+2));
                    }
                }
            }
        }
        mapActions.loadMap({
            stage: i+1,
            size,
            map,
            layer,
        });
        historyActions.newHistory({
            stage: i+1,
            stageData: {
                size,
                map,
                layer,
            },
        });
    });
}

function zerofill2(x: number, y: number): Array<Array<number>>{
    const result = [];
    for (let i = 0; i < y; i++){
        result.push(new Array(x).fill(0));
    }
    return result;
}
