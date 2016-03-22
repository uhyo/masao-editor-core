"use strict";
var Reflux=require('reflux');

var projectActions=require('../actions/project');

// version: ["2.8","fx16","kani2"]
// script: string

module.exports = Reflux.createStore({
    listenables: projectActions,
    init(){
        //default version
        this.version="fx16";
        this.script="";
    },
    getInitialState(){
        return this.makeState();
    },
    makeState(){
        return {
            version: this.version,
            script: this.script
        };
    },
    onChangeVersion({version}){
        this.version=version;
        this.trigger(this.makeState());
    },
    onChangeScript({script}){
        this.script=script;
        this.trigger(this.makeState());
    }
});
