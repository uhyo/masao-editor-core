"use strict";
var Reflux=require('reflux');

var projectActions=require('../actions/project');

module.exports = Reflux.createStore({
    listenables: projectActions,
    init(){
        //default version
        this.version="fx16";
    },
    getInitialState(){
        return this.makeState();
    },
    makeState(){
        return {
            version: this.version
        };
    },
    onChangeVersion({version}){
        this.version=version;
        this.trigger(this.makeState());
    }
});
