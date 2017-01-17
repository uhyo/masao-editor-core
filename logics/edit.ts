// logic
import * as editActions from '../actions/edit';
import * as mapActions from '../actions/map';
import editStore from '../stores/edit';
import mapStore from '../stores/map';

// マップサイズが変更になった場合にeditをうまく調整する
export function changeMapSize(width: number, height: number): void{
    const {
        scroll_x,
        scroll_y,
        view_width,
        view_height,
    } = editStore.state;
    const scroll_x2 = Math.max(0, Math.min(scroll_x, width - view_width));
    const scroll_y2 = Math.max(0, Math.min(scroll_y, height - view_height));

    editActions.scroll({
        x: scroll_x2,
        y: scroll_y2,
    });
}

interface ResizeData{
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export function resizeMapData(stage: number, resize: ResizeData): void{
    // 新しいマップサイズを計算
    const data = mapStore.state.data[stage];
    const newwidth = data.size.x + resize.left + resize.right;
    const newheight = data.size.y + resize.top + resize.bottom;

    if (newwidth < 16 || newheight < 10){
        // サポート外の数値にはできない
        return;
    }
    mapActions.resizeMap({
        stage,
        ...resize,
    });
    if (stage+1 === editStore.state.stage){
        changeMapSize(newwidth, newheight);
    }
}
