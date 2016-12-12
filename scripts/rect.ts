'use strict';

// Rectを扱う機能群

export interface Rect{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

/**
 * 複数のRectを包含するやつ
 */
export function containerRect(...rects: Array<Rect>): Rect{
    const rect: Rect = {
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

