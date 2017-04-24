import * as React from 'react';

import * as styles from './css/js-warning.css';

//Warning about external JS
export interface IPropJSWarning{
    onClick?(): void;
}
export default class JSWarning extends React.Component<IPropJSWarning, {}>{
    render(){
        return <div className={styles.wrapper}>
            <p><strong><strong>ご注意ください。</strong></strong></p>
            <p><em>拡張JavaScript</em>を入力する場合は、<em>動作内容を自分で理解しているスクリプトのみ</em>を入力してください。</p>
            <p>入力されたスクリプトはテストプレイ時にこのページ上で実行されます。</p>
            <p>悪意のあるスクリプトを動作させると、<em>アカウントを乗っ取られたり</em>、<em>ブラウザがフリーズしたり</em>する恐れがあります。</p>
            <div className={styles.button} onClick={this.props.onClick}>
                拡張JavaScriptを入力する
            </div>
        </div>;
    }
}
