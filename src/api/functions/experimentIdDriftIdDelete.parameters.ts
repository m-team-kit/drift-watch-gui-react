import { Type } from '@sinclair/typebox';

export const ExperimentIdDriftIdDeleteParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }), drift_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdDriftIdDeleteParamsParams' },
);
export type ExperimentIdDriftIdDeleteParamsParams = {
  experiment_id: string;
  drift_id: string;
};
type ExperimentIdDriftIdDeleteParams = {
  params: ExperimentIdDriftIdDeleteParamsParams;
};

export default ExperimentIdDriftIdDeleteParams;
