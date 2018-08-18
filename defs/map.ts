/**
 * Data of one custom parts.
 */
export interface OneCustomChip {
  /**
   * User-defined name of this custom parts.
   */
  name: string;
  /**
   * Origin of extension.
   */
  extends: string | number;
  /**
   * Properties of this custom parts.
   */
  properties: Record<string, unknown>;
}

export type CustomPartsData = Record<string, OneCustomChip | undefined>;
