"use strict";
var Reflux=require('reflux');

/*
 * changeParam({
 *   param: string
 *   value: string
 * });
 *
 * changeParams({
 *   [param1]: [value1],...
 * });
 *
 * resetParams({
 *   [param1]: [value1],...
 * });
 */
module.exports = Reflux.createActions([
    "changeParam",
    "changeParams",
    "resetParams"
]);
