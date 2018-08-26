import { Chip } from '../../../../scripts/chip-data/interface';
import { ChipRenderer } from '../../../components/chip-select/main';
import { ChipCode, drawChip } from '../../../../scripts/chip';
import * as customPartsActions from '../../../../actions/custom-parts';
import { ParamsState, CustomPartsState } from '../../../../stores';
import { ChipInformation } from './chip-information';
import * as React from 'react';
import { Images } from '../../../../defs/images';
import {
  FormControls,
  FormField,
  FormText,
} from '../../../components/form-controls';
import { getCustomProperties } from '../../../../scripts/custom-parts';
import { CustomPropertyField } from './field';

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
  // list of custom parts properties.
  const cpProperties = getCustomProperties(customParts, currentChipCode);
  const cpPropertyKeys = Object.keys(cpProperties);
  // current properties.
  const currentData = customParts[currentChipCode];
  const currentProperties = currentData != null ? currentData.properties : {};
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
        <FormText>基本情報</FormText>
        <FormField name="カスタムパーツ名">
          <input
            type="text"
            value={chipDef.name}
            onChange={nameChangeCallback}
          />
        </FormField>
        {cpPropertyKeys.length === 0 ? (
          <FormText>このパーツのカスタム設定はありません。</FormText>
        ) : (
          <>
            <FormText>カスタム設定</FormText>
            {cpPropertyKeys.map(key => {
              const propertyInfo = cpProperties[key];
              const value = currentProperties[key];
              const onChange = (value: unknown) => {
                customPartsActions.setCustomPropertyValue({
                  chipCode: currentChipCode,
                  propertyName: key,
                  value,
                });
              };
              return (
                <FormField key={key} name={propertyInfo.description}>
                  <CustomPropertyField
                    property={propertyInfo}
                    value={value}
                    onChange={onChange}
                  />
                </FormField>
              );
            })}
          </>
        )}
      </FormControls>
    </>
  );
}
