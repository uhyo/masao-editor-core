var React=require('react');

var editActions=require('../../actions/edit');

module.exports = React.createClass({
    displayName: "EditMode",
    propTypes: {
        edit: React.PropTypes.object.isRequired
    },
    render(){
        var edit=this.props.edit;
        var as={
            pen: "ペンモード",
            hand: "ハンドモード"
        };
        return <div className="me-core-edit-mode">{
            Object.keys(as).map((key)=>{
                var c="me-core-edit-mode-button";
                if(key===edit.mode){
                    c+=" me-core-edit-mode-current";
                }
                return <div className={c} key={key} onClick={this.handleClick(key)}>{
                    as[key]
                }</div>;
            })
        }</div>;
    },
    handleClick(key){
        return (e)=>{
            e.preventDefault();
            editActions.changeMode({
                mode: key
            });
        };
    }
});
