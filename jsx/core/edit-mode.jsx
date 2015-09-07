var React=require('react');

var editActions=require('../../actions/edit');

var Select=require('./util/select.jsx');

module.exports = React.createClass({
    displayName: "EditMode",
    propTypes: {
        edit: React.PropTypes.object.isRequired
    },
    render(){
        var edit=this.props.edit;
        var contents=[
            {
                key:"pen",
                value:"ペンモード"
            },
            {
                key:"hand",
                value:"ハンドモード"
            }
        ];
        var valueLink={
            value: this.props.edit.mode,
            requestChange: (key)=>{
                editActions.changeMode({
                    mode: key
                });
            }
        };
        return <Select contents={contents} valueLink={valueLink}/>;
    },
});
