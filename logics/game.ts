// Game objectに関するlogic
import * as masao from '../scripts/masao';
import {
    chipToMapString,
    chipToLayerString,
} from '../scripts/chip';


export type MasaoJSONFormat = masao.format.MasaoJSONFormat;

import mapStore, {
    MapState,
} from '../stores/map';
import projectStore from '../stores/project';
import paramsStore from '../stores/params';

/**
 * Generate an object of current game.
 */
export function getCurrentGame(): MasaoJSONFormat {
    const map = mapStore.state;
    const project = projectStore.state;
    const params = paramsStore.state;

    const {
        params: mp,
        advancedMap,
    } = mapToParam(map);

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
function mapToParam(map: MapState): {
    params: Record<string, string>;
    advancedMap: AdvancedMap | undefined;
}{
    if (map.advanced){
        // advancedなmapを発行
        const stages: Array<StageObject> = [];
        for (let i=0; i < map.stages; i++){
            const st = map.data[i];
            const layers: Array<LayerObject> = [
                {
                    type: 'main',
                    map: st.map,
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
    }else{
        // 昔のmap形式
        const params: Record<string, string> = {};
        for(let stage=0; stage<4; stage++){
            let stagechar="";
            if(stage===1){
                stagechar="-s";
            }else if(stage===2){
                stagechar="-t";
            }else if(stage===3){
                stagechar="-f";
            }
            for(let y=0; y < 30; y++){
                const j = map.data[stage].map[y].map(chipToMapString).join("");
                params[`map0-${y}${stagechar}`]=j.slice(0,60);
                params[`map1-${y}${stagechar}`]=j.slice(60,120);
                params[`map2-${y}${stagechar}`]=j.slice(120,180);
                const k = map.data[stage].layer[y].map(chipToLayerString).join("");
                params[`layer0-${y}${stagechar}`]=k.slice(0,120);
                params[`layer1-${y}${stagechar}`]=k.slice(120,240);
                params[`layer2-${y}${stagechar}`]=k.slice(240,360);
            }
        }
        return {
            params,
            advancedMap: void 0,
        };
    }
}
