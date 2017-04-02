// Scrollable area!
'use strict';
import * as React from 'react';

import * as styles from './scroll.css';

import {
    getAbsolutePosition,
} from '../../../scripts/util';

import MousePad, {
    MousePadEvent,
} from './mousepad';

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

        const hor =
            disableX ? null :
            <div className={styles.horWrap}>
                <div className={styles.leftButton} onClick={this.handlePushButton} data-dir="left"/>
                <div ref="hor" className={styles.hor}>
                    <div ref="horTip" className={styles.horTip} style={horStyle} />
                </div>
                <div className={styles.rightButton} onClick={this.handlePushButton} data-dir="right"/>
            </div>;

        const ver =
            disableY ? null :
            <div className={styles.verWrap}>
                <div className={styles.downButton} onClick={this.handlePushButton} data-dir="up"/>
                <div ref="ver" className={styles.ver}>
                    <div ref="verTip" className={styles.verTip} style={verStyle} />
                </div>
                <div className={styles.upButton} onClick={this.handlePushButton} data-dir="down"/>
            </div>;

        return <div className={styles.outerWrapper}>
            <div className={styles.wrapper}>
                <div className={styles.content}>{children}</div>
                <MousePad
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    >
                    {hor}
                    {ver}
                </MousePad>
            </div>
        </div>;
    }
    handleMouseDown({target, elementX, elementY, preventDefault}: MousePadEvent){

        if (target === this.refs['hor'] || target === this.refs['ver']){
            // 瞬間移動
            console.log('SCROLL', window.scrollX, window.scrollY);
            console.log('TARGET', target.getBoundingClientRect());
            this.doFreeScroll(target, elementX, elementY);
            this.registerFreeScroll(target);
            return;
        }
        if (target === this.refs['horTip'] || target === this.refs['verTip']){
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
            target === this.refs['horTip'] ? this.refs['hor'] as HTMLElement :
            target === this.refs['verTip'] ? this.refs['ver'] as HTMLElement :
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

        if (target === this.refs['hor']){
            // 瞬間移動（横）
            const pos = Math.round(elementX/target_width * (width + screenX) - screenX/2);
            this.setScroll(pos, null);
            return;
        }else if (target === this.refs['ver']){
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

        if (target === this.refs['horTip']){
            const pos = Math.round((px - handX)/parent_width * (width + screenX));
            this.setScroll(pos, null);
        }else if (target === this.refs['verTip']){
            const pos = Math.round((py - handY)/parent_height * (height + screenY));
            this.setScroll(null, pos);
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
