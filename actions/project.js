"use strict";
var Reflux=require('reflux');

/*
 * project.changeVersion({
 *   version: string
 * });
 *
 * project.changeScript({
 *   script: string
 * });
 */

module.exports = Reflux.createActions([
    "changeVersion",
    "changeScript"
]);
