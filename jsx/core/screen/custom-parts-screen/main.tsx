import { Chip } from '../../../../scripts/chip-data/interface';
import { ChipRenderer } from '../../../components/chip-select/main';
import { ChipCode, drawChip, chipFor } from '../../../../scripts/chip';
import * as customPartsLogics from '../../../../logics/custom-parts';
import { ParamsState, CustomPartsState, MapState } from '../../../../stores';
import { ChipInformation } from './chip-information';
import * as React from 'react';
import { Images } from '../../../../defs/images';
import {
  FormControls,
  FormField,
  FormText,
} from '../../../components/form-controls';
import {
  getCustomProperties,
  getCustomPartsBases,
} from '../../../../scripts/custom-parts';
import { CustomPropertyField } from './field';
import { OneCustomChip } from '../../../../defs/map';

export interface IPropCustomChipMain {
  images: Images;
  map: MapState;
  params: ParamsState;
  customParts: CustomPartsState;
  currentChipCode: string;
  currentData: OneCustomChip;
  currentUseCount: number;
  chipDef: Chip;
}
export class CustomChipMain extends React.PureComponent<
  IPropCustomChipMain,
  {}
> {
  public render() {
    const {
      images,
      params,
      customParts: { customParts },
      currentChipCode,
      currentData,
      currentUseCount,
      chipDef,
    } = this.props;
    // list of custom parts properties.
    const { nativeCode, properties: cpProperties } = getCustomProperties(
      customParts,
      currentChipCode,
    );
    const cpPropertyKeys = Object.keys(cpProperties);

    const currentProperties = currentData.properties;
    const chipDisplayCallback: ChipRenderer<ChipCode> = (
      ctx,
      images,
      x,
      y,
      code,
    ) => drawChip(ctx, images, params, customParts, code, x, y, false);

    const nameChangeCallback = (e: React.SyntheticEvent<HTMLInputElement>) => {
      customPartsLogics.setCustomChipName({
        chipCode: currentChipCode,
        name: e.currentTarget.value,
      });
    };
    const baseChangeCallback = (e: React.SyntheticEvent<HTMLSelectElement>) => {
      customPartsLogics.setCustomChipBase({
        chipCode: currentChipCode,
        base: Number(e.currentTarget.value),
      });
    };
    return (
      <>
        {currentChipCode != null && chipDef != null ? (
          <ChipInformation
            images={images}
            currentChipCode={currentChipCode}
            chipDef={chipDef}
            currentUseCount={currentUseCount}
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
          <FormField name="ベース">
            {'string' === typeof currentData.extends ? (
              currentData.extends
            ) : (
              <select value={String(nativeCode)} onChange={baseChangeCallback}>
                {getCustomPartsBases.map(nc => {
                  const { name } = chipFor(params, customParts, nc);

                  return (
                    <option key={nc} value={String(nc)}>
                      {name}
                    </option>
                  );
                })}
              </select>
            )}
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
                  customPartsLogics.setCustomPropertyValue({
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
}
