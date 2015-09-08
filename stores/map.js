//map store
var Reflux=require('reflux');

var mapActions = require('../actions/map'),
    editActions= require('../actions/edit');

module.exports = Reflux.createStore({
    listenables: [mapActions],
    init(){
        //init project
        this.map=[0,1,2,3].map((st)=>{
            return this.initStage(st+1);
        });
    },
    initStage(stage){
        var result=[];
        for(let i=0;i < 30;i++){
            let r2=[];
            for(let j=0;j < 180;j++){
                r2.push(".");
            }
            result.push(r2);
        }
        if(stage===1){
            //TODO: sample
            result[25]="....12..I......".split("").concat(result[25].slice(15));
            result[28]="A...B.G.33OOOOO".split("").concat(result[28].slice(15));
            result[29]="abcdefghijzkmno".split("").concat(result[29].slice(15));
        }
        return result;
    },
    getInitialState(){
        return this.map;
    },

    onUpdateMap({stage,x,y,chip}){
        let st=this.map[stage-1];
        if(st){
            let row=st[y];
            if(row){
                if(row[x]===chip){
                    //変わっていない
                    return;
                }
                this.map = this.map.map((st,i)=>{
                    if(i===stage-1){
                        return st.map((a,i)=>{
                            if(i===y){
                                return a.map((c,i)=>{
                                    if(i===x){
                                        return chip;
                                    }else{
                                        return c;
                                    }
                                });
                            }else{
                                return a;
                            }
                        });
                    }else{
                        return st;
                    }
                });
                this.trigger(this.map);
            }
        }
    },
});
