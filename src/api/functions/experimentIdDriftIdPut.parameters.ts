import { Type } from '@sinclair/typebox';
import { DriftSchema, type Drift } from '../models/Drift.js';

export const ExperimentIdDriftIdPutParamsBodySchema = DriftSchema;
export type ExperimentIdDriftIdPutParamsBody = Drift;
export const ExperimentIdDriftIdPutParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }), drift_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdDriftIdPutParamsParams' },
);
export type ExperimentIdDriftIdPutParamsParams = {
  experiment_id: string;
  drift_id: string;
};
type ExperimentIdDriftIdPutParams = {
  body: ExperimentIdDriftIdPutParamsBody;
  params: ExperimentIdDriftIdPutParamsParams;
};

export default ExperimentIdDriftIdPutParams;
