// logic
import * as editActions from '../actions/edit';
import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';
import editStore, {
    Screen,
} from '../stores/edit';
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
    historyActions.addHistory({
        stage,
        stageData: mapStore.state.data[stage-1],
    });
    if (stage === editStore.state.stage){
        changeMapSize(newwidth, newheight);
    }
}

// マウスによるツールの設定
export function mouseDown(mode: editActions.Mode, x: number, y: number): editActions.ToolState | null{
    const edit = editStore.state;
    const {
        scroll_x,
        scroll_y,
        screen,
        stage,
    } = edit;
    let tool: editActions.ToolState | null = null;
    if (mode === 'pen'){
        tool =  {
            type: 'pen',
        };
    }else if (mode === 'eraser'){
        tool = {
            type: 'eraser',
        };
    }else if (mode === 'hand'){
        tool = {
            type: 'hand',
            mouse_sx: x,
            mouse_sy: y,
            scroll_sx: scroll_x,
            scroll_sy: scroll_y,
        };
    }else if(mode === 'spuit'){
        const rx = x + scroll_x;
        const ry = y + scroll_y;

        if (screen === 'layer'){
            const map = mapStore.state.data[stage-1].layer;
            const chip = map[ry] ? map[ry][rx] || 0 : 0;
            editActions.changePenLayer({
                pen: chip,
                mode: true,
            });
        }else{
            const map = mapStore.state.data[stage-1].map;
            const chip = map[ry] ? map[ry][rx] || 0 : 0;
            editActions.changePen({
                pen: chip,
                mode: true,
            });
        }
    }else if (mode === 'rect'){
        const rx = x + scroll_x;
        const ry = y + scroll_y;
        tool = {
            type: 'rect',
            start_x: rx,
            start_y: ry,
            end_x: rx,
            end_y: ry,
        };
    }
    editActions.setTool({
        tool,
    });
    return tool;
}

// ツールでマウスが動く
export function mouseMove(x: number, y: number, tool: editActions.ToolState | null = editStore.state.tool): void{
    if (tool == null){
        return;
    }
    const edit = editStore.state;
    const {
        screen,
        scroll_x,
        scroll_y,
        view_width,
        view_height,
    } = edit;
    const stage = mapStore.state.data[edit.stage-1];

    const mapdata = screen === 'layer' ? stage.layer : stage.map;
    const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

    if (tool.type === 'pen'){
        const cx = x + scroll_x;
        const cy = y + scroll_y;

        if (cx < 0 || cy < 0 || cx >= stage.size.x || cy >= stage.size.y){
            // ステージ外
            return;
        }

        if (mapdata[cy] && mapdata[cy][cx] !== pen){
            mapUpdateAction(screen)({
                stage: edit.stage,
                x: cx,
                y: cy,
                chip: pen,
            });
        }
    }else if (tool.type === 'eraser'){
        const cx = x + scroll_x;
        const cy = y + scroll_y;

        if (cx < 0 || cy < 0 || cx >= stage.size.x || cy >= stage.size.y){
            // ステージ外
            return;
        }

        if (mapdata[cy] && mapdata[cy][cx] !== 0){
            mapUpdateAction(screen)({
                stage: edit.stage,
                x: cx,
                y: cy,
                chip: 0,
            });
        }
    }else if (tool.type === 'hand'){
        // スクロール座標を計算
        let sx = tool.mouse_sx - x + tool.scroll_sx;
        let sy = tool.mouse_sy - y + tool.scroll_sy;

        if (sx < 0){
            sx = 0;
        }else if (sx > stage.size.x - view_width){
            sx = stage.size.x - view_width;
        }

        if (sy < 0){
            sy = 0;
        }else if (sy > stage.size.y - view_height){
            sy = stage.size.y - view_height;
        }

        if (sx !== scroll_x || sy !== scroll_y){
            editActions.scroll({
                x: sx,
                y: sy,
            });
        }
    }else if (tool.type === 'rect'){
        // 四角形の描画
        const {
            end_x,
            end_y
        } = tool;

        const rx = x + scroll_x;
        const ry = y + scroll_y;

        if (end_x !== rx || end_y !== ry){
            editActions.setTool({
                tool: {
                    ...tool,
                    end_x: rx,
                    end_y: ry,
                },
            });
        }
    }

}

export function mouseUp(): void{
    const edit = editStore.state;
    const {
        tool,
        screen,
        stage,
    } = edit;

    if (tool == null){
        return;
    }

    if (tool.type === 'rect'){
        const {
            start_x,
            start_y,
            end_x,
            end_y,
        } = tool;
        const [left, right] = start_x <= end_x ? [start_x, end_x] : [end_x, start_x];
        const [top, bottom] = start_y <= end_y ? [start_y, end_y] : [end_y, start_y];

        const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

        mapUpdateRectAction(screen)({
            stage,
            left,
            top,
            right,
            bottom,
            chip: pen,
        });

        editActions.setTool({
            tool: null,
        });
    }else{
        editActions.setTool({
            tool: null,
        });
    }

    if (tool.type === 'pen' || tool.type === 'eraser' || tool.type === 'rect'){
        const stage = editStore.state.stage;
        historyActions.addHistory({
            stage,
            stageData: mapStore.state.data[stage-1],
        });
    }
}

function mapUpdateAction(screen: Screen){
    if (screen === 'layer'){
        return mapActions.updateLayer;
    }else{
        return mapActions.updateMap;
    }
}
function mapUpdateRectAction(screen: Screen){
    if (screen === 'layer'){
        return mapActions.updateLayerRect;
    }else{
        return mapActions.updateMapRect;
    }
}
