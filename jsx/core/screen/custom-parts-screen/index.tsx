import { CustomPartsState, EditState, ParamsState } from '../../../../stores';
import { ChipList } from '../../../components/chip-select';
import * as React from 'react';
import { drawChip, ChipCode } from '../../../../scripts/chip';
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
import * as customPartsActions from '../../../../actions/custom-parts';
import { ChipInformation } from './chip-information';

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
  customParts: { customParts, currentChip, cursorPosition },
}: IPropCustomPartsScreen) {
  const { chipselect_width } = edit;
  const chips = customPartsList(customParts);
  // currentChipはindexなのでchipCodeを得る
  const currentChipCode = currentChip != null ? chips[currentChip] : null;

  const stageBackColorObject = stageBackColor(params, edit);
  const backgroundColor = cssColor(stageBackColorObject);
  const cursorColor = cssColor(complementColor(stageBackColorObject));

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
  const chipDisplayCallback: ChipRenderer<ChipCode> = (
    ctx,
    images,
    x,
    y,
    code,
  ) => drawChip(ctx, images, params, customParts, code, x, y, false);
  // function to update selection of chip.
  const chipSelectCallback = (chipIndex: number) =>
    customPartsActions.setCurrentChip({ chipIndex });
  return (
    <ScreenMainWrapper className={styles.wrapper}>
      <ChipList
        images={images}
        chipNumber={chips.length}
        backgroundColor={backgroundColor}
        cursorColor={cursorColor}
        cursorPosition={cursorPosition}
        chipsWidth={chipselect_width}
        scrollY={0}
        onChipSelect={chipSelectCallback}
        onDrawChip={drawChipCallback}
        onResize={width => {
          editActions.changeChipselectSize({ width });
        }}
      />
      <div className={styles.main}>
        <ChipInformation
          images={images}
          customParts={customParts}
          currentChipCode={currentChipCode}
          onDrawChip={chipDisplayCallback}
        />
      </div>
    </ScreenMainWrapper>
  );
}
