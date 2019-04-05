import { MapFragmentJSONData } from './fragment';
import editStore from '../../stores/edit';
import mapStore from '../../stores/map';
import { Rect } from '../edit';
import { ChipCode } from '../../scripts/chip';

/**
 * Get map data to be copied.
 * Returns null if no selection exists.
 * @package
 */
export function getCopiedMapData(): [MapFragmentJSONData, Rect] | null {
  const { stage, screen, tool, floating } = editStore.state;
  const stageData = mapStore.state.data[stage - 1];
  if (screen !== 'map' && screen !== 'layer') {
    // current screen is neither map.
    return null;
  }
  const mapData = stageData[screen];
  if (tool != null && tool.type === 'select') {
    // selection on map exists.
    const rect = {
      left: tool.start_x,
      top: tool.start_y,
      right: tool.end_x,
      bottom: tool.end_y,
    };
    const fragment = extractFromMapData(screen, mapData, rect);
    return [fragment, rect];
  }
  if (floating != null) {
    const rect = {
      left: floating.x,
      top: floating.y,
      right: floating.x + floating.width - 1,
      bottom: floating.y + floating.height - 1,
    };
    const fragment = extractFromMapData(screen, mapData, rect);
    return [fragment, rect];
  }
  return null;
}

/**
 * Extract given rect of data from map data.
 */
function extractFromMapData(
  type: 'map' | 'layer',
  map: ChipCode[][],
  rect: Rect,
): MapFragmentJSONData {
  const data: ChipCode[][] = [];
  for (let y = rect.top; y <= rect.bottom; y++) {
    const row: ChipCode[] = [];
    for (let x = rect.left; x <= rect.right; x++) {
      row.push(map[y][x]);
    }
    data.push(row);
  }
  return {
    type,
    size: {
      x: rect.right - rect.left + 1,
      y: rect.bottom - rect.top + 1,
    },
    data,
  };
}
