//params store
var Reflux=require('reflux'),
    masao=require('masao');

module.exports = Reflux.createStore({
    init(){
        this.params = masao.param.addDefaults({});
    },
    getInitialState(){
        return this.params;
    }
});

