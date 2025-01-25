import { Type } from '@sinclair/typebox';
import { CreateDriftSchema, type CreateDrift } from '../models/CreateDrift.js';

export const ExperimentIdDriftPostParamsBodySchema = CreateDriftSchema;
export type ExperimentIdDriftPostParamsBody = CreateDrift;
export const ExperimentIdDriftPostParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdDriftPostParamsParams' },
);
export type ExperimentIdDriftPostParamsParams = {
  experiment_id: string;
};
type ExperimentIdDriftPostParams = {
  body: ExperimentIdDriftPostParamsBody;
  params: ExperimentIdDriftPostParamsParams;
};

export default ExperimentIdDriftPostParams;
