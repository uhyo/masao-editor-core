var React=require('react');

var editActions=require('../../actions/edit');

var Select=require('./util/select.jsx'),
    Switch=require('./util/switch.jsx');

module.exports = React.createClass({
    displayName: "EditMode",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        map: React.PropTypes.array.isRequired
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
        ], contents2=[
            {
                key: "1",
                value: "ステージ1"
            },
            {
                key: "2",
                value: "ステージ2"
            },
            {
                key: "3",
                value: "ステージ3"
            },
            {
                key: "4",
                value: "ステージ4"
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
        var stage_valueLink={
            value: String(this.props.edit.stage),
            requestChange: (key)=>{
                editActions.changeStage({
                    stage: Number(key),
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
            <div>
                <Select contents={contents2} valueLink={stage_valueLink}/>
            </div>
        </div>
    },
});
