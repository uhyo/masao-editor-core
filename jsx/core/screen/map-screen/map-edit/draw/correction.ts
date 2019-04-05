import { EditState } from '../../../../../../stores';

/**
 * Set correction of rendering on given canvas.
 * @package
 */
export function setCorrection(
  ctx: CanvasRenderingContext2D,
  edit: EditState,
): void {
  const {
    scroll_stick_bottom,
    scroll_stick_right,
    view_width_remainder,
    view_height_remainder,
  } = edit;
  const x_corr = scroll_stick_right ? -view_width_remainder : 0;
  const y_corr = scroll_stick_bottom ? -view_height_remainder : 0;
  ctx.translate(x_corr, y_corr);
}
