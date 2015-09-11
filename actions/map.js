"use strict";
var Reflux=require('reflux');

//map.updateMap({
//  stage: number,
//  x: number,
//  y: number,
//  chip: string
//});
//map.updateLayer({
//  stage: number,
//  x: number,
//  y: number,
//  chip: strinp
//});

module.exports = Reflux.createActions([
    "updateMap",
    "updateLayer"
]);
