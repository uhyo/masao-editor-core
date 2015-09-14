var React=require('react');

//color select control
module.exports = React.createClass({
    displayName: "Color",
    propTypes: {
        colorLink: React.PropTypes.shape({
            value: React.PropTypes.shape({
                red: React.PropTypes.number.isRequired,
                green: React.PropTypes.number.isRequired,
                blue: React.PropTypes.number.isRequired
            }).isRequired,
            requestChange: React.PropTypes.func.isRequired
        }).isRequired
    },
    render(){
        var color=this.props.colorLink.value;
        var style={
            backgroundColor: `rgb(${color.red},${color.green},${color.blue})`,
            color: `rgb(${255-color.red},${255-color.green},${255-color.blue})`
        };
        var colorValue="#"+("0"+color.red.toString(16)).slice(-2)+("0"+color.green.toString(16)).slice(-2)+("0"+color.blue.toString(16)).slice(-2);

        var valueLinkRed={
            value: String(color.red),
            requestChange: (v)=>{
                this.props.colorLink.requestChange({
                    red: Number(v),
                    green: color.green,
                    blue: color.blue
                });
            }
        }, valueLinkGreen={
            value: String(color.green),
            requestChange: (v)=>{
                this.props.colorLink.requestChange({
                    red: color.red,
                    green: Number(v),
                    blue: color.blue
                });
            }
        }, valueLinkBlue={
            value: String(color.blue),
            requestChange: (v)=>{
                this.props.colorLink.requestChange({
                    red: color.red,
                    green: color.green,
                    blue: Number(v)
                });
            }
        };
        return <span className="me-core-util-color">
            <span className="me-core-util-color-box" style={style}>{colorValue}</span>
            <span className="me-core-util-color-edit">
                <span>
                    R: <input type="range" step="1" min="0" max="255" valueLink={valueLinkRed}/>
                </span>
                <span>
                    G: <input type="range" step="1" min="0" max="255" valueLink={valueLinkGreen}/>
                </span>
                <span>
                    B: <input type="range" step="1" min="0" max="255" valueLink={valueLinkBlue}/>
                </span>
            </span>
        </span>;
    },
});
