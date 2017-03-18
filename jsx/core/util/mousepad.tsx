'use strict';
import * as React from 'react';

import * as styles from './mousepad.css';

import {
    getAbsolutePosition,
} from '../../../scripts/util';

// Mouse Eventを抽象化してくれる
export interface MousePadEvent{
    target: HTMLElement;
    pageX: number;
    pageY: number;
    // 要素の位置からの相対
    elementX: number;
    elementY: number;
    // ボタン
    button: number | null;
    // キャンセル
    preventDefault(): void;
}
export interface IPropMousepad{
    onMouseDown?(e: MousePadEvent): void;
    onMouseMove?(e: MousePadEvent): void;
    onMouseUp?(e: MousePadEvent): void;
}
export default class MousePad extends React.Component<IPropMousepad, {}>{
    private currentIdentifier: number | null = null;
    private currentTarget: HTMLElement;
    private currentElmX: number;
    private currentElmY: number;
    render(){
        const {
            children,
            onMouseDown,
            onMouseMove,
            onMouseUp,
        } = this.props;

        const abstractDragStartHandler = (target: HTMLElement, pageX: number, pageY: number, button: number | null)=>{
            // 要素
            const {
                x,
                y,
            } = getAbsolutePosition(target);

            this.currentTarget = target;
            this.currentElmX = x;
            this.currentElmY = y;

            // マウスイベント開始
            const elementX = pageX - x;
            const elementY = pageY - y;

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
            const elementX = pageX - this.currentElmX;
            const elementY = pageY - this.currentElmY;

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
            const elementX = pageX - this.currentElmX;
            const elementY = pageY - this.currentElmY;

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
