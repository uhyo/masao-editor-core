import { ExtractKeyFor } from '../../../defs/helper-types';
/**
 * Conversion of dictonary of image names to dictonary of img elements.
 */
export type IntoImages<T> = {
  [key in ExtractKeyFor<T, string>]: HTMLImageElement
};
