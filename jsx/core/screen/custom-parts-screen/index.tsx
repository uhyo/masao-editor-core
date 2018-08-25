import { CustomPartsState, EditState, ParamsState } from '../../../../stores';
import { ChipList } from '../../../components/chip-select';
import * as React from 'react';
import { drawChip } from '../../../../scripts/chip';
import {
  stageBackColor,
  cssColor,
  complementColor,
} from '../../../../scripts/util';
import { Images } from '../../../../defs/images';
import { ScreenMainWrapper } from '../../../components/screen/screen-main';
import * as styles from '../../css/screen/custom-parts-screen.css';
import { customPartsList } from '../../../../logics/edit';
import { ChipRenderer } from '../../../components/chip-select/main';

import * as editActions from '../../../../actions/edit';

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
  customParts: { customParts },
}: IPropCustomPartsScreen) {
  const { chipselect_width, cursor } = edit;
  const chips = customPartsList(customParts);
  const stageBackColorObject = stageBackColor(params, edit);
  const backgroundColor = cssColor(stageBackColorObject);
  const cursorColor = cssColor(complementColor(stageBackColorObject));
  // cursor on chip selector.
  const chipPosition =
    cursor != null && cursor.type === 'customparts' ? cursor.index : null;

  // function to draw a chip.
  const drawChipCallback: ChipRenderer<number> = (
    ctx,
    images,
    x,
    y,
    chipIndex,
  ) => {
    const chips = customPartsList(customParts);
    drawChip(ctx, images, params, customParts, chips[chipIndex], x, y, false);
  };
  return (
    <ScreenMainWrapper className={styles.wrapper}>
      <ChipList
        className={styles.chiplist}
        images={images}
        chipNumber={chips.length}
        backgroundColor={backgroundColor}
        cursorColor={cursorColor}
        cursorPosition={chipPosition}
        chipsWidth={chipselect_width}
        scrollY={0}
        onChipSelect={() => {}}
        onDrawChip={drawChipCallback}
        onResize={width => {
          editActions.changeChipselectSize({ width });
        }}
      />
    </ScreenMainWrapper>
  );
}
