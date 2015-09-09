"use strict";
//params store
var Reflux=require('reflux'),
    extend=require('extend'),
    masao=require('masao');

var paramActions=require('../actions/params');

module.exports = Reflux.createStore({
    listenables: paramActions,
    init(){
        this.params = masao.param.addDefaults({});
    },
    getInitialState(){
        return this.params;
    },
    onChangeParam({param,value}){
        this.params = extend({},this.params, {
            [param]: value
        });
        this.trigger(this.params);
    },
    onChangeParams(obj){
        this.params = extend({},this.params, obj);
        this.trigger(this.params);
    }
});

