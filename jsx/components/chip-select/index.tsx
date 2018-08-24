import * as React from 'react';
import { Images } from '../../../defs/images';
import { LoadImages } from '../load-images';
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
export function ChipList({ images, ...props }: IPropChipList) {
  return (
    <LoadImages images={images}>
      {images => <ChipListMain images={images} {...props} />}
    </LoadImages>
  );
}
