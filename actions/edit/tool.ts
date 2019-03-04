// ツールの使用中状態

export interface PenTool {
  type: 'pen';
}
export interface EraserTool {
  type: 'eraser';
}
export interface HandTool {
  type: 'hand';

  /**
   * マウスが押された場所x
   */
  mouse_sx: number;
  /**
   * マウスが押された場所y
   */
  mouse_sy: number;
  /**
   * マウスが押されたときのスクロール状態x
   */
  scroll_sx: number;
  /**
   * マウスが押されたときのスクロール状態y
   */
  scroll_sy: number;
}
export interface RectTool {
  type: 'rect';

  /**
   * 開始地点x
   */
  start_x: number;
  /**
   * 開始地点y
   */
  start_y: number;

  /**
   * 終了地点x
   */
  end_x: number;

  /**
   * 終了地点y
   */
  end_y: number;
}

/**
 * ツールの状態
 */
export type ToolState = PenTool | EraserTool | HandTool | RectTool;
