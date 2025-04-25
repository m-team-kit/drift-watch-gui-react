import { Type } from '@sinclair/typebox';
import { SchemaSchema, type Schema } from '../models/Schema.js';

export const ExperimentSearchPostParamsBodySchema = SchemaSchema;
export type ExperimentSearchPostParamsBody = Schema;
export const ExperimentSearchPostParamsParamsSchema = Type.Object(
  {
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    page_size: Type.Optional(Type.Number({ default: 10, minimum: 1, maximum: 100 })),
    sort_by: Type.Optional(
      Type.Union([
        Type.Literal('name'),
        Type.Literal('created_at'),
        Type.Literal('public'),

      ]),
    ),
    order_by: Type.Optional(
      Type.Union([
        Type.Literal('asc'),
        Type.Literal('desc'),
      ]),
    ),
  },
  { $id: 'ExperimentSearchPostParamsParams' },
);
export type ExperimentSearchPostParamsParams = {
  page?: number;
  page_size?: number;
  sort_by?: string;
  order_by?: 'asc' | 'desc';
};
type ExperimentSearchPostParams = {
  body: ExperimentSearchPostParamsBody;
  params?: ExperimentSearchPostParamsParams;
};

export default ExperimentSearchPostParams;
