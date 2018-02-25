// Scrollable area!
'use strict';
import * as React from 'react';

import * as styles from './scroll.css';

import {
    getAbsolutePosition,
} from '../../../scripts/util';
import {
    getDelta,
} from '../../../scripts/wheel';

import MousePad, {
    MousePadEvent,
} from './mousepad';
import {
    WithRandomIds,
} from './with-ids';

export interface IPropScroll{
    /**
     * scroll area x
     */
    width: number;
    /**
     * scroll area y
     */
    height: number;
    /**
     * current position x
     */
    x: number;
    /**
     * current position y
     */
    y: number;
    /**
     * screen size x
     */
    screenX: number;
    /**
     * screen size y
     */
    screenY: number;
    /**
     * event handler
     */
    onScroll: (x: number, y: number)=>void;
    /**
     * disable x bar
     */
    disableX?: boolean;
    /**
     * disable y bar
     */
    disableY?: boolean;
    /**
     * Size (in pixel) of scroll control.
     */
    controlSize?: number;
    /**
     * Fit x-asis to parent.
     */
    'fit-x'?: boolean;
    /**
     * Fit y-axis to parent.
     */
    'fit-y'?: boolean;
}

export default class Scroll extends React.Component<IPropScroll, {}>{
    /**
     * マウスが押されているフラグ
     */
    private mouse_flag: boolean = false;
    /**
     * Free Scroll対象
     */
    private fsc_target: HTMLElement | null = null;
    /**
     * Hand Scroll対象
     */
    private hsc_target: HTMLElement | null = null;
    /**
     * Hand Scrollの親
     */
    private hsc_parent: HTMLElement | null = null;
    /**
     * Wrapper of horizontal scroll bar
     */
    private horWrapper: HTMLElement | null = null;
    /**
     * Wrapper of vertical scroll bar
     */
    private verWrapper: HTMLElement | null = null;
    /**
     * Area of horizontal scroll bar
     */
    private horArea: HTMLElement | null = null;
    /**
     * Area of vertical scroll bar
     */
    private verArea: HTMLElement | null = null;
    /**
     * Handle of horizontal scroll bar
     */
    private horTip: HTMLElement | null = null;
    /**
     * Handle of vertical scroll bar
     */
    private verTip: HTMLElement | null = null;
    /**
     * Ref to main content wrapper.
     */
    private mainWrapper: HTMLElement | null = null;
    /**
     * Hand Scrollのつかんだ位置 x
     */
    private hsc_x: number = -1;
    /**
     * Hand Scrollのつかんだ位置 y
     */
    private hsc_y: number = -1;
    constructor(props: IPropScroll){
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handlePushButton = this.handlePushButton.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }
    render(){
        const {
            props: {
                children,

                width,
                height,
                x,
                y,
                screenX,
                screenY,
                disableX = false,
                disableY = false,
                controlSize = 16,
                // 'fit-x': fitx = false,
                // 'fit-y': fity = false,
            },
        } = this;

        const vw = width + screenX;
        const vh = height + screenY;

        const horStyle = {
            width: `${(100*screenX/vw).toFixed(3)}%`,
            left: `${(100*x/vw).toFixed(3)}%`,
        };

        const verStyle = {
            height: `${(100*screenY/vh).toFixed(3)}%`,
            top: `${(100*y/vh).toFixed(3)}%`,
        };

        const wrapperStyle: Record<string, string> = {
            '--control-width': `${controlSize}px`,
        };
        /*
        if (fitx) {
            wrapperStyle.width = 'calc(100% - var(--control-width))';
        }
        if (fity) {
            wrapperStyle.height = 'calc(100% - var(--control-width))';
        }
         */

        return (
            <WithRandomIds
                names={['main']}
            >{
                ({main})=> {
                    const hor =
                        disableX ? null :
                        (<div
                            role='scrollbar'
                            aria-controls={main}
                            aria-orientation='horizontal'
                            aria-valuemax={width}
                            aria-valuemin={0}
                            aria-valuenow={x}
                            ref={e=> this.horWrapper = e}
                            className={styles.horWrap}
                            onWheel={this.handleWheel}
                        >
                            <div className={styles.leftButton} onClick={this.handlePushButton} data-dir="left"/>
                            <div
                                ref={e=> this.horArea=e}
                                className={styles.hor}
                            >
                                <div
                                    ref={e=> this.horTip = e}
                                    className={styles.horTip}
                                    style={horStyle}
                                />
                            </div>
                            <div className={styles.rightButton} onClick={this.handlePushButton} data-dir="right"/>
                        </div>);

                        const ver =
                        disableY ? null :
                        (<div
                            role='scrollbar'
                            aria-controls={main}
                            aria-orientation='vertical'
                            aria-valuemax={height}
                            aria-valuemin={0}
                            aria-valuenow={y}
                            ref={e=> this.verWrapper = e}
                            className={styles.verWrap}
                            onWheel={this.handleWheel}
                        >
                            <div className={styles.downButton} onClick={this.handlePushButton} data-dir="up"/>
                            <div
                                ref={e=> this.verArea=e}
                                className={styles.ver}
                            >
                                <div
                                    ref={e=> this.verTip = e}
                                    className={styles.verTip}
                                    style={verStyle}
                                />
                            </div>
                            <div className={styles.upButton} onClick={this.handlePushButton} data-dir="down"/>
                        </div>);

                        return (<div className={styles.outerWrapper} style={wrapperStyle}>
                            <div className={styles.wrapper}>
                                <div
                                    ref={e=> this.mainWrapper = e}
                                    id={main}
                                    className={styles.content}
                                    onWheel={this.handleWheel}
                                >
                                    {children}
                                </div>
                                <MousePad
                                    onMouseDown={this.handleMouseDown}
                                    onMouseMove={this.handleMouseMove}
                                    onMouseUp={this.handleMouseUp}
                                >
                                    {hor}
                                    {ver}
                                </MousePad>
                            </div>
                        </div>);
                }
            }</WithRandomIds>);
    }
    handleMouseDown({target, elementX, elementY, preventDefault}: MousePadEvent){

        if (target === this.horArea || target === this.verArea){
            // 瞬間移動
            this.doFreeScroll(target, elementX, elementY);
            this.registerFreeScroll(target);
            return;
        }
        if (target === this.horTip || target === this.verTip){
            // つかんで移動
            this.registerHandScroll(target, elementX, elementY);
            return;
        }
        preventDefault();
    }
    handleMouseMove({pageX, pageY, elementX, elementY}: MousePadEvent){
        if (this.fsc_target != null){
            this.doFreeScroll(this.fsc_target, elementX, elementY);
        }else if (this.hsc_target != null){
            this.doHandScroll(this.hsc_target, pageX, pageY, this.hsc_parent, this.hsc_x, this.hsc_y);
        }
    }
    handleMouseUp(){
        // free scrollを解除
        if (this.mouse_flag === true){
            this.mouse_flag = false;

            this.fsc_target = null;
            this.hsc_target = null;
        }
    }

    // mouseMoveの処理をregister
    registerFreeScroll(target: HTMLElement){
        this.fsc_target = target;
        if (this.mouse_flag === false){
            this.mouse_flag = true;
        }
    }
    registerHandScroll(target: HTMLElement, elementX: number, elementY: number){
        this.hsc_target = target;
        this.hsc_parent =
            target === this.horTip ? this.horArea as HTMLElement :
            target === this.verTip ? this.verArea as HTMLElement :
            null;
        this.hsc_x = elementX;
        this.hsc_y = elementY;
        if (this.mouse_flag === false){
            this.mouse_flag = true;
        }
    }
    handlePushButton<T>(e: React.MouseEvent<T>){
        e.preventDefault();
        const dir = (e.target as HTMLElement).dataset['dir'];
        switch (dir){
            case 'left':
                this.setScroll(this.props.x-1, null);
                break;
            case 'right':
                this.setScroll(this.props.x+1, null);
                break;
            case 'up':
                this.setScroll(null, this.props.y-1);
                break;
            case 'down':
                this.setScroll(null, this.props.y+1);
                break;
        }
    }


    // スクロールを処理
    doFreeScroll(target: HTMLElement, elementX: number, elementY: number){
        const {
            props: {
                width,
                height,
                screenX,
                screenY,
            },
        } = this;
        const {
            width: target_width,
            height: target_height,
        } = getAbsolutePosition(target);

        if (target === this.horArea){
            // 瞬間移動（横）
            const pos = Math.round(elementX/target_width * (width + screenX) - screenX/2);
            this.setScroll(pos, null);
            return;
        }else if (target === this.verArea){
            // 瞬間移動（縦）
            const pos = Math.round(elementY/target_height * (height + screenY) - screenY/2);
            this.setScroll(null, pos);
            return;
        }
    }
    doHandScroll(target: HTMLElement | null, pageX: number, pageY: number, parent: HTMLElement | null, handX: number, handY: number){
        if (target == null || parent == null){
            return;
        }
        const {
            props: {
                width,
                height,
                screenX,
                screenY,
            },
        } = this;
        const {
            x: parent_x,
            y: parent_y,
            width: parent_width,
            height: parent_height,
        } = getAbsolutePosition(parent);
        // バー内での位置

        const px = pageX - parent_x;
        const py = pageY - parent_y;

        if (target === this.horTip){
            const pos = Math.round((px - handX)/parent_width * (width + screenX));
            this.setScroll(pos, null);
        }else if (target === this.verTip){
            const pos = Math.round((py - handY)/parent_height * (height + screenY));
            this.setScroll(null, pos);
        }
    }
    handleWheel(e: React.WheelEvent<HTMLDivElement>){
        const {
            currentTarget,
        } = e;
        if (currentTarget === this.horWrapper){
            // 横スクロールバー
            e.preventDefault();
            const {
                x,
                y,
            } = getDelta(e);
            const sc = this.props.x + (y ? y : x);
            this.setScroll(sc, null);
        }else if (currentTarget === this.verWrapper){
            // 縦スクロールバー
            e.preventDefault();
            const {
                x,
                y,
            } = getDelta(e);
            const sc = this.props.y + (y ? y : x);
            this.setScroll(null, sc);
        }else if (currentTarget === this.mainWrapper) {
            // メイン画面上でのホイール操作
            e.preventDefault();
            const {
                x,
                y,
            } = getDelta(e);
            const scx = this.props.x + x;
            const scy = this.props.y + y;
            this.setScroll(scx, scy);
        }
            
    }
    // スクロールを伝達
    setScroll(nx: number | null, ny: number | null){
        const {
            x,
            y,
            width,
            height,
            onScroll,
        } = this.props;
        const x2 = nx != null ? Math.max(0, Math.min(width, nx)) : x;
        const y2 = ny != null ? Math.max(0, Math.min(height, ny)) : y;
        if (x !== x2 || y !== y2){
            // 変更あり
            onScroll(x2, y2);
        }
    }
}
