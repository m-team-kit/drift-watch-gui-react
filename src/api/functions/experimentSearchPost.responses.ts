import { Type } from '@sinclair/typebox';
import { ExperimentSchema, type Experiment } from '../models/Experiment.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import { type ResponseUNPROCESSABLE_ENTITY } from '../responses/UNPROCESSABLE_ENTITY.js';
import type ExperimentSearchPostParams from './experimentSearchPost.parameters.js';

export const Response200Schema = Type.Array(ExperimentSchema, { $id: 'Response200' });
export type Response200 = Array<Experiment>;

type Request = RequestMeta & { parameters: ExperimentSearchPostParams };
type ExperimentSearchPostResponse =
  | { response: Response; request: Request; status: 200; data: Response200 }
  | { response: Response; request: Request; status: 422; data: ResponseUNPROCESSABLE_ENTITY }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULT_ERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentSearchPostResponse;
