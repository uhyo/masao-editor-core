// history logic
import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';

import historyStore from '../stores/history';

export function back(stage: number): void{
    historyActions.back({
        stage,
    });
    // 最新のやつを反映
    mapActions.loadMap({
        stage,
        ... historyStore.state.data[stage-1].current,
    });
}

export function forward(stage: number): void{
    historyActions.forward({
        stage,
    });
    mapActions.loadMap({
        stage,
        ... historyStore.state.data[stage-1].current,
    });
}
