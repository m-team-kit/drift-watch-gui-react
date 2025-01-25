import { Type } from '@sinclair/typebox';

export const CreateDriftSchema = Type.Object(
  {
    job_status: Type.Union(
      [Type.Literal('Running'), Type.Literal('Completed'), Type.Literal('Failed')],
      {},
    ),
    tags: Type.Optional(Type.Array(Type.String({ minLength: 1, maxLength: 20 }), { default: [] })),
    model: Type.String({}),
    drift_detected: Type.Boolean({}),
    parameters: Type.Optional(Type.Unknown()),
  },
  { $id: 'CreateDrift' },
);
export type CreateDrift = {
  job_status: 'Running' | 'Completed' | 'Failed';
  tags?: Array<string>;
  model: string;
  drift_detected: boolean;
  parameters?: unknown;
};
