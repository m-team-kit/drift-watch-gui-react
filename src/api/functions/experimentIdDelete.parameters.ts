import { Type } from '@sinclair/typebox';

export const ExperimentIdDeleteParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdDeleteParamsParams' },
);
export type ExperimentIdDeleteParamsParams = {
  experiment_id: string;
};
type ExperimentIdDeleteParams = {
  params: ExperimentIdDeleteParamsParams;
};

export default ExperimentIdDeleteParams;
