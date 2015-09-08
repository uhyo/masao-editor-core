var React=require('react');

var editActions=require('../../actions/edit');

var Select=require('./util/select.jsx');

module.exports = React.createClass({
    displayName: "ScreenSelect",
    propTypes: {
        edit: React.PropTypes.object.isRequired
    },
    render(){
        var edit=this.props.edit;
        var contents=[
            {
                key:"map",
                value:"マップ編集"
            },
            {
                key:"params",
                value:"param編集"
            }
        ];
        var valueLink={
            value: this.props.edit.screen,
            requestChange: (key)=>{
                editActions.changeScreen({
                    screen: key
                });
            }
        };
        return <div className="me-core-screen-select">
            <Select contents={contents} valueLink={valueLink}/>
        </div>
    },
});

