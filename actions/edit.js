//edit actions
var Reflux=require('reflux');

// edit.changeMode({
//   mode: string
// });
//
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
//
// edit.scroll({
//   x: number,
//   y: number
// });

module.exports = Reflux.createActions({
    "changeMode": {},
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
    "mouseUp": {},
    "scroll": {}
});
