"use strict";
//map store
var Reflux=require('reflux');
var extend=require('extend');

var mapActions = require('../actions/map'),
    paramActions=require('../actions/params');

module.exports = Reflux.createStore({
    listenables: [mapActions,{changeParams: paramActions.changeParams}],
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
    onChangeParams(params){
        //mapに対する変更があったら検知する
        var newMap=this.map.map((st)=>{
            return st.map((row)=>{
                return row.concat([]);
            });
        });
        for (let h = 0; h < 4; h++) {
            let ssfx = ["", "-s", "-t", "-f"][h];
            for (let i = 0; i < 3; i++) {
                for(let j=0; j < 30; j++){
                    let p=params[`map${i}-${j}${ssfx}`];
                    if(p!=null){
                        for(let k=0; k < 60; k++){
                            newMap[h][j][i*60+k] = p.charAt(k) || ".";
                        }
                    }
                }
            }
        }
        this.map=newMap;
        this.trigger(newMap);
    }
});
