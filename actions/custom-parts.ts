import { CustomPartsData } from '../defs/map';
import { createAction } from '../scripts/reflux-util';
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
