import { Type } from '@sinclair/typebox';

export const ExperimentIdGetParamsParamsSchema = Type.Object(
  { experiment_id: Type.String({ format: 'uuid' }) },
  { $id: 'ExperimentIdGetParamsParams' },
);
export type ExperimentIdGetParamsParams = {
  experiment_id: string;
};
type ExperimentIdGetParams = {
  params: ExperimentIdGetParamsParams;
};

export default ExperimentIdGetParams;
