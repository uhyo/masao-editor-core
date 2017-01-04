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
    map: Array<Array<Array<number>>>;
    layer: Array<Array<Array<number>>>;
    lastUpdate: {
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
}
export class MapStore extends Store<MapState>{
    constructor(){
        super();
        this.listenables = [mapActions, {resetParams: paramActions.resetParams}];
        // TODO
        console.log('INIT MAP');
        const map = [0, 1, 2, 3].map(()=> this.initStage(0));
        const layer = [0, 1, 2, 3].map(()=> this.initStage(0));
        this.state = {
            map,
            layer,
            lastUpdate: {
                type: 'all',
            },
        };
    }
    private initStage<T>(initial: T): Array<Array<T>>{
        const result = [];
        // TODO
        for (let i=0; i < 30; i++){
            const r2 = [];
            for (let j=0; j < 180; j++){
                r2.push(initial);
            }
            result.push(r2);
        }
        return result;
    }
    private onUpdateMap({stage,x,y,chip}: mapActions.UpdateMapAction){
        const st=this.state.map[stage-1];
        if(st){
            const row=st[y];
            if(row){
                if(row[x] === chip){
                    //変わっていない
                    return;
                }
                const map = this.state.map.map((st, i)=>{
                    if(i === stage-1){
                        return st.map((a,i)=>{
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
                    }else{
                        return st;
                    }
                });
                this.setState({
                    map,
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
        const st = this.state.layer[stage-1];
        if(st){
            const row = st[y];
            if(row){
                if(row[x] === chip){
                    //変わっていない
                    return;
                }
                const layer = this.state.layer.map((st,i)=>{
                    if(i===stage-1){
                        return st.map((a,i)=>{
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
                    }else{
                        return st;
                    }
                });
                this.setState({
                    layer,
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
        const newMap = this.state.map.map((st)=>{
            return st.map((row)=>{
                return row.concat([]);
            });
        });
        const newLayer = this.state.layer.map((st)=>{
            return st.map((row)=>{
                return row.concat([]);
            });
        });
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
                            newMap[h][j][i*60+k] = mapStringToChip(p.charAt(k));
                        }
                    }
                    p = params[`layer${i}-${j}${ssfx}`];
                    if(p != null){
                        flag = true;
                        for(let k=0; k < 60; k++){
                            newLayer[h][j][i*60+k] = layerStringToChip(p.slice(k*2,k*2+2));
                        }
                    }
                }
            }
        }
        if (flag === true){
            this.setState({
                map: newMap,
                layer: newLayer,
                lastUpdate: {
                    type: 'all',
                },
            });
        }
    }
}


export default new MapStore();
