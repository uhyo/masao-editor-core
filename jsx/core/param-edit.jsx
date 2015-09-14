"use strict";
var React=require('react'),
    masao=require('../../scripts/masao');

var Select=require('./util/select.jsx');

var paramActions=require('../../actions/params'),
    editActions=require('../../actions/edit');

module.exports = React.createClass({
    displayName: "ParamEdit",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired
    },
    render(){
        var data=masao.param.data, params=this.props.params;
        var param_type=this.props.edit.param_type;
        var keys=Object.keys(data);
        var paramTypesContents=[{
            key: "",
            value: "全て表示"
        }].concat(Object.keys(masao.paramTypes).map((key)=>{
            return {
                key,
                value: masao.paramTypes[key].name
            };
        })), paramTypeLink={
            value: param_type,
            requestChange: (param_type)=>{
                editActions.changeParamType({param_type});
            }
        };
        var typeMenu=<div className="me-core-param-edit-menu">
            <Select contents={paramTypesContents} valueLink={paramTypeLink}/>
        </div>;

        return <div className="me-core-param-edit">
            {typeMenu}
            {
                (param_type==="" ? keys : masao.paramTypes[param_type].params).map((key)=>{
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
                    }else if(obj.type==="boolean-reversed"){
                        let checkedLink={
                            value: params[key]==="2",
                            requestChange:(checked)=>{
                                paramActions.changeParam({
                                    param: key,
                                    value: checked ? "2" : "1"
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
                    return <div key={key} className="me-core-param-param">
                        <label>
                            <b>{obj.description}</b>
                            <span>{field}</span>
                        </label>
                    </div>;
                })
            }
        </div>;
    }
});

