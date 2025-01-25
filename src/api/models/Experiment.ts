import { Type } from '@sinclair/typebox';
import { PermissionSchema, type Permission } from '../models/Permission.js';

export const ExperimentSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid', readOnly: true }),
    created_at: Type.String({ readOnly: true }),
    name: Type.String({}),
    description: Type.Optional(Type.String({})),
    public: Type.Optional(Type.Boolean({ default: false })),
    permissions: Type.Optional(Type.Array(PermissionSchema, { default: [] })),
  },
  { $id: 'Experiment' },
);
export type Experiment = {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  public?: boolean;
  permissions?: Array<Permission>;
};
