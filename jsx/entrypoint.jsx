"use strict";
var React=require('react');
var ReactDOM = require('react-dom');

var Front=require('./front/index.jsx');

var id="app";

document.addEventListener("DOMContentLoaded",(e)=>{
    var apparea=document.getElementById(id);

    var root=<Front/>;

    ReactDOM.render(root,apparea);
});
