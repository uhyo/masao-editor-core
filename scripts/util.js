"use strict";
//util methods
//
//elementのabsolute position of HTMLElement
function getAbsolutePosition(elm){
    var r=elm.getBoundingClientRect();
    return {
        x: r.left+window.scrollX,
        y: r.top+window.scrollY,
        // ついでにwidthとheightも返す
        width: r.width,
        height: r.height,
    };
}
exports.getAbsolutePosition=getAbsolutePosition;

function cssColor(r,g,b){
    return `rgb(${r},${g},${b})`;
}
exports.cssColor = cssColor;

//背景色を求める
function stageBackColor(params,edit){
    let stage=edit.stage;
    if(stage===1){
        return cssColor(params.backcolor_red, params.backcolor_green, params.backcolor_blue);
    }else if(stage===2){
        return cssColor(params.backcolor_red_s, params.backcolor_green_s, params.backcolor_blue_s);
    }else if(stage===3){
        return cssColor(params.backcolor_red_t, params.backcolor_green_t, params.backcolor_blue_t);
    }else if(stage===4){
        return cssColor(params.backcolor_red_f, params.backcolor_green_f, params.backcolor_blue_f);
    }
    return "#000000";


}
exports.stageBackColor = stageBackColor;

// ソート済配列に対するuniq (non-destructive)
function sortedUniq(arr, eq){
    const result = [];
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

exports.sortedUniq = sortedUniq;
