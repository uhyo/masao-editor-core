import { CustomPartsData, OneCustomChip } from '../defs/map';
import { createAction } from '../scripts/reflux-util';
import { ChipCode } from '../scripts/chip';
/**
 * custom partsの定義を読み込んだ
 */
export interface LoadCustomPartsAction {
  customParts: CustomPartsData;
}

/**
 * Action of loading custom parts definitions.
 */
export const loadCustomParts = createAction<LoadCustomPartsAction>();

export interface SetFocusAction {
  focus: 'chipselect' | null;
}
/**
 * Action of setting focus.
 */
export const setFocus = createAction<SetFocusAction>();

/**
 * Action of setting cursor position.
 */
export interface SetCursorAction {
  cursor: number | null;
}
export const setCursor = createAction<SetCursorAction>();

/**
 * Action of setting current
 */
export interface SetCurrentChipAction {
  chipIndex: number | null;
}
export const setCurrentChip = createAction<SetCurrentChipAction>();

/**
 * Set name of custom chip.
 */
export interface SetCustomChipNameAction {
  chipCode: string;
  name: string;
}
export const setCustomChipName = createAction<SetCustomChipNameAction>();

export interface SetCustomChipBaseAction {
  chipCode: string;
  base: ChipCode;
}
/**
 * Set base of custom chip.
 */
export const setCustomChipBase = createAction<SetCustomChipBaseAction>();

/**
 * Set value of custom property.
 */
export interface SetCustomPropertyValueAction {
  chipCode: string;
  propertyName: string;
  value: unknown;
}
export const setCustomPropertyValue = createAction<
  SetCustomPropertyValueAction
>();

export interface AddNewCustomPartsAction {
  chipCode: string;
  definition: OneCustomChip;
}

/**
 * Add a new custom chip.
 */
export const addNewCustomParts = createAction<AddNewCustomPartsAction>();

export interface DeleteCustomPartsAction {
  chipCode: string;
}

/**
 * Delete a custom chip.
 */
export const deleteCustomParts = createAction<DeleteCustomPartsAction>();
