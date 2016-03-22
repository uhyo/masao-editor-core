"use strict";
//edit actions
var Reflux=require('reflux');

// edit.changeScreen({
//   screen: string
// });

// edit.changeStage({
//   stage: number,
// });
// edit.changeMode({
//   mode: string
// });
//
// edit.changePen({
//   pen: string
// });
// edit.changePenLayer({
//   pen: string
// });
//
// edit.changeParamType({
//   param_type: string
// });
//
// edit.changeGrid({
//   grid: boolean
// });
//
// edit.changeRenderMode({
//   render_map?: boolean,
//   render_layer?: boolean
// });
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
//
//
// edit.jsConfirm({
//   confirm: boolean
// });

module.exports = Reflux.createActions({
    "changeScreen": {},
    "changeStage": {},
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
    "changePenLayer": {
        preEmit: (obj)=>{
            if(obj==null){
                return {
                    pen: ".."
                };
            }else if(obj.pen==null){
                return {pen: ".."};
            }
            return;
        }
    },
    "changeParamType": {},
    "changeGrid": {},
    "changeRenderMode": {},
    "mouseDown": {},
    "mouseUp": {},
    "scroll": {},
    "jsConfirm": {}
});
