import { ChipRendering } from './interface';

// 汎用チップパターン
export const dossunsun_pattern: ChipRendering = {
  chip: 184,
  x: 96,
  y: 576,
  dx: -32,
  dy: 0,
  width: 96,
  height: 64,
};

export const emptyblock_pattern: ChipRendering = {
  subx: 0,
  suby: 32,
  dx: -16,
  dy: -16,
  width: 32,
  height: 32,
};

export const unknown_pattern: ChipRendering = {
  subx: 160,
  suby: 0,
  dx: -16,
  dy: -16,
  width: 32,
  height: 32,
};
