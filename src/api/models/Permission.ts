import { Type } from '@sinclair/typebox';

export const PermissionSchema = Type.Object(
  { entity: Type.String({}), level: Type.String({}) },
  { additionalProperties: false, $id: 'Permission' },
);
export type Permission = {
  entity: string;
  level: string;
};
