//map store
var Reflux=require('reflux');

module.exports = Reflux.createStore({
    init(){
        //init project
        this.map=this.initMap();
    },
    initMap(){
        var result=[];
        for(let i=0;i < 30;i++){
            let r2=[];
            for(let j=0;j < 180;j++){
                r2.push(".");
            }
            result.push(r2);
        }
        return result;
    },
    getInitialState(){
        return this.map;
    }
});
