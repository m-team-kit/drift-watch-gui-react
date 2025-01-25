import { Type } from '@sinclair/typebox';

export const EntitlementsSchema = Type.Object(
  { items: Type.Array(Type.String({}), {}) },
  { $id: 'Entitlements' },
);
export type Entitlements = {
  items: Array<string>;
};
