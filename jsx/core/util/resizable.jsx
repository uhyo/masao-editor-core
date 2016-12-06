"use strict";
var React=require('react');

const Resizable = require('react-resizable-box');

import styles from './resizable.css';

export default class ResizableBox extends React.Component{
    constructor(props){
        super(props);
        this.onResize = this.onResize.bind(this);

        this.prev_width = props.width;
        this.prev_height = props.height;
    }
    onResize(direction, styleSize, clientSize, delta){
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
        } = styleSize;
        if ((width !== prev_width || height !== prev_height) && onResize){
            this.prev_width = width;
            this.prev_height = height;
            onResize(width, height);
        }
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
                width={width} height={height} minWidth={minWidth} minHeight={minHeight} grid={gr}
                isResizable={{left: false, top: false, right: true, bottom: true, topLeft: false, topRight: false, bottomLeft: false, bottomRight: true}}
                onResize={this.onResize}>
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
ResizableBox.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    minWidth: React.PropTypes.number,
    minHeight: React.PropTypes.number,
    grid: React.PropTypes.shape({
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
    }),
    onResize: React.PropTypes.func,
};


