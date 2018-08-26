import { CustomPartsState, EditState, ParamsState } from '../../../../stores';
import { ChipList } from '../../../components/chip-select';
import * as React from 'react';
import { drawChip, chipFor } from '../../../../scripts/chip';
import {
  stageBackColor,
  cssColor,
  complementColor,
} from '../../../../scripts/util';
import { Images } from '../../../../defs/images';
import { ScreenMainWrapper } from '../../../components/screen/screen-main';
import * as styles from '../../css/screen/custom-parts-screen.css';
import { ChipRenderer } from '../../../components/chip-select/main';

import * as editActions from '../../../../actions/edit';
import * as customPartsActions from '../../../../actions/custom-parts';
import { customPartsList } from '../../../../scripts/custom-parts';
import { CustomChipMain } from './main';

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
  const {
    customParts: customPartsData,
    currentChip,
    cursorPosition,
  } = customParts;
  const chips = customPartsList(customPartsData);
  // currentChipはindexなのでchipCodeを得る
  const currentChipCode = currentChip != null ? chips[currentChip] : null;
  // chip definition
  const chipDef =
    currentChipCode != null
      ? chipFor(params, customPartsData, currentChipCode)
      : null;

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
    const chips = customPartsList(customPartsData);
    drawChip(
      ctx,
      images,
      params,
      customPartsData,
      chips[chipIndex],
      x,
      y,
      false,
    );
  };
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
        onFocusChange={focus =>
          customPartsActions.setFocus({ focus: focus ? 'chipselect' : null })
        }
        onChipSelect={chipSelectCallback}
        onDrawChip={drawChipCallback}
        onResize={width => {
          editActions.changeChipselectSize({ width });
        }}
      />
      <div className={styles.main}>
        {currentChipCode == null || chipDef == null ? (
          <p>カスタムパーツを選択してください。</p>
        ) : (
          <CustomChipMain
            images={images}
            params={params}
            customParts={customParts}
            currentChipCode={currentChipCode}
            chipDef={chipDef}
          />
        )}
      </div>
    </ScreenMainWrapper>
  );
}
