import { Type } from '@sinclair/typebox';

export const DriftSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid', readOnly: true }),
    created_at: Type.String({ readOnly: true }),
    job_status: Type.Union(
      [Type.Literal('Running'), Type.Literal('Completed'), Type.Literal('Failed')],
      {},
    ),
    tags: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 20 }), { default: [] })),
    model: Type.String({}),
    drift_detected: Type.Boolean({}),
    parameters: Type.Optional(Type.Unknown()),
    schema_version: Type.String({ readOnly: true }),
  },
  { $id: 'Drift' },
);
export type Drift = {
  id: string;
  created_at: string;
  job_status: 'Running' | 'Completed' | 'Failed';
  tags?: Array<string>;
  model: string;
  drift_detected: boolean;
  parameters?: unknown;
  schema_version: string;
};
