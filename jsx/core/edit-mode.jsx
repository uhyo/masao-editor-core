var React=require('react');

var editActions=require('../../actions/edit');

var Select=require('./util/select.jsx'),
    Switch=require('./util/switch.jsx');

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
                key:"eraser",
                value:"イレイサーモード"
            },
            {
                key:"hand",
                value:"ハンドモード"
            },
            {
                key:"spuit",
                value:"スポイト"
            }
        ];
        var mode_valueLink={
            value: this.props.edit.mode,
            requestChange: (key)=>{
                editActions.changeMode({
                    mode: key
                });
            }
        };
        var grid_valueLink={
            value: this.props.edit.grid,
            requestChange: (grid)=>{
                editActions.changeGrid({
                    grid
                });
            }
        };
        return <div className="me-core-edit-mode">
            <div>
                <Select contents={contents} valueLink={mode_valueLink}/>
            </div>
            <div>
                <Switch label="グリッドを表示" valueLink={grid_valueLink}/>
            </div>
        </div>
    },
});
