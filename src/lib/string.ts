/**
 * Only return value if string
 *
 * Necessary because ImportMetaEnv is effectively Record<string, any>, not Record<string, string>
 * @param value
 */
export const string = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;
