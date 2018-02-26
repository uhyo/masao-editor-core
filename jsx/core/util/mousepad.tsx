'use strict';
import * as React from 'react';

import * as styles from './mousepad.css';

import {
    getAbsolutePosition,
} from '../../../scripts/util';

/**
 * 抽象化されたマウスイベント
 */
export interface MousePadEvent{
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
export interface IPropMousepad{
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
export default class MousePad extends React.Component<IPropMousepad, {}>{
    private currentIdentifier: number | null = null;
    private currentTarget: HTMLElement;
    private currentElmX: number;
    private currentElmY: number;
    /**
     * A flag whether current mouse/touch can be a click.
     */
    protected canBeClick: boolean = false;
    /**
     * Initial x position of mouse.
     */
    protected initialElementX: number;
    /**
     * Initial y position of mouse.
     */
    protected initialElementY: number;
    render(){
        const {
            children,
        } = this.props;

        const abstractDragStartHandler = (target: HTMLElement, pageX: number, pageY: number, button: number | null)=>{
            const {
                onMouseDown,
                elementXCorrection = 0,
                elementYCorrection = 0,
            } = this.props;

            // 要素
            const {
                x,
                y,
            } = getAbsolutePosition(target);

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
            if (onMouseDown){
                onMouseDown({
                    target: target as HTMLElement,
                    pageX,
                    pageY,
                    elementX,
                    elementY,
                    button,
                    preventDefault(){
                        prevented = true;
                    },
                });
            }

            return prevented;
        };
        const abstractDragMoveHandler = (pageX: number, pageY: number, button: number | null)=>{
            const {
                onMouseMove,
                elementXCorrection = 0,
                elementYCorrection = 0,
            } = this.props;

            const elementX = pageX - this.currentElmX + elementXCorrection;
            const elementY = pageY - this.currentElmY + elementYCorrection;

            // 最初の位置から一定以上離れたらクリックフラグ解消
            if ((elementX - this.initialElementX) ** 2 + (elementY - this.initialElementY) ** 2 >= 25) {
                this.canBeClick = false;
            }

            if (onMouseMove != null){
                onMouseMove({
                    target: this.currentTarget,
                    pageX,
                    pageY,
                    elementX,
                    elementY,
                    button,
                    preventDefault(){},
                });
            }
        };
        const abstractDragEndHandler = (pageX: number, pageY: number, button: number | null)=>{
            const {
                onMouseUp,
                onClick,
                elementXCorrection = 0,
                elementYCorrection = 0,
            } = this.props;

            const elementX = pageX - this.currentElmX + elementXCorrection;
            const elementY = pageY - this.currentElmY + elementYCorrection;

            if (onMouseUp){
                onMouseUp({
                    target: this.currentTarget,
                    pageX,
                    pageY,
                    elementX,
                    elementY,
                    button,
                    preventDefault(){},
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
                    preventDefault(){},
                });
            }
        };

        const mouseMoveHandler = (e: MouseEvent)=>{
            const {
                pageX,
                pageY,
                button,
            } = e;

            e.preventDefault();
            abstractDragMoveHandler(pageX, pageY, button);
        };
        const mouseUpHandler = (e: MouseEvent)=>{
            const {
                pageX,
                pageY,
                button,
            } = e;

            abstractDragEndHandler(pageX, pageY, button);
            document.removeEventListener('mousemove', mouseMoveHandler, false);
            document.removeEventListener('mouseup', mouseUpHandler, false);
        };
        const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>)=>{
            const {
                target,
                pageX,
                pageY,
                button,
            } = e;

            e.preventDefault();

            const prevented = abstractDragStartHandler(target as HTMLElement, pageX, pageY, button);
            if (prevented === false){
                document.addEventListener('mousemove', mouseMoveHandler, false);
                document.addEventListener('mouseup', mouseUpHandler, false);
            }
        };

        const touchMoveHandler = (e: TouchEvent)=>{
            const {
                changedTouches,
            } = e;
            
            for (let i = 0, l = changedTouches.length; i < l; i++){
                const t = changedTouches[i];
                if (t.identifier !== this.currentIdentifier){
                    continue;
                }
                const {
                    pageX,
                    pageY,
                } = t;

                abstractDragMoveHandler(pageX, pageY, null);

                break;
            }
        };
        const touchEndHandler = (e: TouchEvent)=>{
            const {
                changedTouches,
            } = e;
            
            for (let i = 0, l = changedTouches.length; i < l; i++){
                const t = changedTouches[i];
                if (t.identifier !== this.currentIdentifier){
                    continue;
                }
                this.currentIdentifier = null;
                const {
                    pageX,
                    pageY,
                } = t;

                abstractDragEndHandler(pageX, pageY, null);
                document.removeEventListener('touchmove', touchMoveHandler, false);
                document.removeEventListener('touchend', touchEndHandler, false);
                document.removeEventListener('touchcancel', touchEndHandler, false);

                break;
            }
        };
        const touchStartHandler = (e: React.TouchEvent<HTMLDivElement>)=>{
            const {
                target,
                changedTouches,
            } = e;

            if (this.currentIdentifier != null){
                // すでにタッチがある場合は無視
                return;
            }
            e.preventDefault();


            for (let i = 0, l = changedTouches.length; i < l; i++){
                const t = changedTouches[i];

                const {
                    pageX,
                    pageY,
                } = t;

                const prevented = abstractDragStartHandler(target as HTMLElement, pageX, pageY, null);

                if (prevented === false){
                    this.currentIdentifier = t.identifier;

                    document.addEventListener('touchmove', touchMoveHandler, false);
                    document.addEventListener('touchend', touchEndHandler, false);
                    document.addEventListener('touchcancel', touchEndHandler, false);
                }
                break;
            }
        };

        return <div
            className={styles.pad}
            onMouseDown={mouseDownHandler}
            onTouchStart={touchStartHandler}
            >
            {children}
        </div>;
    }
}
