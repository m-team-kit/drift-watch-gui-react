import { Type } from '@sinclair/typebox';
import { PermissionSchema, type Permission } from '../models/Permission.js';

export const CreateExperimentSchema = Type.Object(
  {
    name: Type.String({}),
    description: Type.Optional(Type.String({})),
    public: Type.Optional(Type.Boolean({ default: false })),
    permissions: Type.Optional(Type.Array(PermissionSchema, { default: [] })),
  },
  { $id: 'CreateExperiment' },
);
export type CreateExperiment = {
  name: string;
  description?: string;
  public?: boolean;
  permissions?: Array<Permission>;
};
