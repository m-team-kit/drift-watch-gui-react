import { Type } from '@sinclair/typebox';

export const ExperimentIdDriftIdGetParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }), drift_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdDriftIdGetParamsParams' },
);
export type ExperimentIdDriftIdGetParamsParams = {
  experiment_id: string;
  drift_id: string;
};
type ExperimentIdDriftIdGetParams = {
  params: ExperimentIdDriftIdGetParamsParams;
};

export default ExperimentIdDriftIdGetParams;
