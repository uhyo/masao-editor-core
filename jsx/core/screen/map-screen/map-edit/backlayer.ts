'use strict';

import { sortedUniq } from '../../../../../scripts/util';
import { Rect } from '../../../../../scripts/rect';
import MapUpdator from './updator';
/**
 * すでにRenderした範囲を管理する
 */

export interface Point {
  x: number;
  y: number;
}
export type RenderCallback = (targets: Array<Point>) => void;

/**
 * 位置と大きさで表された矩形
 */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
class RenderedRegions {
  /**
   * 描画済み領域のビットフラグ
   * 0: 未描画
   * 1: 描画済み
   */
  protected renderedArray: Uint8Array;

  constructor(
    private width: number,
    private height: number,
    private renderCallback: RenderCallback,
  ) {
    this.renderedArray = this.makeNewArray(width, height);
  }

  /**
   * 指定されたサイズの描画領域を表す新しい配列を作成
   */
  protected makeNewArray(width: number, height: number): Uint8Array {
    // 1ます1ビットで表すのに必要なサイズ
    const size = Math.ceil((width * height) / 8);
    return new Uint8Array(size);
  }

  /**
   * 描画情報をクリア
   */
  public clear() {
    // 配列を0で埋める
    this.renderedArray.fill(0);
  }

  /**
   * サイズを変更
   * @param {number} width 新しい横幅
   * @param {number} height 新しい縦幅
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.renderedArray = this.makeNewArray(width, height);
  }

  /**
   * 指定した範囲のレンダリングを要求する
   * @param {Object[]} rects レンダリングする範囲
   * @param {boolean} [force=false] 描画済でももう一度描画
   */
  public requestRender(rects: Array<Box>, force: boolean = false) {
    const { renderedArray } = this;
    // まだrenderされていないところを列挙する
    const targets = [];
    for (let { x, y, width, height } of rects) {
      // 矩形が描画範囲外に出ないようにする
      const minX = Math.max(0, Math.min(x, this.width));
      const minY = Math.max(0, Math.min(y, this.height));
      const maxX = Math.min(this.width, Math.max(0, x + width));
      const maxY = Math.min(this.height, Math.max(0, y + height));

      for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
          const idx = this.width * y + x;
          const byteidx = idx >> 3;
          const flag = 1 << (idx & 0b111);
          const val = renderedArray[byteidx] & flag;
          if (val === 0 || force) {
            // 未描画なので描画
            renderedArray[byteidx] |= flag;
            targets.push({
              x,
              y,
            });
          }
        }
      }
    }

    if (targets[0] != null) {
      this.renderCallback(targets);
    }
  }
  /**
   * 指定した領域を描画済み領域から除去
   */
  public removeArea(item: Rect) {
    const { minX, minY, maxX, maxY } = item;
    const { renderedArray, width } = this;
    for (let y = minY; y < maxY; y++) {
      // 0で埋める
      const startidx = y * width + minX;
      const endidx = y * width + maxX;
      const startbyteidx = startidx >> 3;
      const endbyteidx = endidx >> 3;
      // 中間は0で埋める
      renderedArray.fill(0, startbyteidx + 1, endbyteidx);
      // 始めと終わりを処理
      if (startbyteidx === endbyteidx) {
        // 同じbyte内で完結している場合の処理
        // [76543210]
        const startbitidx = startidx & 0b111;
        const endbitidx = endidx & 0b111;
        // start=2, end = 5 => mask = [00011100]
        // mask1 = 1[00011111]
        const mask1 = 0xff + (1 << endbitidx);
        // mask2 = 1[00000011]
        const mask2 = 0xff + (1 << startbitidx);
        // mask = [00011100]
        const mask = mask1 - mask2;
        renderedArray[startbyteidx] &= 0xff ^ mask;
      } else {
        const startbitidx = startidx & 0b111;
        const endbitidx = endidx & 0b111;
        // start=2 => mask1 = 1[00000011]
        const mask1 = 0xff + (1 << startbitidx);
        renderedArray[startbyteidx] &= mask1;
        // end=5 => mask2 = 1[11100000]
        const mask2 = 0xff ^ (0xff + (1 << endbitidx));
        renderedArray[endbyteidx] &= mask2;
      }
    }
  }
  /**
   * 描画済み領域を拡張
   */
  public expand() {
    /*
    // frontierを広げる
    if (this.leftFrontier >= this.width) {
      return false;
    }
    const exp = Math.min(this.expandWidth, this.width - this.leftFrontier);
    this.requestRender([
      {
        x: this.leftFrontier,
        y: 0,
        width: exp,
        height: this.height,
      },
    ]);
    this.leftFrontier += exp;
    return this.leftFrontier < this.width;
     */
    return true;
  }
}

export type DrawCallback = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) => void;
/**
 * ダブルバッファリングを表すクラス
 * C: チップコードの型
 */
export default class BackLayer<C> {
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
  constructor(
    private width: number,
    private height: number,
    private size: number,
    private updator: MapUpdator<C>,
    private drawCallback: DrawCallback,
  ) {
    this.regions = new RenderedRegions(
      width,
      height,
      this.renderTargets.bind(this),
    );
    this.canvas = this.initCanvas();
  }
  /**
   * canvasを初期化
   */
  private initCanvas(): HTMLCanvasElement {
    const { width, height, size } = this;
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
  private renderTargets(targets: Array<Point>) {
    const { canvas, width, height, size, updator } = this;
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    // まずclearRectで消去
    for (let { x, y } of targets) {
      ctx.clearRect(x * size, y * size, size, size);
    }

    ctx.save();
    // 描画対象範囲にclip
    ctx.beginPath();
    for (let { x, y } of targets) {
      ctx.rect(x * size, y * size, size, size);
    }
    ctx.clip('nonzero');

    const effecters1 = updator.fromRegion(...targets);
    // TODO
    effecters1.sort(
      ({ x: x1, y: y1, big: big1 }: any, { x: x2, y: y2, big: big2 }: any) =>
        (big2 - big1) * width * height + (x2 - x1) * height + (y2 - y1),
    );
    const effecters = sortedUniq(
      effecters1,
      ({ x: x1, y: y1 }, { x: x2, y: y2 }) => x1 === x2 && y1 === y2,
    );

    for (let { x, y } of effecters) {
      this.drawCallback(ctx, x, y, x * size, y * size);
    }

    ctx.restore();
  }

  /**
   * 描画情報をクリア
   */
  clear() {
    const { canvas, regions } = this;

    regions.clear();

    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * リサイズ
   * @param {number} width 横幅
   * @param {number} height 縦幅
   */
  resize(width: number, height: number) {
    const { canvas, size } = this;
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
  update(points: Array<Point>) {
    const { regions } = this;

    const rects = []; // ついでにrect集合に変換
    for (let { x, y } of points) {
      rects.push({
        x,
        y,
        width: 1,
        height: 1,
      });
      regions.removeArea({
        minX: x,
        minY: y,
        maxX: x + 1,
        maxY: y + 1,
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
  prerender(x: number, y: number, width: number, height: number) {
    this.regions.requestRender([
      {
        x,
        y,
        width,
        height,
      },
    ]);
  }
  /**
   * 描画済み領域を拡張
   *
   * @returns {boolean} 拡張完了か否か
   */
  expand() {
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
  ) {
    const { canvas, size } = this;

    // source image x
    const csx = x * size;
    // source image y
    const csy = y * size;
    // copied image width.
    const cw = width * size;
    // copied image height.
    const ch = height * size;

    ctx.drawImage(canvas, csx, csy, cw, ch, dx * size, dy * size, cw, ch);
  }
}
