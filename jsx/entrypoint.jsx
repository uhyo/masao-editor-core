"use strict";
const React=require('react');
const ReactDOM = require('react-dom');

const Front=require('./front/index.jsx');

const id="app";

document.addEventListener("DOMContentLoaded",(e)=>{
    const apparea=document.getElementById(id);

    const root=<Front/>;

    ReactDOM.render(root, apparea);
});
