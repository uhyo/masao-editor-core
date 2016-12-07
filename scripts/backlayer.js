'use strict';

const rbush = require('rbush');
/**
 * すでにRenderした範囲を管理する
 */
class RenderedRegions{
    /**
     * @constructor
     * @param {number} width 管理する範囲の横幅
     * @param {number} height 管理する範囲の縦幅
     * @param {Function} renderCallback 実際の書き込み発生時のあれ
     */
    constructor(width, height, renderCallback){
        this.width = width;
        this.height = height;
        this.renderCallback = renderCallback;

        // 左から順番に描画するやつ
        this.leftFrontier = 0;
        this.expandWidth = 10;

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
     * @param {Object} rect レンダリングする範囲
     * @param {number} rect.x 左上
     * @param {number} rect.y 左上
     * @param {number} rect.width 横幅
     * @param {number} rect.height 縦幅
     * @param {boolean} [force=false] 描画済でももう一度描画
     */
    requestRender({x, y, width, height}, force=false){
        const minX = x;
        const minY = y;
        const maxX = x + width;
        const maxY = y + height;
        const item = {
            minX,
            minY,
            maxX,
            maxY,
        };

        if (!force && maxX <= this.leftFrontier){
            return;
        }

        // colsはitemとintersectする矩形の集合
        const cols = this.tree.search(item);

        // まだrenderされていないところを列挙する
        const targets = [];
        const startX = force ? minX : Math.max(minX, this.leftFrontier);
        xloop: for (let cx = startX; cx < maxX; cx++){
            yloop: for (let cy = minY; cy < maxY; cy++){
                if (!force){
                    for (let rect of cols){
                        if (rect.minY <= cy && cy < rect.maxY && rect.minX <= cx && cx < rect.maxX){
                            if (rect.minY <= minY && maxY <= rect.maxY){
                                // 列を全部覆う
                                cx = rect.maxX-1;
                                break yloop;
                            }else{
                                cy = rect.maxY-1;
                                continue yloop;
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
        this.renderCallback(targets);
    }
    /**
     * 指定された矩形を描画済み領域に追加
     * @param {Rect} item 矩形
     * @param {Rect[]} [cols] itemとintersectする領域の集まり
     *
     * @private
     */
    insertArea(item, cols){
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
        this.requestRender({
            x: this.leftFrontier,
            y: 0,
            width: this.expandWidth,
            height: this.height,
        });
        this.leftFrontier += this.expandWidth;
        return this.leftFrontier < this.width;
    }
}

/**
 * ダブルバッファリングを表すクラス
 */
export default class BackLayer{
    /**
     * @constructor
     * @param {number} width 領域全体の横幅
     * @param {number} height 領域全体の縦幅
     * @param {number} size 1タイルの大きさ
     * @param {Function} drawCallback 実際にcanvas上に描画する関数
     */
    constructor(width, height, size, drawCallback){
        this.width = width;
        this.height = height;
        this.size = size;
        this.drawCallback = drawCallback;

        this.regions = new RenderedRegions(width, height, this.renderTargets.bind(this));
        this.initCanvas();
    }
    /**
     * canvasを初期化
     * @private
     */
    initCanvas(){
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
     * @private
     */
    renderTargets(targets){
        const {
            canvas,
            size,
        } = this;
        const ctx = canvas.getContext('2d');
        for (let {x, y} of targets){
            this.drawCallback(ctx, x, y, x * size, y * size);
        }
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * 指定した位置がupdateされたことを通知
     *
     * @param {number} x 左上位置
     * @param {number} y 左上位置
     * @param {number} [width=1] 範囲
     * @param {number} [height=1] 範囲
     */
    update(x, y, width=1, height=1){
        const {
            canvas,
            regions,
            size,
        } = this;

        // updateされた領域を消去
        const ctx = canvas.getContext('2d');
        ctx.clearRect(x*size, y*size, width*size, height*size);

        // 強制的に再描画
        regions.requestRender({
            x,
            y,
            width,
            height,
        }, true);
    }

    /**
     * 指定した領域をバックバッファに描画
     *
     * @param {number} x 描画開始位置
     * @param {number} y 描画開始位置
     * @param {number} width 描画領域横幅
     * @param {number} height 描画領域縦幅
     */
    prerender(x, y, width, height){
        this.regions.requestRender({
            x,
            y,
            width,
            height,
        });
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
    copyTo(ctx, x, y, width, height, dx, dy){
        const {
            canvas,
            size,
        } = this;
        ctx.drawImage(canvas,
                      x * size, y * size,
                      width * size, height * size,
                      0, 0,
                      width * size, height * size);
    }

}
