import { Type } from '@sinclair/typebox';
import { ExperimentSchema, type Experiment } from '../models/Experiment.js';

export const ExperimentIdPutParamsBodySchema = ExperimentSchema;
export type ExperimentIdPutParamsBody = Experiment;
export const ExperimentIdPutParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdPutParamsParams' },
);
export type ExperimentIdPutParamsParams = {
  experiment_id: string;
};
type ExperimentIdPutParams = {
  body: ExperimentIdPutParamsBody;
  params: ExperimentIdPutParamsParams;
};

export default ExperimentIdPutParams;
