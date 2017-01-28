// advanced-mapをON/OFFするlogic

import * as editActions from '../actions/edit';
import * as mapActions from '../actions/map';
import editStore from '../stores/edit';
import mapStore from '../stores/map';

export function setAdvanced(advanced: boolean): void{
    const map = mapStore.state;
    if (map.advanced === false && advanced === true){
        // OK
        mapActions.setAdvanced({
            advanced,
        });
    }else if (mapStore.state.advanced === true && advanced === false){
        // OFFにするとき壊れないように注意
        if (map.data.some(({size})=> size.x !== 180 || size.y !== 30)){
            // これはむり
            return;
        }
        // OK!
        mapActions.setAdvanced({
            advanced,
        });
    }
}
