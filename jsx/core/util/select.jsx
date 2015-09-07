//select box
var React=require('react');

module.exports = React.createClass({
    displayName: "Select",
    propTypes: {
        contents: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string.isRequired,
            value: React.PropTypes.string.isRequired
        }).isRequired).isRequired,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.string.isRequired,
            requestChange: React.PropTypes.func.isRequired
        })
    },
    render(){
        var valueLink=this.props.valueLink;
        return <div className="me-core-util-select">{
            this.props.contents.map(({key,value})=>{
                var c="me-core-util-select-button";
                if(key===valueLink.value){
                    c+=" me-core-util-select-current";
                }
                return <div key={key} className={c} onClick={this.handleClick(key)}>{value}</div>;
            })
        }</div>;
    },
    handleClick(key){
        return (e)=>{
            e.preventDefault();
            this.props.valueLink.requestChange(key);
        };
    }
});
