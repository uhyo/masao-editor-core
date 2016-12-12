'use strict';
//util methods

/**
 * elementのabsolute positionを返す
 */
export function getAbsolutePosition(elm: HTMLElement){
    const r=elm.getBoundingClientRect();
    return {
        x: r.left+window.scrollX,
        y: r.top+window.scrollY,
        // ついでにwidthとheightも返す
        width: r.width,
        height: r.height,
    };
}

/**
 * r, g, b要素をCSSの値に直す
 */
export function cssColor(r: number,g: number,b: number){
    return `rgb(${r},${g},${b})`;
}

/**
 * ステージの背景色を求める
 * TODO
 */
export function stageBackColor(params: any, edit: any){
    const stage: number = edit.stage;
    if(stage === 1){
        return cssColor(params.backcolor_red, params.backcolor_green, params.backcolor_blue);
    }else if(stage === 2){
        return cssColor(params.backcolor_red_s, params.backcolor_green_s, params.backcolor_blue_s);
    }else if(stage === 3){
        return cssColor(params.backcolor_red_t, params.backcolor_green_t, params.backcolor_blue_t);
    }else if(stage === 4){
        return cssColor(params.backcolor_red_f, params.backcolor_green_f, params.backcolor_blue_f);
    }
    return "#000000";


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


