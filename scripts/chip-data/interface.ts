export interface MainChipRendering {
  chip: number;
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
  width?: number;
  height?: number;
  rotate?: number;
}
export interface SubChipRendering {
  subx: number;
  suby: number;
  dx?: number;
  dy?: number;
  width?: number;
  height?: number;
}
export type ChipRendering = MainChipRendering | SubChipRendering;

/**
 * Expression of main layer chip.
 */
export interface Chip {
  pattern: number | ChipRendering | Array<number | ChipRendering>;
  name: string;
  category?: string;
}
