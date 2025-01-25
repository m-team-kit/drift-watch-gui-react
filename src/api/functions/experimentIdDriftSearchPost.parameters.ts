import { Type } from '@sinclair/typebox';
import { SchemaSchema, type Schema } from '../models/Schema.js';

export const ExperimentIdDriftSearchPostParamsBodySchema = SchemaSchema;
export type ExperimentIdDriftSearchPostParamsBody = Schema;
export const ExperimentIdDriftSearchPostParamsParamsSchema = Type.Object(
  {
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    page_size: Type.Optional(Type.Number({ default: 10, minimum: 1, maximum: 100 })),
    experiment_id: Type.String({ format: 'uuid' }),
  },
  { $id: 'ExperimentIdDriftSearchPostParamsParams' },
);
export type ExperimentIdDriftSearchPostParamsParams = {
  page?: number;
  page_size?: number;
  experiment_id: string;
};
type ExperimentIdDriftSearchPostParams = {
  body: ExperimentIdDriftSearchPostParamsBody;
  params: ExperimentIdDriftSearchPostParamsParams;
};

export default ExperimentIdDriftSearchPostParams;
