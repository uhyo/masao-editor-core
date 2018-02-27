'use strict';

import * as rbush from 'rbush';

import {
    sortedUniq,
} from '../../../scripts/util';
import {
    Rect,
} from '../../../scripts/rect';
import MapUpdator from './updator';
/**
 * すでにRenderした範囲を管理する
 */

export interface Point{
    x: number;
    y: number;
}
export type RenderCallback = (targets: Array<Point>)=>void;

/**
 * 位置と大きさで表された矩形
 */
export interface Box{
    x: number;
    y: number;
    width: number;
    height: number;
}
class RenderedRegions{
    /**
     * 既に描画済みの領域の右端
     */
    private leftFrontier: number = 0;

    /**
     * 1回のexpandで拡大するfrontierの長さ
     */
    private expandWidth: number = 10;

    /**
     * 描画済み領域
     */
    private tree: rbush.RBush<Rect>;
    /**
     * @constructor
     * @param {number} width 管理する範囲の横幅
     * @param {number} height 管理する範囲の縦幅
     * @param {Function} renderCallback 実際の書き込み発生時のあれ
     */
    constructor(private width: number, private height: number, private renderCallback: RenderCallback){
        // 左から順番に描画するやつ
        this.tree = rbush(9);
    }

    /**
     * 描画情報をクリア
     */
    clear(){
        this.tree.clear();
        this.leftFrontier = 0;
    }

    /**
     * サイズを変更
     * @param {number} width 新しい横幅
     * @param {number} height 新しい縦幅
     */
    resize(width: number, height: number): void{
        this.width = width;
        this.height = height;
    }

    /**
     * 指定した範囲のレンダリングを要求する
     * @param {Object[]} rects レンダリングする範囲
     * @param {boolean} [force=false] 描画済でももう一度描画
     */
    requestRender(rects: Array<Box>, force: boolean=false){
        // まだrenderされていないところを列挙する
        const targets = [];
        for(let {x, y, width, height} of rects){
            const minX = Math.max(0, Math.min(x, this.width));
            const minY = Math.max(0, Math.min(y, this.height));
            const maxX = Math.min(this.width, Math.max(0, x + width));
            const maxY = Math.min(this.height, Math.max(0, y + height));

            if (!force && maxX <= this.leftFrontier){
                continue;
            }

            const item = {
                minX,
                minY,
                maxX,
                maxY,
            };

            // colsはitemとintersectする矩形の集合
            const cols = this.tree.search(item);

            const startX = Math.max(0, force ? minX : Math.max(minX, this.leftFrontier));
            const endX = Math.min(maxX, this.width);
            for (let cx = startX; cx < endX; cx++){
                const startY = Math.max(0, minY);
                const endY = Math.min(maxY, this.height);
                for (let cy = startY; cy < endY; cy++){
                    if (!force){
                        for (let rect of cols){
                            if (rect.minY <= cy && cy < rect.maxY && rect.minX <= cx && cx < rect.maxX){
                                if (rect.minY <= minY && maxY <= rect.maxY){
                                    // 列を全部覆う
                                    cx = rect.maxX-1;
                                    break;
                                }else{
                                    cy = rect.maxY-1;
                                    continue;
                                }
                            }
                        }
                    }
                    // 当たり判定をくぐり抜けた
                    targets.push({
                        x: cx,
                        y: cy,
                    });
                }
            }
            this.insertArea(item, cols);
        }

        if (targets[0] != null){
            this.renderCallback(targets);
        }
    }

    /**
     * 指定された矩形を描画済み領域に追加
     * @param {Rect} item 矩形
     * @param {Rect[]} [cols] itemとintersectする領域の集まり
     *
     * @private
     */
    insertArea(item: Rect, cols?: Array<Rect>){
        const {
            minX,
            minY,
            maxX,
            maxY,
        } = item;
        const {
            tree,
        } = this;
        if (cols == null){
            cols = tree.search(item);
        }
        for (let rect of cols){
            if (minX <= rect.minX && minY <= rect.minY && rect.maxX <= maxX && rect.maxY <= maxY){
                tree.remove(rect);
            }
        }
        tree.insert(item);
    }
    /**
     * 指定した領域を描画済み領域から拡張
     */
    removeArea(item: Rect){
        const {
            minX,
            minY,
            maxX,
            maxY,
        } = item;
        const {
            tree,
        } = this;

        const cols = tree.search(item);
        for (let rect of cols){
            // intersectするやつは範囲をけずる
            tree.remove(rect);
            let minX2, minY2, maxX2, maxY2;
            let flag = 0;
            if (maxX < rect.maxX){
                minX2 = maxX;
                maxX2 = rect.maxX;
            }else if (rect.minX < minX){
                minX2 = rect.minX;
                maxX2 = minX;
            }else{
                minX2 = rect.minX;
                maxX2 = rect.maxX;
                flag++;
            }
            if (maxY < rect.maxY){
                minY2 = maxY;
                maxY2 = rect.maxY;
            }else if (rect.minY < minY){
                minY2 = rect.minY;
                maxY2 = minY;
            }else{
                minY2 = rect.minY;
                maxY2 = rect.maxY;
                flag++;
            }
            if (flag < 2){
                tree.insert({
                    minX: minX2,
                    minY: minY2,
                    maxX: maxX2,
                    maxY: maxY2,
                });
            }
        }
        if (this.leftFrontier > minX){
            this.leftFrontier = minX;
        }
    }
    /**
     * 描画済み領域を拡張
     */
    expand(){
        // frontierを広げる
        if (this.leftFrontier >= this.width){
            return false;
        }
        const exp = Math.min(this.expandWidth, this.width - this.leftFrontier);
        this.requestRender([{
            x: this.leftFrontier,
            y: 0,
            width: exp,
            height: this.height,
        }]);
        this.leftFrontier += exp;
        return this.leftFrontier < this.width;
    }
}

export type DrawCallback = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number)=>void;
/**
 * ダブルバッファリングを表すクラス
 */
export default class BackLayer{
    private regions: RenderedRegions;
    private canvas: HTMLCanvasElement;
    /**
     * @constructor
     * @param {number} width 領域全体の横幅
     * @param {number} height 領域全体の縦幅
     * @param {number} size 1タイルの大きさ
     * @param {Updator} updator
     * @param {Function} drawCallback 実際にcanvas上に描画する関数
     */
    constructor(private width: number, private height: number, private size: number, private updator: MapUpdator, private drawCallback: DrawCallback){
        this.regions = new RenderedRegions(width, height, this.renderTargets.bind(this));
        this.canvas = this.initCanvas();
    }
    /**
     * canvasを初期化
     */
    private initCanvas(): HTMLCanvasElement {
        const {
            width,
            height,
            size,
        } = this;
        const canvas = document.createElement('canvas');
        canvas.width = width * size;
        canvas.height = height * size;
        return canvas;
    }
    /**
     * バッファ上に描画
     *
     * @param {Point[]} targets 描画対象マスの一覧
     */
    private renderTargets(targets: Array<Point>){
        const {
            canvas,
            width,
            height,
            size,
            updator,
        } = this;
        const ctx = canvas.getContext('2d');
        if (ctx == null){
            return;
        }
        // まずclearRectで消去
        for (let {x, y} of targets){
            ctx.clearRect(x*size, y*size, size, size);
        }

        ctx.save();
        // 描画対象範囲にclip
        ctx.beginPath();
        for (let {x, y} of targets){
            ctx.rect(x*size, y*size, size, size);
        }
        ctx.clip('nonzero');

        const effecters1 = updator.fromRegion(...targets);
        // TODO
        effecters1.sort(({x: x1, y: y1, big: big1}: any, {x: x2, y: y2, big: big2}: any)=> (big2 - big1) * width * height + (x2 - x1) * height + (y2 - y1));
        const effecters = sortedUniq(effecters1, ({x: x1, y: y1}, {x: x2, y: y2})=> x1 === x2 && y1 === y2);

        for (let {x, y} of effecters){
            this.drawCallback(ctx, x, y, x * size, y * size);
        }

        ctx.restore();
    }

    /**
     * 描画情報をクリア
     */
    clear(){
        const {
            canvas,
            regions,
        } = this;

        regions.clear();


        const ctx = canvas.getContext('2d');
        if (ctx == null){
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * リサイズ
     * @param {number} width 横幅
     * @param {number} height 縦幅
     */
    resize(width: number, height: number){
        const {
            canvas,
            size,
        } = this;
        this.width = width;
        this.height = height;
        this.regions.resize(width, height);
        // canvasのサイズを変更
        canvas.width = width * size;
        canvas.height = height * size;

        this.clear();
    }

    /**
     * 指定した位置がupdateされたことを通知
     *
     * @param {Points[]} points 再描画範囲
     */
    update(points: Array<Point>){
        const {
            regions,
        } = this;

        const rects = [];   // ついでにrect集合に変換
        for (let {x, y} of points){
            rects.push({
                x,
                y,
                width: 1,
                height: 1,
            });
            regions.removeArea({
                minX: x,
                minY: y,
                maxX: x+1,
                maxY: y+1,
            });
        }
        // 描画範囲からクリア
        // regions.requestRender(rects, true);
    }

    /**
     * 指定した領域をバックバッファに描画
     *
     * @param {number} x 描画開始位置
     * @param {number} y 描画開始位置
     * @param {number} width 描画領域横幅
     * @param {number} height 描画領域縦幅
     */
    prerender(x: number, y: number, width: number, height: number){
        this.regions.requestRender([{
            x,
            y,
            width,
            height,
        }]);
    }
    /**
     * 描画済み領域を拡張
     *
     * @returns {boolean} 拡張完了か否か
     */
    expand(){
        return this.regions.expand();
    }

    /**
     * 指定した位置を描画。位置はタイル単位で指定
     * 
     * @param {CanvasRenderingContext2D} ctx 描画対象のcontext
     * @param {number} x 描画開始位置
     * @param {number} y 描画開始位置
     * @param {number} width 描画領域横幅
     * @param {number} height 描画領域縦幅
     * @param {number} dx 描画対象位置
     * @param {number} dy 描画対象位置
     * @param {number} widthRemainder 右端の非表示領域 (px)
     * @param {number} heightRemainder 下端の非表示領域 (px)
     * @param {boolean} stickRight 右端に吸い付くフラグ
     * @param {boolean} stickBottom 下端に吸い付くフラグ
     */
    copyTo(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        dx: number,
        dy: number,
    ){
        const {
            canvas,
            size,
        } = this;

        // source image x
        const csx = x * size;
        // source image y
        const csy = y * size;
        // copied image width.
        const cw = width * size;
        // copied image height.
        const ch = height * size;

        ctx.drawImage(
            canvas,
            csx, csy,
            cw, ch,
            dx * size, dy * size,
            cw, ch,
        );
    }

}

