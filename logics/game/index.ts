// Game objectに関するlogic
import * as masao from '../../scripts/masao';

export type MasaoJSONFormat = masao.format.MasaoJSONFormat;

export { GetCurrentGameOption, getCurrentGame } from './generate';
export { loadGame } from './load';
