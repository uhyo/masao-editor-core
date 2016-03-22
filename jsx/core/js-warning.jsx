"use strict";
var React=require('react');

//Warning about external JS

module.exports = React.createClass({
    displayName: "JSWarning",
    propTypes:{
        onClick: React.PropTypes.func
    },
    render(){
        return <div className="me-core-js-warning">
            <p><strong><strong>ご注意ください。</strong></strong></p>
            <p><em>拡張JavaScript</em>を入力する場合は、<em>動作内容を自分で理解しているスクリプトのみ</em>を入力してください。</p>
            <p>入力されたスクリプトはテストプレイ時にこのページ上で実行されます。</p>
            <p>悪意のあるスクリプトを動作させると、<em>アカウントを乗っ取られたり</em>、<em>ブラウザがフリーズしたり</em>する恐れがあります。</p>
            <div className="me-core-js-warning-button" onClick={this.props.onClick}>
                拡張JavaScriptを入力する
            </div>
        </div>;
    },
});
