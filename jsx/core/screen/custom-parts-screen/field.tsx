import * as React from 'react';
import {
  CustomPartsProperty,
  IntegerProperty,
} from '../../../../scripts/masao';

import * as styles from '../../css/screen/custom-parts-screen.css';
import { FilteredInput } from '../../../components/filterd-input';

export interface IPropCustomPropertyField {
  property: CustomPartsProperty;
  value: unknown;
  onChange?(value: unknown): void;
}

/**
 * Render a form control for given property.
 */
export function CustomPropertyField({
  property,
  value,
  onChange,
}: IPropCustomPropertyField) {
  switch (property.type) {
    case 'integer': {
      // Integer field.
      return (
        <IntegerField property={property} value={value} onChange={onChange} />
      );
    }
  }
  return null;
}

interface IPropIntegerField {
  property: IntegerProperty;
  value: unknown;
  onChange?(value: number): void;
}
const isValidInteger = (value: string) =>
  value !== '' && Number.isFinite(Number(value));
function IntegerField({ property, value, onChange }: IPropIntegerField) {
  const isDefault = value == null;
  // convert value to integer.
  const intValue = isDefault ? property.default : Number(value) | 0;
  const changeHandler =
    onChange && ((value: string) => onChange(Number(value)));
  return (
    <FilteredInput
      className={isDefault ? styles.inputDefault : undefined}
      type="number"
      value={String(intValue)}
      onChange={changeHandler}
      readOnly={changeHandler == null}
      filter={isValidInteger}
    />
  );
}
