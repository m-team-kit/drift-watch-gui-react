import { Type } from '@sinclair/typebox';
import { DriftSchema, type Drift } from '../models/Drift.js';
import { type RequestMeta } from '../request.js';
import { type ResponseDEFAULTERROR } from '../responses/DEFAULT_ERROR.js';
import { type ResponseUNPROCESSABLEENTITY } from '../responses/UNPROCESSABLE_ENTITY.js';
import type ExperimentIdDriftIdPutParams from './experimentIdDriftIdPut.parameters.js';

export const Response200Schema = DriftSchema;
export type Response200 = Drift;

export const Response401Schema = Type.Object(
  {
    code: Type.Optional(Type.Number({ description: 'HTTP status code' })),
    status: Type.Optional(Type.String({ description: 'HTTP status message' })),
    message: Type.Optional(Type.String({ description: 'Error message' })),
  },
  { $id: 'Response401' },
);
export type Response401 = {
  /**
   * HTTP status code
   */
  code?: number;
  /**
   * HTTP status message
   */
  status?: string;
  /**
   * Error message
   */
  message?: string;
};

export const Response403Schema = Type.Object(
  {
    code: Type.Optional(Type.Number({ description: 'HTTP status code' })),
    status: Type.Optional(Type.String({ description: 'HTTP status message' })),
    message: Type.Optional(Type.String({ description: 'Error message' })),
  },
  { $id: 'Response403' },
);
export type Response403 = {
  /**
   * HTTP status code
   */
  code?: number;
  /**
   * HTTP status message
   */
  status?: string;
  /**
   * Error message
   */
  message?: string;
};

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

type Request = RequestMeta & { parameters: ExperimentIdDriftIdPutParams };
type ExperimentIdDriftIdPutResponse =
  | { response: Response; request: Request; status: 200; data: Response200 }
  | { response: Response; request: Request; status: 401; data: Response401 }
  | { response: Response; request: Request; status: 403; data: Response403 }
  | { response: Response; request: Request; status: 404; data: Response404 }
  | { response: Response; request: Request; status: 422; data: ResponseUNPROCESSABLEENTITY }
  | { response: Response; request: Request; status: 'default'; data: ResponseDEFAULTERROR }
  | { response: Response; request: Request; status: -1 };

export default ExperimentIdDriftIdPutResponse;
