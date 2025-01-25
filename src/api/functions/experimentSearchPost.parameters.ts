import { Type } from '@sinclair/typebox';
import { SchemaSchema, type Schema } from '../models/Schema.js';

export const ExperimentSearchPostParamsBodySchema = SchemaSchema;
export type ExperimentSearchPostParamsBody = Schema;
export const ExperimentSearchPostParamsParamsSchema = Type.Object(
  {
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    page_size: Type.Optional(Type.Number({ default: 10, minimum: 1, maximum: 100 })),
  },
  { $id: 'ExperimentSearchPostParamsParams' },
);
export type ExperimentSearchPostParamsParams = {
  page?: number;
  page_size?: number;
};
type ExperimentSearchPostParams = {
  body: ExperimentSearchPostParamsBody;
  params?: ExperimentSearchPostParamsParams;
};

export default ExperimentSearchPostParams;
