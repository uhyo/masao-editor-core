'use strict';

/**
 * タイマーを名前で管理していざとなったら全部消せるクラス
 */
export default class Timers{
    constructor(){
        this.dict = {};
    }

    /**
     * 新しいタイマーを発行
     *
     * @param {string} id タイマーID
     * @param {number} wait 待ち時間
     * @param {Function} callback 関数
     */
    addTimer(id, wait, callback){
        const {
            dict,
        } = this;
        if (dict[id] != null){
            this.clearTimer(id);
        }
        dict[id] = setTimeout(()=>{
            dict[id] = null;
            callback();
        }, wait);
    }
    /**
     * タイマーを取り消し
     * @param {string} id タイマーID
     */
    clearTimer(id){
        if (dict[id] != null){
            clearTimeout(dict[id]);
            dict[id] = null;
        }
    }
    /**
     * 全て消す
     */
    clean(){
        const {
            dict,
        } = this;
        for (let key of Object.getOwnPropertyNames(dict)){
            if (dict[key] != null){
                this.clearTimer(key);
            }
        }

        this.dict = {};
    }
}
