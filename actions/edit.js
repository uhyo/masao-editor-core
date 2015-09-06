//edit actions
var Reflux=require('reflux');

// edit.changePen({
//   pen: string
//});
//
// edit.mouseDown({
//   x: number,
//   y: number
//});
//
// edit.mouseUp()

module.exports = Reflux.createActions({
    "changePen": {
        preEmit: (obj)=>{
            if(obj==null){
                return {pen: "."};
            }else if(obj.pen==null){
                return {pen: "."};
            }
            return;
        }
    },
    "mouseDown": {},
    "mouseUp": {}
});
