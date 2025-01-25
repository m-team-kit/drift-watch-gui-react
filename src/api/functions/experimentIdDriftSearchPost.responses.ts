import { Type } from '@sinclair/typebox';
import { DriftSchema, type Drift } from '../models/Drift.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import { type ResponseUNPROCESSABLE_ENTITY } from '../responses/UNPROCESSABLE_ENTITY.js';
import type ExperimentIdDriftSearchPostParams from './experimentIdDriftSearchPost.parameters.js';

export const Response200Schema = Type.Array(DriftSchema, { $id: 'Response200' });
export type Response200 = Array<Drift>;

type Request = RequestMeta & { parameters: ExperimentIdDriftSearchPostParams };
type ExperimentIdDriftSearchPostResponse =
  | { response: Response; request: Request; status: 200; data: Response200 }
  | { response: Response; request: Request; status: 422; data: ResponseUNPROCESSABLE_ENTITY }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULT_ERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentIdDriftSearchPostResponse;
