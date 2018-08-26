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
/**
 * Color tip appended.
 */
export interface ColorRendering {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ChipRendering =
  | number
  | MainChipRendering
  | SubChipRendering
  | ColorRendering;

export type RenderInstruction = ChipRendering | ChipRendering[];

/**
 * Expression of chip known to be native.
 */
export interface NativeChip {
  /**
   * How to render this chip,
   */
  pattern: RenderInstruction;
  /**
   * Name of this chip.
   */
  name: string;
  /**
   * Category of this chip
   */
  category?: string;
}

/**
 * Expression of main layer chip.
 */
export interface Chip extends NativeChip {
  /**
   * Native code of this chip.
   */
  nativeCode: number;
  /**
   * Native name of this chip.
   */
  nativeName: string;
}
