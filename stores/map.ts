//map store
import {
    Store,
} from '../scripts/reflux-util';
import {
    mapStringToChip,
    layerStringToChip,
} from '../scripts/chip';

import * as mapActions from '../actions/map';
import * as paramActions from '../actions/params';

// チップデータ （メイン用）
export type Chip = mapActions.Chip;

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
    map: Array<Array<Chip>>;
    layer: Array<Array<number>>;
}

export type LastUpdateData = {
    type: 'all';
    size: boolean;
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
        this.listenables = [mapActions];
        // TODO
        const data = [0, 1, 2, 3].map(()=> this.initStage());
        this.state = {
            advanced: false,
            stages: 4,
            data,
            lastUpdate: {
                type: 'all',
                size: true,
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
        if (this.state.advanced === true && advanced === false){
            // マップから変なのを消す
            const data = this.state.data.map(({size, map, layer})=>({
                size,
                map: map.map(row=> row.map(c=> 'number' === typeof c && 0 <= c && c < 256 ? c : 0)),
                layer,
            }));
            this.setState({
                advanced,
                data,
            });
        }else{
            this.setState({
                advanced,
            });
        }
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
    private onResizeMap({stage, left, top, right, bottom}: mapActions.ResizeMapAction){
        if (!this.state.advanced){
            return;
        }
        if (stage <= 0 || this.state.stages < stage){
            return;
        }
        const data = this.state.data.map((st, i)=>{
            if (i !== stage-1){
                return st;
            }
            // サイズを変更
            const size = {
                x: st.size.x + left + right,
                y: st.size.y + top + bottom,
            };
            const map: Array<Array<Chip>> = [];
            const layer: Array<Array<number>> = [];
            for (let y = 0; y < size.y; y++){
                const y2 = y - top;
                const rowm: Array<Chip> = new Array(size.x);
                const rowl: Array<number> = new Array(size.x);
                if (y2 < 0 || st.size.y <= y2){
                    // データが存在しない領域
                    rowm.fill(0);
                    rowl.fill(0);
                }else{
                    const drm = st.map[y2];
                    const drl = st.layer[y2];
                    for (let x = 0; x < size.x; x++){
                        const x2 = x - left;
                        if (x2 < 0 || st.size.x <= x2){
                            rowm[x] = 0;
                            rowl[x] = 0;
                        }else{
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
    private onLoadMap({stage, size, map, layer}: mapActions.LoadMapAction){
        if (stage <= 0 || this.state.stages < stage){
            return;
        }
        const data = this.state.data.map((st, i)=>{
            if (i !== stage-1){
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


export default new MapStore();
