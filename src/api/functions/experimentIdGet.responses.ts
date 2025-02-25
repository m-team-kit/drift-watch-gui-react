import { Type } from '@sinclair/typebox';
import { ExperimentSchema, type Experiment } from '../models/Experiment.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import type ExperimentIdGetParams from './experimentIdGet.parameters.js';

export const Response200Schema = ExperimentSchema;
export type Response200 = Experiment;

export const Response404Schema = Type.Object(
  {
    code: Type.Optional(Type.Number({ description: 'Error code' })),
    status: Type.Optional(Type.String({ description: 'Error name' })),
    message: Type.Optional(Type.String({ description: 'Error message' })),
  },
  { $id: 'Response404' },
);
export type Response404 = {
  /**
   * Error code
   */
  code?: number;
  /**
   * Error name
   */
  status?: string;
  /**
   * Error message
   */
  message?: string;
};

type Request = RequestMeta & { parameters: ExperimentIdGetParams };
type ExperimentIdGetResponse =
  | { response: Response; request: Request; status: 200; data: Response200 }
  | { response: Response; request: Request; status: 404; data: Response404 }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULT_ERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentIdGetResponse;
