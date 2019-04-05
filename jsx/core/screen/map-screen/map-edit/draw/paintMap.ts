import { BackLayers } from '../useBackLayer';
import { EditState } from '../../../../../../stores';

/**
 * Paint map layers on canvas.
 */
export function paintMap(
  ctx: CanvasRenderingContext2D,
  backLayers: BackLayers,
  edit: EditState,
): void {
  const {
    screen,
    scroll_x,
    scroll_y,
    view_width,
    view_height,
    render_map,
    render_layer,
  } = edit;
  if (screen === 'layer' || render_layer) {
    ctx.save();
    ctx.globalAlpha = screen === 'layer' ? 1 : 0.5;
    backLayers.layerBacklayer.copyTo(
      ctx,
      scroll_x,
      scroll_y,
      view_width,
      view_height,
      0,
      0,
    );
    ctx.restore();
  }
  if (screen === 'map' || render_map) {
    ctx.save();
    ctx.globalAlpha = screen === 'map' ? 1 : 0.5;
    backLayers.mapBacklayer.copyTo(
      ctx,
      scroll_x,
      scroll_y,
      view_width,
      view_height,
      0,
      0,
    );
    ctx.restore();
  }
}
