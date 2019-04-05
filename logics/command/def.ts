import { MasaoJSONFormat } from '../../scripts/masao';
// 定義されたコマンド
export type Command =
  | 'mode:pen'
  | 'mode:eraser'
  | 'mode:hand'
  | 'mode:spuit'
  | 'mode:rect'
  | 'mode:fill'
  | 'mode:select'
  // scroll command
  | 'scroll:up'
  | 'scroll:right'
  | 'scroll:down'
  | 'scroll:left'
  // cursor command
  | 'cursor:up'
  | 'cursor:right'
  | 'cursor:down'
  | 'cursor:left'
  | 'cursor:jump'
  | 'cursor:vanish'
  | 'cursor:button'
  // history command
  | 'back'
  | 'forward'
  // other command
  | 'delete'
  // external command
  | 'file:new'
  | 'external:save'
  | 'external:json'
  | 'external:html'
  | 'external:open'
  | 'external:testplay';
export const commandNames: Record<Command, string> = {
  'mode:pen': 'ペンツール',
  'mode:eraser': 'イレイサーツール',
  'mode:hand': 'ハンドツール',
  'mode:spuit': 'スポイトツール',
  'mode:rect': '四角形ツール',
  'mode:fill': '塗りつぶしツール',
  'mode:select': '範囲選択ツール',
  'scroll:up': '上にスクロール',
  'scroll:right': '右にスクロール',
  'scroll:down': '下にスクロール',
  'scroll:left': '左にスクロール',
  back: '戻る',
  forward: 'やり直す',
  'cursor:up': 'カーソル上',
  'cursor:right': 'カーソル右',
  'cursor:down': 'カーソル下',
  'cursor:left': 'カーソル左',
  'cursor:jump': 'カーソルフォーカス移動',
  'cursor:vanish': 'カーソル消去',
  'cursor:button': 'カーソルボタン',
  delete: '削除',
  'file:new': '新規ファイル',
  'external:open': 'ファイルを開く',
  'external:save': '保存',
  'external:json': 'JSON出力',
  'external:html': 'HTML出力',
  'external:testplay': 'テストプレイ',
};
/**
 * エディタの外部で処理すべきイベント
 */
export type ExternalCommand =
  | ETestplayCommand
  | EEscapeCommand
  | ESaveCommand
  | EOpenCommand;
/**
 * Command of test play.
 */
export interface ETestplayCommand {
  type: 'testplay';
  /**
   * Game to test play.
   */
  game: MasaoJSONFormat;
  /**
   * Start stage.
   */
  stage: number;
}
/**
 * Command of escape key.
 * XXX should this be handled inside the editor?
 */
export interface EEscapeCommand {
  type: 'escape';
}
/**
 * Command of save.
 */
export interface ESaveCommand {
  type: 'save';
  /**
   * Kind of data.
   */
  kind: 'default' | 'json' | 'html';
}
/**
 * Command of open file.
 */
export interface EOpenCommand {
  type: 'open';
}
