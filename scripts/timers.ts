'use strict';

/**
 * タイマーを名前で管理していざとなったら全部消せるクラス
 */
export default class Timers {
  private dict: Record<string, any> = {};

  /**
   * 新しいタイマーを発行
   */
  addTimer(id: string, wait: number, callback: () => void): void {
    const { dict } = this;
    if (dict[id] != null) {
      this.clearTimer(id);
    }
    dict[id] = setTimeout(() => {
      dict[id] = null;
      callback();
    }, wait);
  }
  /**
   * タイマーを取り消し
   */
  clearTimer(id: string) {
    const { dict } = this;
    const timerid = dict[id];
    if (timerid != null) {
      clearTimeout(timerid);
      dict[id] = null;
    }
  }
  /**
   * 全て消す
   */
  clean() {
    const { dict } = this;
    for (let key of Object.getOwnPropertyNames(dict)) {
      if (dict[key] != null) {
        this.clearTimer(key);
      }
    }

    this.dict = {};
  }
}
