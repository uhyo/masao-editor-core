import { CustomPartsState, EditState, ParamsState } from '../../../../stores';
import { ChipList } from '../../../components/chip-select';
import * as React from 'react';
import { ChipCode } from '../../../../scripts/chip';
import {
  stageBackColor,
  cssColor,
  complementColor,
} from '../../../../scripts/util';
import { Images } from '../../../../defs/images';
import { ScreenMainWrapper } from '../../../components/screen/screen-main';
import * as styles from '../../css/screen/custom-parts-screen.css';

export interface IPropCustomPartsScreen {
  images: Images;
  edit: EditState;
  params: ParamsState;
  customParts: CustomPartsState;
}

export function CustomPartsScreen({
  images,
  params,
  edit,
  customParts,
}: IPropCustomPartsScreen) {
  const { chipselect_width } = edit;
  const chips = getCustomPartsList(customParts);
  const stageBackColorObject = stageBackColor(params, edit);
  const backgroundColor = cssColor(stageBackColorObject);
  const cursorColor = cssColor(complementColor(stageBackColorObject));
  return (
    <ScreenMainWrapper>
      <ChipList
        className={styles.chiplist}
        images={images}
        chipNumber={chips.length}
        backgroundColor={backgroundColor}
        cursorColor={cursorColor}
        cursorPosition={null}
        chipsWidth={chipselect_width}
        scrollY={0}
        onChipSelect={() => {}}
        onDrawChip={_code => {}}
      />
    </ScreenMainWrapper>
  );
}

/**
 * Return a list of custom parts.
 */
function getCustomPartsList({ customParts }: CustomPartsState): ChipCode[] {
  return Object.keys(customParts);
}
