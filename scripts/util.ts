'use strict';
//util methods

/**
 * elementのabsolute positionを返す
 */
export function getAbsolutePosition(elm: HTMLElement){
    const r=elm.getBoundingClientRect();
    const b = document.body.getBoundingClientRect();
    return {
        x: r.left - b.left,
        y: r.top - b.top,
        // ついでにwidthとheightも返す
        width: r.width,
        height: r.height,
    };
}

export interface Color{
    r: number;
    g: number;
    b: number;
}

/**
 * r, g, b要素をCSSの値に直す
 */
export function cssColor({r, g, b}: Color){
    return `rgb(${r},${g},${b})`;
}

/**
 * 色のcomplementを取る
 */
export function complementColor({r, g, b}: Color): Color{
    return {
        r: 255-r,
        g: 255-g,
        b: 255-b,
    };
}

/**
 * ステージの背景色を求める
 * TODO
 */
export function stageBackColor(params: any, edit: any){
    const stage: number = edit.stage;
    if(stage === 1){
        return {
            r: Number(params.backcolor_red),
            g: Number(params.backcolor_green),
            b: Number(params.backcolor_blue),
        };
    }else if(stage === 2){
        return {
            r: Number(params.backcolor_red_s),
            g: Number(params.backcolor_green_s),
            b: Number(params.backcolor_blue_s),
        };
    }else if(stage === 3){
        return {
            r: Number(params.backcolor_red_t),
            g: Number(params.backcolor_green_t),
            b: Number(params.backcolor_blue_t),
        };
    }else if(stage === 4){
        return {
            r: Number(params.backcolor_red_f),
            g: Number(params.backcolor_green_f),
            b: Number(params.backcolor_blue_f),
        };
    }
    return {
        r: 0,
        g: 0,
        b: 0,
    };
}

// ソート済配列に対するuniq (non-destructive)
export function sortedUniq<T>(arr: Array<T>, eq:(x: T, y: T)=>boolean){
    const result: Array<T> = [];
    const l = arr.length;
    if (l === 0){
        return result;
    }
    let n = arr[0];
    result.push(n);
    for (let i = 1; i < l; i++){
        const x = arr[i];
        if (eq(n, x)){
            continue;
        }else{
            n = x;
            result.push(n);
        }
    }
    return result;
}

// どれくらいページがズームされているか返す
export function getPageZoom(): number{
    return document.body.clientWidth / window.innerWidth;
}
