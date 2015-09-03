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
        //TODO: sample
        result[25]="....12..I......"+result[25].slice(15);
        result[28]="A...B.G.33OOOOO"+result[28].slice(15);
        result[29]="abcdefghijzkmno"+result[29].slice(15);
        return result;
    },
    getInitialState(){
        return this.map;
    }
});
