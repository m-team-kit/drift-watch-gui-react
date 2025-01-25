import { Type } from '@sinclair/typebox';
import { ExperimentSchema, type Experiment } from '../models/Experiment.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import { type ResponseUNPROCESSABLE_ENTITY } from '../responses/UNPROCESSABLE_ENTITY.js';
import type ExperimentPostParams from './experimentPost.parameters.js';

export const Response201Schema = ExperimentSchema;
export type Response201 = Experiment;

export const Response401Schema = Type.Object(
  {
    error: Type.Optional(Type.String({ description: 'Error name' })),
    error_description: Type.Optional(Type.String({ description: 'Error message' })),
  },
  { $id: 'Response401' },
);
export type Response401 = {
  /**
   * Error name
   */
  error?: string;
  /**
   * Error message
   */
  error_description?: string;
};

export const Response403Schema = Type.Object(
  {
    error: Type.Optional(Type.String({ description: 'Error name' })),
    error_description: Type.Optional(Type.String({ description: 'Error message' })),
  },
  { $id: 'Response403' },
);
export type Response403 = {
  /**
   * Error name
   */
  error?: string;
  /**
   * Error message
   */
  error_description?: string;
};

type Request = RequestMeta & { parameters: ExperimentPostParams };
type ExperimentPostResponse =
  | { response: Response; request: Request; status: 201; data: Response201 }
  | { response: Response; request: Request; status: 401; data: Response401 }
  | { response: Response; request: Request; status: 403; data: Response403 }
  | { response: Response; request: Request; status: 422; data: ResponseUNPROCESSABLE_ENTITY }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULT_ERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentPostResponse;
