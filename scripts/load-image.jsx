//load image script
var Promise=require('native-promise-only');

var loaded={};

//load
module.exports = function(src){
    if(loaded[src]){
        return Promise.resolve(loaded[src]);
    }
    return new Promise((fulfill,reject)=>{
        var img=new Image();
        img.src=src;
        img.addEventListener("load",(e)=>{
            loaded[src]=img;
            fulfill(img);
        });
        img.addEventListener("error",(e)=>{
            reject("Failed to load "+src);
        });
    });
}
