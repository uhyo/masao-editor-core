// Promise polyfill polypolypoly-------

const { Promise: P } = require('es6-promise');

const p = 'undefined' !== typeof Promise ? Promise : P;

export default p as typeof Promise;
