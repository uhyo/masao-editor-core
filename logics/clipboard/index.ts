import { getCopiedMapData } from './map-data';
import { fragmentToText } from './text-data';

/**
 * Logic of copying.
 * @returns {boolean} whether something is copied into clipboard.
 */
export function copyMapData(clipboardData: DataTransfer): boolean {
  // TODO
  const fragment = getCopiedMapData();
  if (fragment != null) {
    const mapText = fragmentToText(fragment);
    clipboardData.setData('application/json', JSON.stringify(fragment));
    clipboardData.setData('text/plain', mapText);
    console.log(fragment, mapText);
    return true;
  }
  return false;
}
