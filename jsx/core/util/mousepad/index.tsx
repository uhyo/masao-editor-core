'use strict';
import * as React from 'react';

import * as styles from './mousepad.css';

import { getAbsolutePosition } from '../../../../scripts/util';
import { useMouseState } from './useMouseState';
import { useDocumentMouseEvents } from './useDocumentMouseEvent';

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
   * Whether mouseMove event should be watched.
   * 'auto' means it should be watched when mouse is down.
   */
  useMouseMove: boolean | 'auto';
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
 * Button number of two-fingered touch.
 */
const twoButton = 1;
/**
 * Time to wait before makeing it a one touch.
 */
const pendingWait = 150;

/**
 * タッチを含めたMouse Eventを抽象化して発生させる領域
 */
const MousePad: React.FC<IPropMousepad> = props => {
  const internal = React.useRef<{
    /**
     * Current state of touch.
     */
    currentTouch: TouchState | null;
    currentTarget: HTMLElement | null;
    currentElmX: number;
    currentElmY: number;
    /**
     * A flag of whether mouse is abstractly down now.
     */
    abstractMouseDown: boolean;
    /**
     * A flag whether current mouse/touch can be a click.
     */
    canBeClick: boolean;
    /**
     * Initial x position of mouse.
     */
    initialElementX: number;
    /**
     * Initial y position of mouse.
     */
    initialElementY: number;
  }>({
    currentTouch: null,
    currentTarget: null,
    currentElmX: 0,
    currentElmY: 0,
    abstractMouseDown: false,
    canBeClick: false,
    initialElementX: 0,
    initialElementY: 0,
  });
  const [mouseState, mouseStateDispatch] = useMouseState();

  const { children } = props;

  const abstractDragStartHandler = (
    target: HTMLElement,
    pageX: number,
    pageY: number,
    button: number | null,
  ) => {
    const {
      onMouseDown,
      elementXCorrection = 0,
      elementYCorrection = 0,
    } = props;
    const ic = internal.current;

    // 要素
    const { x, y } = getAbsolutePosition(target);

    ic.abstractMouseDown = true;
    ic.currentTarget = target;
    ic.currentElmX = x;
    ic.currentElmY = y;
    ic.canBeClick = true;

    // マウスイベント開始
    const elementX = pageX - x + elementXCorrection;
    const elementY = pageY - y + elementYCorrection;

    ic.initialElementX = elementX;
    ic.initialElementY = elementY;

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
    const {
      onMouseMove,
      elementXCorrection = 0,
      elementYCorrection = 0,
    } = props;
    const ic = internal.current;
    if (ic.currentTarget == null) {
      return;
    }

    const elementX = pageX - ic.currentElmX + elementXCorrection;
    const elementY = pageY - ic.currentElmY + elementYCorrection;

    // 最初の位置から一定以上離れたらクリックフラグ解消
    const distsq =
      (elementX - ic.initialElementX) ** 2 +
      (elementY - ic.initialElementY) ** 2;
    if (distsq >= 25) {
      ic.canBeClick = false;
    }

    if (onMouseMove != null) {
      onMouseMove({
        target: ic.currentTarget,
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
    const {
      onMouseUp,
      onClick,
      elementXCorrection = 0,
      elementYCorrection = 0,
    } = props;
    const ic = internal.current;
    ic.abstractMouseDown = false;
    if (ic.currentTarget == null) {
      return;
    }

    const elementX = pageX - ic.currentElmX + elementXCorrection;
    const elementY = pageY - ic.currentElmY + elementYCorrection;

    if (onMouseUp) {
      onMouseUp({
        target: ic.currentTarget,
        pageX,
        pageY,
        elementX,
        elementY,
        button,
        preventDefault() {},
      });
    }
    if (ic.canBeClick && onClick) {
      onClick({
        target: ic.currentTarget,
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
    mouseStateDispatch({
      type: 'mouseIsDown',
      value: false,
    });
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
      mouseStateDispatch({
        type: 'mouseIsDown',
        value: true,
      });
    }
  };

  const touchMoveHandler = (e: TouchEvent) => {
    const { changedTouches } = e;
    const ic = internal.current;
    const { currentTouch } = ic;
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
      // pendingの状態で移動した場合はログを取る
      const {
        target,
        identifier,
        originX,
        originY,
        timer,
        moves,
      } = currentTouch;
      for (const t of Array.from(changedTouches)) {
        if (t.identifier === identifier) {
          const { pageX, pageY } = t;
          moves.push({ pageX, pageY });

          // 移動距離が大きい場合はもう移行する
          if ((pageX - originX) ** 2 + (pageY - originY) ** 2 >= 48 ** 2) {
            // 移動したとみなす
            ic.currentTouch = {
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
              ic.currentTouch = null;
              removeTouchEvents();
            } else {
              for (const { pageX, pageY } of moves) {
                abstractDragMoveHandler(pageX, pageY, null);
              }
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
                twoButton,
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
    const ic = internal.current;
    const { currentTouch } = ic;
    if (currentTouch == null) {
      return;
    }

    if (currentTouch.type === 'one') {
      for (const t of Array.from(changedTouches)) {
        if (t.identifier === currentTouch.identifier) {
          // touch is removed!
          ic.currentTouch = null;
          const { pageX, pageY } = t;
          abstractDragEndHandler(pageX, pageY, null);
          break;
        }
      }
    } else if (currentTouch.type === 'pending') {
      for (const t of Array.from(changedTouches)) {
        if (t.identifier === currentTouch.identifier) {
          // a touch is removed!
          ic.currentTouch = null;
          const { pageX, pageY } = t;
          // pending touch have not emitted a event yet.
          abstractDragStartHandler(currentTouch.target, pageX, pageY, null);
          abstractDragEndHandler(pageX, pageY, null);
          clearTimeout(currentTouch.timer);
          break;
        }
      }
    } else if (currentTouch.type === 'two') {
      // a two-fingered touch state remains two-fingered if fingers are removed.
      let pageX: number | null = null;
      let pageY: number | null = null;
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
        ic.currentTouch = null;
        // drag endの情報
        if (pageX == null || pageY == null) {
          console.warn('???');
          return;
        }
        abstractDragEndHandler(pageX, pageY, twoButton);
      }
    }
    if (ic.currentTouch == null) {
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
    const ic = internal.current;
    const { currentTouch } = ic;

    e.preventDefault();
    if (currentTouch == null) {
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
        ic.currentTouch = {
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
          ic.currentTouch = null;
          removeTouchEvents();
        }
      }, pendingWait);
      ic.currentTouch = {
        type: 'pending',
        target: target as HTMLElement,
        identifier: t.identifier,
        originX: pageX,
        originY: pageY,
        timer,
        moves: [],
      };

      document.addEventListener('touchmove', touchMoveHandler, false);
      document.addEventListener('touchend', touchEndHandler, false);
      document.addEventListener('touchcancel', touchEndHandler, false);
    } else if (currentTouch.type === 'pending') {
      // TwoTouchStateを作成
      const {
        target,
        timer,
        identifier,
        originX,
        originY,
        moves,
      } = currentTouch;
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
        ic.currentTouch = {
          type: 'two',
          touches,
          originX,
          originY,
        };

        abstractDragStartHandler(target, originX, originY, twoButton);
        // いままでのタッチを反映
        for (const { pageX, pageY } of moves) {
          abstractDragMoveHandler(pageX, pageY, twoButton);
        }
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

  useDocumentMouseEvents({
    mouseMove:
      props.useMouseMove === 'auto'
        ? mouseState.mouseIsDown
        : props.useMouseMove,
    mouseUp: mouseState.mouseIsDown,
    onMouseMove: mouseMoveHandler,
    onMouseUp: mouseUpHandler,
  });

  return (
    <div
      className={styles.pad}
      onMouseDown={mouseDownHandler}
      onTouchStart={touchStartHandler}
    >
      {children}
    </div>
  );
};
export default MousePad;

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
  /**
   * List of pending movements.
   */
  moves: Array<{ pageX: number; pageY: number }>;
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
