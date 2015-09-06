//util methods
//
//elementのabsolute position of HTMLElement
function getAbsolutePosition(elm){
    var r=elm.getBoundingClientRect();
    return {
        x: r.left+window.scrollX,
        y: r.top+window.scrollY
    };
}
exports.getAbsolutePosition=getAbsolutePosition;
