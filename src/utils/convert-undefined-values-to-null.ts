/**
 * Converts all undefined values in an object to null for JSON serialization purposes.
 *
 * @template T - The type of the object.
 * @param {T} obj - The object to be processed.
 * @returns {T} - A new object with all undefined values replaced by null.
 *
 * @example
 * const obj = {a: 1, b: undefined, c: 3};
 * const result = convertUndefinedValuesToNull(obj);
 * console.log(result); // {a: 1, b: null, c: 3}
 */

export function convertUndefinedValuesToNull<T extends Record<string, any>>(
  obj: T,
): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ?? null]),
  ) as T
}
