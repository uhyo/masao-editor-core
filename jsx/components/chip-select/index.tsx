import { Images } from '../../../defs/images';
import { wrapLoadImages } from '../load-images';
import { ChipListMain, IPropChipListMain } from './main';

export type IPropChipList = Pick<
  IPropChipListMain,
  Exclude<keyof IPropChipListMain, 'images'>
> & {
  /**
   * URL of image files to use.
   */
  images: Images;
};
/**
 * Component which shows choosable list of chips.
 */
export const ChipList = wrapLoadImages('images', ChipListMain);
