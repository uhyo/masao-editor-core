"use strict";
var React=require('react'),
    masao=require('../../scripts/masao');

var Select=require('./util/select.jsx'),
    Color=require('./util/color.jsx');

var paramActions=require('../../actions/params'),
    editActions=require('../../actions/edit');

module.exports = React.createClass({
    displayName: "ParamEdit",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        project: React.PropTypes.object.isRequired
    },
    componentDidUpdate(prevProps){
        if(prevProps.edit.param_type !== this.props.edit.param_type){
            let main=this.refs.main;
            main.scrollTop=0;
        }
    },
    render(){
        var data=masao.param.data, params=this.props.params, project=this.props.project;
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
            <div ref="main" className="me-core-param-edit-main">{
                (param_type==="" ? keys : masao.paramTypes[param_type].params).map((key)=>{
                    let description, field, obj;
                    if(/@@@/.test(key)){
                        //色コントロールを設置
                        let key_red=key.replace("@@@","red"), key_green=key.replace("@@@","green"), key_blue=key.replace("@@@","blue");
                        obj=data[key_red];
                        let colorLink={
                            value: {
                                red: Number(params[key_red]),
                                green: Number(params[key_green]),
                                blue: Number(params[key_blue])
                            },
                            requestChange: ({red, green, blue})=>{
                                paramActions.changeParams({
                                    [key_red]: String(red),
                                    [key_green]: String(green),
                                    [key_blue]: String(blue)
                                });
                            }
                        };
                        field= <Color colorLink={colorLink}/>;
                        description=obj.description.replace(/（.+）$/,"");
                    }else{
                        obj=data[key];
                        let type=obj.type;
                        description=obj.description;
                        //versionがあれか見る
                        let version=obj.version, pv=project.version;
                        if(pv==="fx16"){
                            pv="fx";
                        }
                        if(version && version[pv]===false){
                            //これは表示しない
                            return null;
                        }
                        //typeに応じて
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
                            let enumValues=obj.enumValues;
                            if(version && Array.isArray(version[pv])){
                                //選択肢の制限
                                enumValues=enumValues.filter((obj)=>{
                                    return version[pv].indexOf(obj.value)>=0;
                                });
                            }
                            field=<select valueLink={valueLink}>{
                                enumValues.map((obj)=>{
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
                    }
                    return <div key={key} className="me-core-param-param">
                        <label>
                            <b>{description}</b>
                            <span>{field}</span>
                        </label>
                    </div>;
                })
            }</div>
        </div>;
    }
});

