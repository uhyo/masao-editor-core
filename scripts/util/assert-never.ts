/**
 * Assert given arguments is has the never type.
 */
export function assertNever(_arg: never): never {
  throw new Error('This function should not be called');
}
