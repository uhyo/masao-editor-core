"use strict";
var Reflux=require('reflux');

/*
 * changeParam({
 *   param: string
 *   value: string
 * });
 *
 * resetParams({
 *   [param1]: [value1],...
 * });
 */
module.exports = Reflux.createActions([
    "changeParam",
    "resetParams"
]);
