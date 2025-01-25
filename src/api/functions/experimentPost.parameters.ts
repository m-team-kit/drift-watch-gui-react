import { CreateExperimentSchema, type CreateExperiment } from '../models/CreateExperiment.js';

export const ExperimentPostParamsBodySchema = CreateExperimentSchema;
export type ExperimentPostParamsBody = CreateExperiment;
type ExperimentPostParams = {
  body: ExperimentPostParamsBody;
};

export default ExperimentPostParams;
