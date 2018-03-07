'use strict';
import * as React from 'react';

import * as styles from './mousepad.css';

import { getAbsolutePosition } from '../../../scripts/util';

/**
 * 抽象化されたマウスイベント
 */
export interface MousePadEvent {
  /**
   * Target of event.
   */
  target: HTMLElement;
  /**
   * ページ内の位置
   */
  pageX: number;
  /**
   * ページ内の位置
   */
  pageY: number;
  /**
   * 要素の位置からの相対位置
   */
  elementX: number;
  /**
   * 要素の位置からの相対位置
   */
  elementY: number;
  /**
   * 押されたボタン
   */
  button: number | null;
  /**
   * イベントをキャンセルするメソッド
   */
  preventDefault(): void;
}
export interface IPropMousepad {
  /**
   * elementXの補正値
   */
  elementXCorrection?: number;
  /**
   * elementYの補正値
   */
  elementYCorrection?: number;
  /**
   * マウス操作開始イベント
   */
  onMouseDown?(e: MousePadEvent): void;
  /**
   * マウス移動イベント
   */
  onMouseMove?(e: MousePadEvent): void;
  /**
   * マウス操作終了イベント
   */
  onMouseUp?(e: MousePadEvent): void;
  /**
   * クリックイベント（同じ位置で押して話した場合に発生
   */
  onClick?(e: MousePadEvent): void;
}
/**
 * タッチを含めたMouse Eventを抽象化して発生させる領域
 */
export default class MousePad extends React.Component<IPropMousepad, {}> {
  /**
   * Button number of two-fingered touch.
   */
  protected readonly twoButton = 1;
  /**
   * Time to wait before makeing it a one touch.
   */
  protected readonly pendingWait = 150;
  /**
   * Current state of touch.
   */
  private currentTouch: TouchState | null = null;
  private currentTarget: HTMLElement | null = null;
  private currentElmX: number = 0;
  private currentElmY: number = 0;
  /**
   * A flag whether current mouse/touch can be a click.
   */
  protected canBeClick: boolean = false;
  /**
   * Initial x position of mouse.
   */
  protected initialElementX: number = 0;
  /**
   * Initial y position of mouse.
   */
  protected initialElementY: number = 0;
  render() {
    const { children } = this.props;

    const abstractDragStartHandler = (
      target: HTMLElement,
      pageX: number,
      pageY: number,
      button: number | null,
    ) => {
      console.log('abstractDragStartHandler', button);
      const {
        onMouseDown,
        elementXCorrection = 0,
        elementYCorrection = 0,
      } = this.props;

      // 要素
      const { x, y } = getAbsolutePosition(target);

      this.currentTarget = target;
      this.currentElmX = x;
      this.currentElmY = y;
      this.canBeClick = true;

      // マウスイベント開始
      const elementX = pageX - x + elementXCorrection;
      const elementY = pageY - y + elementYCorrection;

      this.initialElementX = elementX;
      this.initialElementY = elementY;

      let prevented = false;
      if (onMouseDown) {
        onMouseDown({
          target: target as HTMLElement,
          pageX,
          pageY,
          elementX,
          elementY,
          button,
          preventDefault() {
            prevented = true;
          },
        });
      }

      return prevented;
    };
    const abstractDragMoveHandler = (
      pageX: number,
      pageY: number,
      button: number | null,
    ) => {
      console.log('abstractDragMoveHandler', button);
      const {
        onMouseMove,
        elementXCorrection = 0,
        elementYCorrection = 0,
      } = this.props;
      if (this.currentTarget == null) {
        return;
      }

      const elementX = pageX - this.currentElmX + elementXCorrection;
      const elementY = pageY - this.currentElmY + elementYCorrection;

      // 最初の位置から一定以上離れたらクリックフラグ解消
      if (
        (elementX - this.initialElementX) ** 2 +
          (elementY - this.initialElementY) ** 2 >=
        25
      ) {
        this.canBeClick = false;
      }

      if (onMouseMove != null) {
        onMouseMove({
          target: this.currentTarget,
          pageX,
          pageY,
          elementX,
          elementY,
          button,
          preventDefault() {},
        });
      }
    };
    const abstractDragEndHandler = (
      pageX: number,
      pageY: number,
      button: number | null,
    ) => {
      console.log('abstractDragEndHandler', button);
      const {
        onMouseUp,
        onClick,
        elementXCorrection = 0,
        elementYCorrection = 0,
      } = this.props;
      if (this.currentTarget == null) {
        return;
      }

      const elementX = pageX - this.currentElmX + elementXCorrection;
      const elementY = pageY - this.currentElmY + elementYCorrection;

      if (onMouseUp) {
        onMouseUp({
          target: this.currentTarget,
          pageX,
          pageY,
          elementX,
          elementY,
          button,
          preventDefault() {},
        });
      }
      if (this.canBeClick && onClick) {
        onClick({
          target: this.currentTarget,
          pageX,
          pageY,
          elementX,
          elementY,
          button,
          preventDefault() {},
        });
      }
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const { pageX, pageY, button } = e;

      e.preventDefault();
      abstractDragMoveHandler(pageX, pageY, button);
    };
    const mouseUpHandler = (e: MouseEvent) => {
      const { pageX, pageY, button } = e;

      abstractDragEndHandler(pageX, pageY, button);
      document.removeEventListener('mousemove', mouseMoveHandler, false);
      document.removeEventListener('mouseup', mouseUpHandler, false);
    };
    const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
      const { target, pageX, pageY, button } = e;

      e.preventDefault();

      const prevented = abstractDragStartHandler(
        target as HTMLElement,
        pageX,
        pageY,
        button,
      );
      if (prevented === false) {
        document.addEventListener('mousemove', mouseMoveHandler, false);
        document.addEventListener('mouseup', mouseUpHandler, false);
      }
    };

    const touchMoveHandler = (e: TouchEvent) => {
      const { changedTouches } = e;
      const { currentTouch } = this;
      if (currentTouch == null) {
        return;
      }

      if (currentTouch.type === 'one') {
        for (const t of Array.from(changedTouches)) {
          if (t.identifier === currentTouch.identifier) {
            // This touch is tracked
            const { pageX, pageY } = t;

            abstractDragMoveHandler(pageX, pageY, null);
            break;
          }
        }
      } else if (currentTouch.type === 'pending') {
        // pendingの状態で移動した場合はさっさとoneに移行
        const { target, identifier, originX, originY, timer } = currentTouch;
        for (const t of Array.from(changedTouches)) {
          if (t.identifier === identifier) {
            const { pageX, pageY } = t;
            // 位置の移動を検出
            if ((pageX - originX) ** 2 + (pageY - originY) ** 2 >= 25) {
              // 移動したとみなす
              this.currentTouch = {
                type: 'one',
                target,
                identifier,
                originX,
                originY,
              };
              clearTimeout(timer);
              const prevented = abstractDragStartHandler(
                target as HTMLElement,
                originX,
                originY,
                null,
              );
              if (prevented) {
                this.currentTouch = null;
                removeTouchEvents();
              } else {
                abstractDragMoveHandler(pageX, pageY, null);
              }
            }
          }
        }
      } else if (currentTouch.type === 'two') {
        // two-or-more-fingers touch.
        const { touches } = currentTouch;
        for (const t of Array.from(changedTouches)) {
          for (let i = 0; i < touches.length; i++) {
            const { identifier, originX, originY } = touches[i];
            if (t.identifier === identifier) {
              const { pageX, pageY } = t;
              if (i === 0) {
                // primary fingerはmouseeventを発生させる
                // originX, Yによる補正
                abstractDragMoveHandler(
                  pageX - originX + currentTouch.originX,
                  pageY - originY + currentTouch.originY,
                  this.twoButton,
                );
              } else {
                // 他はoriginを修正
                touches[i].originX = pageX;
                touches[i].originY = pageY;
              }
            }
          }
        }
      }
    };
    const touchEndHandler = (e: TouchEvent) => {
      const { changedTouches } = e;
      const { currentTouch } = this;
      if (currentTouch == null) {
        return;
      }

      if (currentTouch.type === 'one') {
        for (const t of Array.from(changedTouches)) {
          if (t.identifier === currentTouch.identifier) {
            // touch is removed!
            this.currentTouch = null;
            const { pageX, pageY } = t;
            abstractDragEndHandler(pageX, pageY, null);
            break;
          }
        }
      } else if (currentTouch.type === 'pending') {
        for (const t of Array.from(changedTouches)) {
          if (t.identifier === currentTouch.identifier) {
            // a touch is removed!
            this.currentTouch = null;
            const { pageX, pageY } = t;
            // pending touch have not emitted a event yet.
            abstractDragStartHandler(currentTouch.target, pageX, pageY, null);
            abstractDragEndHandler(pageX, pageY, null);
            break;
          }
        }
      } else if (currentTouch.type === 'two') {
        // a two-fingered touch state remains two-fingered if fingers are removed.
        let pageX: number | null = null;
        let pageY: number | null = null;
        console.log('c', [...currentTouch.touches], changedTouches);
        for (const t of Array.from(changedTouches)) {
          const idx = currentTouch.touches.findIndex(
            ({ identifier }) => identifier === t.identifier,
          );
          if (idx >= 0) {
            // remove this touch.
            const [{ originX, originY }] = currentTouch.touches.splice(idx, 1);
            if (idx === 0 && pageX == null) {
              // this removes the first touch!
              pageX = t.pageX;
              pageY = t.pageY;
              // これまでの移動を蓄積
              currentTouch.originX += pageX - originX;
              currentTouch.originY += pageY - originY;
            }
          }
        }
        // If all touches are removed, close it.
        if (currentTouch.touches.length === 0) {
          this.currentTouch = null;
          // drag endの情報
          if (pageX == null || pageY == null) {
            console.warn('???');
            return;
          }
          abstractDragEndHandler(pageX, pageY, this.twoButton);
        }
      }
      if (this.currentTouch == null) {
        removeTouchEvents();
      }
    };
    /**
     * A function to remove touch events.
     */
    const removeTouchEvents = () => {
      document.removeEventListener('touchmove', touchMoveHandler, false);
      document.removeEventListener('touchend', touchEndHandler, false);
      document.removeEventListener('touchcancel', touchEndHandler, false);
    };
    const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>) => {
      const { target, changedTouches } = e;
      const { currentTouch } = this;

      if (currentTouch == null) {
        e.preventDefault();
        // タッチが無い
        const t = changedTouches[0];
        if (t == null) {
          return;
        }
        const { pageX, pageY } = t;

        // First, this touch is pending.
        // issue a timer to turn this pending touch into a one touch.
        const timer = setTimeout(() => {
          // Turn this into a touch.
          this.currentTouch = {
            type: 'one',
            target: target as HTMLElement,
            identifier: t.identifier,
            originX: pageX,
            originY: pageY,
          };
          const prevented = abstractDragStartHandler(
            target as HTMLElement,
            pageX,
            pageY,
            null,
          );
          // if prevented, cancel.
          if (prevented) {
            this.currentTouch = null;
            removeTouchEvents();
          }
        }, this.pendingWait);
        this.currentTouch = {
          type: 'pending',
          target: target as HTMLElement,
          identifier: t.identifier,
          originX: pageX,
          originY: pageY,
          timer,
        };

        document.addEventListener('touchmove', touchMoveHandler, false);
        document.addEventListener('touchend', touchEndHandler, false);
        document.addEventListener('touchcancel', touchEndHandler, false);
      } else if (currentTouch.type === 'pending') {
        // TwoTouchStateを作成
        const { target, timer, identifier, originX, originY } = currentTouch;
        const touches = [
          {
            identifier,
            originX,
            originY,
          },
        ];
        for (const t of Array.from(changedTouches)) {
          if (t.identifier !== identifier) {
            // 新しいタッチを見つけた
            touches.push({
              identifier: t.identifier,
              originX: t.pageX,
              originY: t.pageY,
            });
          }
        }
        if (touches.length > 1) {
          // 一応ほんとうに新しいタッチがあったかチェック
          e.preventDefault();
          clearTimeout(timer);
          // 2つタッチで起動
          this.currentTouch = {
            type: 'two',
            touches,
            originX,
            originY,
          };

          abstractDragStartHandler(target, originX, originY, this.twoButton);
        }
      } else if (currentTouch.type === 'two') {
        // 予備のタッチを追加
        for (const t of Array.from(changedTouches)) {
          if (
            -1 ===
            currentTouch.touches.findIndex(
              ({ identifier }) => identifier === t.identifier,
            )
          ) {
            currentTouch.touches.push({
              identifier: t.identifier,
              originX: t.pageX,
              originY: t.pageY,
            });
          }
        }
      }
    };

    return (
      <div
        className={styles.pad}
        onMouseDown={mouseDownHandler}
        onTouchStart={touchStartHandler}
      >
        {children}
      </div>
    );
  }
}

/**
 * Initial representation of state of touch.
 */
type TouchState = OneTouchState | PendingOneTouchState | TwoTouchState;

/**
 * There is one active touch.
 */
interface OneTouchState {
  type: 'one';
  /*
   * Target of touch.
   */
  target: HTMLElement;
  /*
   * Touch idenfitier.
   */
  identifier: number;
  /**
   * origin of this touch.
   */
  originX: number;
  /**
   * origin of this touch.
   */
  originY: number;
}
/**
 * There is one but pending touch.
 */
interface PendingOneTouchState {
  type: 'pending';
  /*
   * Target of touch.
   */
  target: HTMLElement;
  /**
   * Touch identifier.
   */
  identifier: number;
  /**
   * timer id to changing in to one touch.
   */
  timer: any;
  /**
   * origin of this touch.
   */
  originX: number;
  /**
   * origin of this touch.
   */
  originY: number;
}

/**
 * There are two (or more) touches.
 */
interface TwoTouchState {
  type: 'two';
  /**
   * tracked touches.
   */
  touches: Array<{
    identifier: number;
    originX: number;
    originY: number;
  }>;
  /**
   * origin of this touch as a whole.
   */
  originX: number;
  /**
   * origin of this touch as a whole.
   */
  originY: number;
}
