import { Type } from '@sinclair/typebox';

export const PermissionSchema = Type.Object(
  {
    entity: Type.String({}),
    level: Type.Union([Type.Literal('Read'), Type.Literal('Edit'), Type.Literal('Manage')], {}),
  },
  { additionalProperties: false, $id: 'Permission' },
);
export type Permission = {
  entity: string;
  level: 'Read' | 'Edit' | 'Manage';
};
