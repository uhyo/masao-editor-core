import { EditState } from '../../../../../../stores';
import { BackLayers } from '../useBackLayer';

/**
 * perform prerendering of current screen.
 */
export function prerender(backLayers: BackLayers, edit: EditState): void {
  const {
    scroll_x,
    scroll_y,
    view_width,
    view_height,
    screen,
    render_map,
    render_layer,
  } = edit;
  if (screen === 'map' || render_map) {
    backLayers.mapBacklayer.prerender(
      scroll_x,
      scroll_y,
      view_width,
      view_height,
    );
  }
  if (screen === 'layer' || render_layer) {
    backLayers.layerBacklayer.prerender(
      scroll_x,
      scroll_y,
      view_width,
      view_height,
    );
  }
}
