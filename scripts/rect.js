'use strict';

// Rectを扱う機能群

/**
 * 複数のRectを包含するやつ
 */
export function containerRect(...rects){
    const rect = {
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity,
    };

    for (let {minX, minY, maxX, maxY} of rects){
        if (minX <= rect.minX){
            rect.minX = minX;
        }
        if (minY <= rect.minY){
            rect.minY = minY;
        }
        if (rect.maxX <= maxX){
            rect.maxX = maxX;
        }
        if (rect.maxY <= maxY){
            rect.maxY = maxY;
        }
    }
    return rect;
}
