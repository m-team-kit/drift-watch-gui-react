import { Type } from '@sinclair/typebox';
import { DriftSchema, type Drift } from '../models/Drift.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import type ExperimentIdDriftIdGetParams from './experimentIdDriftIdGet.parameters.js';

export const Response200Schema = DriftSchema;
export type Response200 = Drift;

export const Response404Schema = Type.Object(
  {
    code: Type.Optional(Type.Number({ description: 'Error code' })),
    status: Type.Optional(Type.String({ description: 'Error name' })),
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
};

type Request = RequestMeta & { parameters: ExperimentIdDriftIdGetParams };
type ExperimentIdDriftIdGetResponse =
  | { response: Response; request: Request; status: 200; data: Response200 }
  | { response: Response; request: Request; status: 404; data: Response404 }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULT_ERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentIdDriftIdGetResponse;
