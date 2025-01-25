import { Type } from '@sinclair/typebox';

export const APIErrorModelSchema = Type.Object(
  {
    code: Type.Optional(Type.Number({ description: 'Error code' })),
    status: Type.Optional(Type.String({ description: 'Error name' })),
    message: Type.Optional(Type.String({ description: 'Error message' })),
    errors: Type.Optional(Type.Unknown()),
  },
  { $id: 'APIErrorModel' },
);
export type APIErrorModel = {
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
  /**
   * Errors
   */
  errors?: unknown;
};
