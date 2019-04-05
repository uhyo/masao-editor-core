import * as chip from '../../scripts/chip';
import { CustomPartsData } from '../../defs/map';
import { customPartsList } from '../../scripts/custom-parts';

/**
 * Return the list of currently available chips.
 */
export function chipList(
  advanced: boolean,
  customParts: CustomPartsData,
): chip.ChipCode[] {
  if (advanced) {
    return chip.advancedChipList.concat(customPartsList(customParts));
  } else {
    return chip.chipList;
  }
}

/**
 * Return the number of currently avaiable chips.
 */
export function chipNumber(
  advanced: boolean,
  customParts: CustomPartsData,
): number {
  return chipList(advanced, customParts).length;
}
