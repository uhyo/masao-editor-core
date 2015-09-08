var React=require('react'),
    masao=require('masao');

var paramActions=require('../../actions/params');

module.exports = React.createClass({
    displayName: "ParamEdit",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired
    },
    render(){
        var data=masao.param.data, params=this.props.params;
        var keys=Object.keys(data);
        return <div className="me-core-param-edit">{
            keys.map((key)=>{
                let obj=data[key], type=obj.type;
                //typeに応じて
                let field=null;
                if(obj.type==="enum"){
                    let valueLink={
                        value: params[key],
                        requestChange:(v)=>{
                            paramActions.changeParam({
                                param: key,
                                value: v
                            });
                        }
                    };
                    field=<select valueLink={valueLink}>{
                        obj.enumValues.map((obj)=>{
                            return <option key={obj.value} value={obj.value}>{obj.description}</option>;
                        })
                    }</select>;
                }else if(obj.type==="boolean"){
                    let checkedLink={
                        value: params[key]==="1",
                        requestChange:(checked)=>{
                            paramActions.changeParam({
                                param: key,
                                value: checked ? "1" : "2"
                            });
                        }
                    };
                    field=<input type="checkbox" checkedLink={checkedLink}/>;
                }else if(obj.type==="integer"){
                    let valueLink={
                        value: params[key],
                        requestChange:(v)=>{
                            paramActions.changeParam({
                                param: key,
                                value: v
                            });
                        }
                    };
                    field=<input type="number" step="1" min={obj.min} max={obj.max} valueLink={valueLink}/>;
                }else if(obj.type==="string"){
                    let valueLink={
                        value: params[key],
                        requestChange:(v)=>{
                            paramActions.changeParam({
                                param: key,
                                value: v
                            });
                        }
                    };
                    field=<input type="text" valueLink={valueLink}/>;
                }else{
                    return null;
                }
                return <div key={key} className="ms-core-param-param">
                    <b>{obj.description}</b>
                    <span>{field}</span>
                </div>;
            })
        }</div>;
    }
});

