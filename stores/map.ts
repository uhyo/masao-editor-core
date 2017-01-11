//map store
import * as extend from 'extend';
import {
    Store,
} from '../scripts/reflux-util';
import {
    mapStringToChip,
    layerStringToChip,
} from '../scripts/chip';

import * as mapActions from '../actions/map';
import * as paramActions from '../actions/params';

export interface MapState{
    // advancedステージデータを使用するか
    advanced: boolean;
    // ステージ数
    stages: number;
    data: Array<StageData>;
    lastUpdate: LastUpdateData;
}
export interface StageData{
    size: {
        x: number;
        y: number;
    };
    map: Array<Array<number>>;
    layer: Array<Array<number>>;
}
export type LastUpdateData = {
    type: 'all';
} | {
    type: 'map';
    x: number;
    y: number;
    stage: number;
} | {
    type: 'layer';
    x: number;
    y: number;
    stage: number;
};

export class MapStore extends Store<MapState>{
    constructor(){
        super();
        this.listenables = [mapActions, {resetParams: paramActions.resetParams}];
        // TODO
        const data = [0, 1, 2, 3].map(()=> this.initStage());
        this.state = {
            advanced: false,
            stages: 4,
            data,
            lastUpdate: {
                type: 'all',
            },
        };
    }
    private initStage(): StageData{
        const width = 180;
        const height = 30;
        const map = [];
        const layer = [];
        // TODO
        for (let i=0; i < height; i++){
            const r2m = [];
            const r2l = [];
            for (let j=0; j < width; j++){
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
    private onSetAdvanced({advanced}: mapActions.SetAdvancedAction){
        this.setState({
            advanced,
        });
    }
    private onUpdateMap({stage,x,y,chip}: mapActions.UpdateMapAction){
        const {
            data,
        } = this.state;
        const st = this.state.data[stage-1].map;
        if(st){
            const row=st[y];
            if(row){
                if(row[x] === chip){
                    //変わっていない
                    return;
                }
                const d = data.map((st, i)=>{
                    if(i === stage-1){
                        const map = st.map.map((a,i)=>{
                            if(i===y){
                                return a.map((c,i)=>{
                                    if(i===x){
                                        return chip;
                                    }else{
                                        return c;
                                    }
                                });
                            }else{
                                return a;
                            }
                        });
                        return {
                            ...st,
                            map,
                        };
                    }else{
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
                    },
                });
            }
        }
    }
    private onUpdateLayer({stage,x,y,chip}: mapActions.UpdateMapAction){
        const {
            data,
        } = this.state;
        const st = data[stage-1].layer;
        if(st){
            const row = st[y];
            if(row){
                if(row[x] === chip){
                    //変わっていない
                    return;
                }
                const d = data.map((st,i)=>{
                    if(i===stage-1){
                        const l = st.layer.map((a,i)=>{
                            if(i===y){
                                return a.map((c,i)=>{
                                    if(i===x){
                                        return chip;
                                    }else{
                                        return c;
                                    }
                                });
                            }else{
                                return a;
                            }
                        });
                        return {
                            ...st,
                            layer: l,
                        };
                    }else{
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
                    },
                });
            }
        }
    }
    private onResetParams(params: Record<string, string>){
        //mapに対する変更があったら検知する
        if (this.state.advanced){
            // advanced時はparamから変更しない
            return;
        }
        const newData = [0, 1, 2, 3].map(this.initStage);
        let flag = false;
        // TODO
        for (let h = 0; h < 4; h++) {
            const ssfx = ['', '-s', '-t', '-f'][h];
            for (let i = 0; i < 3; i++) {
                for(let j=0; j < 30; j++){
                    let p = params[`map${i}-${j}${ssfx}`];
                    if(p != null){
                        flag = true;
                        for(let k=0; k < 60; k++){
                            newData[h].map[j][i*60+k] = mapStringToChip(p.charAt(k));
                        }
                    }
                    p = params[`layer${i}-${j}${ssfx}`];
                    if(p != null){
                        flag = true;
                        for(let k=0; k < 60; k++){
                            newData[h].layer[j][i*60+k] = layerStringToChip(p.slice(k*2,k*2+2));
                        }
                    }
                }
            }
        }
        if (flag === true){
            this.setState({
                advanced: false,
                data: newData,
                lastUpdate: {
                    type: 'all',
                },
            });
        }
    }
}


export default new MapStore();
