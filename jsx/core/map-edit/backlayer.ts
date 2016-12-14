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
     * 指定した範囲のレンダリングを要求する
     * @param {Object[]} rects レンダリングする範囲
     * @param {boolean} [force=false] 描画済でももう一度描画
     */
    requestRender(rects: Array<Box>, force: boolean=false){
        // まだrenderされていないところを列挙する
        const targets = [];
        // colsはitemとintersectする矩形の集合
        for(let {x, y, width, height} of rects){
            const minX = x;
            const minY = y;
            const maxX = x + width;
            const maxY = y + height;

            if (!force && maxX <= this.leftFrontier){
                continue;
            }

            const item = {
                minX,
                minY,
                maxX,
                maxY,
            };

            const cols = this.tree.search(item);

            const startX = force ? minX : Math.max(minX, this.leftFrontier);
            for (let cx = startX; cx < maxX; cx++){
                for (let cy = minY; cy < maxY; cy++){
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
     * 描画済み領域を拡張
     */
    expand(){
        // frontierを広げる
        if (this.leftFrontier >= this.width){
            return false;
        }
        this.requestRender([{
            x: this.leftFrontier,
            y: 0,
            width: this.expandWidth,
            height: this.height,
        }]);
        this.leftFrontier += this.expandWidth;
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
        this.initCanvas();
    }
    /**
     * canvasを初期化
     */
    private initCanvas(){
        const {
            width,
            height,
            size,
        } = this;
        const canvas = this.canvas = document.createElement('canvas');
        canvas.width = width * size;
        canvas.height = height * size;
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

        for (let {x, y, big} of effecters){
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
     * 指定した位置がupdateされたことを通知
     *
     * @param {Points[]} points 再描画範囲
     */
    update(points: Array<Point>){
        const {
            canvas,
            regions,
            size,
            updator,
        } = this;

        const rects = [];   // ついでにrect集合に変換
        for (let {x, y} of points){
            rects.push({
                x,
                y,
                width: 1,
                height: 1,
            });
        }
        // 強制的に再描画
        regions.requestRender(rects, true);
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
     */
    copyTo(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, dx: number, dy: number){
        const {
            canvas,
            size,
        } = this;
        ctx.drawImage(canvas,
                      x * size, y * size,
                      width * size, height * size,
                      dx * size, dy * size,
                      width * size, height * size);
    }

}

