/**
 * keys of given object, removing keys of undefined property.
 */
export type ExtractKeyFor<T, U> = Extract<
  keyof T,
  (OtherKeyToNever<T, U>)[keyof T]
>;

/**
 * Map key names to property type, converting keys of properties other than type `U` to never.
 */
type OtherKeyToNever<T, U> = { [K in keyof T]: T[K] extends U ? K : never };
