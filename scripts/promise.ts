// Promise polyfill polypolypoly-------

const {
    Promise: P,
} = require('es6-promise');


const p = 'Promise' in this ? Promise : P;

export default p as typeof Promise;

