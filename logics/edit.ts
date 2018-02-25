// logic
import * as chip from '../scripts/chip';

import * as editActions from '../actions/edit';
import * as mapActions from '../actions/map';
import * as historyActions from '../actions/history';
import editStore, {
    Screen,
} from '../stores/edit';
import mapStore from '../stores/map';

export type FocusPlace = editActions.FocusPlace;

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

    scroll({
        x: scroll_x2,
        y: scroll_y2,
    });
}

export interface ResizeData{
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

// 画面の大きさを変更
export interface ChangeViewArg{
    width: number;
    height: number;
    widthRemainder: number;
    heightRemainder: number;
}
export function changeView({
    width,
    height,
    widthRemainder,
    heightRemainder,
}: ChangeViewArg): void{
    if (
        width !== editStore.state.view_width ||
        height !== editStore.state.view_height ||
        widthRemainder !== editStore.state.view_width_remainder ||
        heightRemainder !== editStore.state.view_height_remainder) {
        editActions.changeView({
            width,
            height,
            widthRemainder,
            heightRemainder,
        });
        scroll({
            x: editStore.state.scroll_x,
            y: editStore.state.scroll_y,
        });
    }
}

// スクロールした場合の調整
export function scroll({x, y}: {x: number; y: number}): void{
    const {
        stage,
        view_width,
        view_height,
        scroll_x,
        scroll_y,
        scroll_stick_right,
        scroll_stick_bottom,
        cursor,
    } = editStore.state;
    const {
        size,
    } = mapStore.state.data[stage-1];

    let stickRight = false;
    let stickBottom = false;

    if (x >= size.x - view_width){
        x = size.x - view_width;
        stickRight = true;
    }
    if (y >= size.y - view_height){
        y = size.y - view_height;
        stickBottom = true;
    }
    if (x <= 0){
        x = 0;
        stickRight = false;
    }
    if (y <= 0){
        y = 0;
        stickBottom = false;
    }

    if (scroll_x !== x || scroll_y !== y ||
        scroll_stick_right !== stickRight ||
        scroll_stick_bottom !== stickBottom
    ) {
        editActions.scroll({
            x,
            y,
            stickRight,
            stickBottom,
        });
    }

    if (cursor && cursor.type === 'main'){
        // カーソルが出ていたら考慮
        const nx = Math.max(x, Math.min(x + view_width-1, cursor.x));
        const ny = Math.max(y, Math.min(y + view_height-1, cursor.y));

        if (cursor.x !== nx || cursor.y !== ny){
            editActions.setCursor({
                cursor: {
                    type: 'main',
                    x: nx,
                    y: ny,
                },
            });
        }
    }
}

// 差分
export function scrollBy({x, y}: {x: number; y: number;}): void{
    scroll({
        x: editStore.state.scroll_x + x,
        y: editStore.state.scroll_y + y,
    });
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
    }else if (mode === 'fill'){
        const rx = x + scroll_x;
        const ry = y + scroll_y;

        const pen = screen === 'layer' ? edit.pen_layer : edit.pen;

        mapUpdateFillAction(screen)({
            stage,
            x: rx,
            y: ry,
            chip: pen,
        });
        historyActions.addHistory({
            stage,
            stageData: mapStore.state.data[stage-1],
        });
    }
    editActions.setTool({
        tool,
    });

    if (tool != null && mode !== 'hand'){
        mouseMove(x, y, tool);
    }
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

        scroll({
            x: sx,
            y: sy,
        });

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
function mapUpdateFillAction(screen: Screen){
    if (screen === 'layer'){
        return mapActions.updateLayerFill;
    }else{
        return mapActions.updateMapFill;
    }
}

// カーソルの移動
export function moveCursorBy({x, y}: {x: number; y: number}): void{
    const edit = editStore.state;
    const {
        stage,
        cursor,
        scroll_x,
        scroll_y,
        view_width,
        view_height,
        chipselect_width,
        chipselect_height,
        chipselect_scroll,
        tool,
    } = edit;

    const {
        size,
    } = mapStore.state.data[stage-1];

    if (cursor == null){
        // カーソルがない場合は画面の左上に出現
        editActions.setCursor({
            cursor: {
                type: 'main',
                x: scroll_x,
                y: scroll_y,
            },
        });
    }else if(cursor.type === 'main'){
        // カーソルが移動
        const x2 = Math.max(0, Math.min(cursor.x + x, size.x-1));
        const y2 = Math.max(0, Math.min(cursor.y + y, size.y-1));

        editActions.setCursor({
            cursor: {
                type: 'main',
                x: x2,
                y: y2,
            },
        });
        // スクロールが必要ならスクロール
        const scroll_x2 = Math.min(x2, Math.max(scroll_x, x2 - view_width + 1));
        const scroll_y2 = Math.min(y2, Math.max(scroll_y, y2 - view_height + 1));

        if (scroll_x !== scroll_x2 || scroll_y !== scroll_y2){
            scroll({
                x: scroll_x2,
                y: scroll_y2,
            });
        }
        // さらに移動
        mouseMove(x2 - scroll_x2, y2 - scroll_y2, tool);
    }else if(cursor.type === 'chipselect'){
        const {
            id,
        } = cursor;

        const id2 = Math.max(0, Math.min(id + x + y * chipselect_width, chipLength()-1));

        editActions.setCursor({
            cursor: {
                type: 'chipselect',
                id: id2,
            },
        });

        const idy = Math.floor(id2 / chipselect_width);

        const c_sc = Math.min(idy, Math.max(chipselect_scroll, idy - chipselect_height + 1));
        if (c_sc !== chipselect_scroll){
            editActions.changeChipselectScroll({
                y: c_sc,
            });
        }
    }
}
export function cursorJump(): void{
    const {
        cursor,
    } = editStore.state;

    if (cursor == null || cursor.type === 'chipselect'){
        setCursor('main');
    }else if (cursor.type === 'main'){
        setCursor('chipselect');
    }
}
export function setCursor(type: FocusPlace): void{
    const {
        scroll_x,
        scroll_y,
        chipselect_width,
        chipselect_scroll,
    } = editStore.state;
    if (type === 'main'){
        editActions.setCursor({
            cursor: {
                type,
                x: scroll_x,
                y: scroll_y,
            },
        });
    }else if (type === 'chipselect'){
        editActions.setCursor({
            cursor: {
                type,
                id: chipselect_width * chipselect_scroll,
            },
        });
    }
}
/**
 * ある領域にフォーカスした
 */
export function focus(place: FocusPlace): void{
    const {
        focus,
        cursorEnabled,
    } = editStore.state;
    if (focus !== place){
        editActions.setFocus({
            focus: place,
        });
        if (cursorEnabled){
            setCursor(place);
        }
    }
}
/**
 * フォーカスが離れた
 */
export function blur(place: FocusPlace): void{
    const {
        cursor,
        focus,
    } = editStore.state;
    if (focus === place){
        editActions.setFocus({
            focus: null,
        });
    }
    if (cursor != null && cursor.type === place){
        editActions.setCursor({
            cursor: null,
        });
    }
}
export function cursorButton(keydown: boolean){
    const {
        screen,
        mode,
        scroll_x,
        scroll_y,
        cursor,
    } = editStore.state;

    if (cursor == null){
        return;
    }

    if (cursor.type === 'main'){
        const {
            x,
            y,
        } = cursor;

        if (keydown === true){
            mouseDown(mode, x - scroll_x, y - scroll_y);
        }else{
            mouseUp();
        }
    }else if (cursor.type === 'chipselect'){
        const {
            id,
        } = cursor;
        if (screen === 'layer'){
            editActions.changePenLayer({
                pen: id,
            });
        }else{
            editActions.changePen({
                pen: chipList()[id],
            });
        }
    }
}

export function chipList(){
    const {
        advanced,
    } = mapStore.state;

    return advanced ? chip.advancedChipList : chip.chipList;
}
// チップの数
export function chipLength(): number{
    return chipList().length;
}
