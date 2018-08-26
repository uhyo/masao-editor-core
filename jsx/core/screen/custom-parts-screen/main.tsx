import { Chip } from '../../../../scripts/chip-data/interface';
import { ChipRenderer } from '../../../components/chip-select/main';
import { ChipCode, drawChip } from '../../../../scripts/chip';
import * as customPartsActions from '../../../../actions/custom-parts';
import { ParamsState, CustomPartsState } from '../../../../stores';
import { ChipInformation } from './chip-information';
import * as React from 'react';
import { Images } from '../../../../defs/images';
import { FormControls, FormField } from '../../../components/form-controls';

export interface IPropCustomChipMain {
  images: Images;
  params: ParamsState;
  customParts: CustomPartsState;
  currentChipCode: string;
  chipDef: Chip;
}
export function CustomChipMain({
  images,
  params,
  customParts: { customParts },
  currentChipCode,
  chipDef,
}: IPropCustomChipMain) {
  const chipDisplayCallback: ChipRenderer<ChipCode> = (
    ctx,
    images,
    x,
    y,
    code,
  ) => drawChip(ctx, images, params, customParts, code, x, y, false);

  const nameChangeCallback = (e: React.SyntheticEvent<HTMLInputElement>) => {
    customPartsActions.setCustomChipName({
      chipCode: currentChipCode,
      name: e.currentTarget.value,
    });
  };
  return (
    <>
      {currentChipCode != null && chipDef != null ? (
        <ChipInformation
          images={images}
          currentChipCode={currentChipCode}
          chipDef={chipDef}
          onDrawChip={chipDisplayCallback}
        />
      ) : null}
      <FormControls>
        <FormField name="カスタムパーツ名">
          <input
            type="text"
            value={chipDef.name}
            onChange={nameChangeCallback}
          />
        </FormField>
      </FormControls>
    </>
  );
}
