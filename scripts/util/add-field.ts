/**
 * Add a field to all elements of given dictionary.
 */
export function addFieldToDictElements<
  Dict,
  FieldKey extends string | number | symbol,
  FieldValue
>(
  key: FieldKey,
  value: FieldValue,
  dict: Dict,
): { [K in keyof Dict]: Dict[K] & { [K2 in FieldKey]: FieldValue } } {
  const result: any = {};
  for (const field in dict) {
    const val = dict[field];
    if (typeof val === 'object' || typeof val === 'function') {
      result[field] = {
        ...(val as any),
        [key]: value,
      };
    }
  }
  return result;
}
