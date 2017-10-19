"use strict";
import * as React from 'react';

import Resizable from 're-resizable';

import * as styles from './resizable.css';

export interface IPropResizableBox{
    width: number;
    height: number;

    minWidth?: number;
    minHeight?: number;

    grid: {
        x: number;
        y: number;
    };
    onResize(width: number, height: number): void;
}
export default class ResizableBox extends React.Component<IPropResizableBox, {}>{
    // 変化前の大きさ
    private prev_width: number;
    private prev_height: number;
    constructor(props: IPropResizableBox){
        super(props);
        this.onResize = this.onResize.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);

        this.prev_width = props.width;
        this.prev_height = props.height;
    }
    onResize(_event: any, _direction: any, _ref: any, delta: {width: number; height: number}){
        const {
            props: {
                onResize,
            },
            prev_width,
            prev_height,
        } = this;
        const {
            width,
            height,
        } = delta;
        if ((width !== 0 || height !== 0) && onResize){
            onResize(prev_width + width, prev_height + height);
        }
    }
    onResizeStop(_event: any, _direction: any, _ref: any, delta: {width: number; height: number}){
        const {
            width,
            height,
        } = delta;
        this.prev_width += width;
        this.prev_height += height;
    }
    render(){
        const {
            width,
            height,
            minWidth,
            minHeight,
            grid,
            children,
        } = this.props;
        const gr = grid ? [grid.x, grid.y] : void 0;
        return <div className={styles.wrapper}>
            <Resizable
                size={{width, height}}
                minWidth={minWidth} minHeight={minHeight} grid={gr}
                enable={{left: false, top: false, right: true, bottom: true, topLeft: false, topRight: false, bottomLeft: false, bottomRight: true}}
                onResize={this.onResize}
                onResizeStop={this.onResizeStop}>
                <div className={styles.container}>
                    {children}
                </div>
                <div className={styles.handleRight}/>
                <div className={styles.handleBottom}/>
                <div className={styles.handleCorner}/>
            </Resizable>
        </div>;
    }
};


