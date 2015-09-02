var React=require('react');

var Core=require('../core/index.jsx');

module.exports = React.createClass({
    displayName:"Front",
    render(){
        return <div>
            <Core filename_pattern="pattern.gif"/>
        </div>;
    }
});
