import { Type } from '@sinclair/typebox';
import { SchemaSchema, type Schema } from '../models/Schema.js';

export const UserSearchPostParamsBodySchema = SchemaSchema;
export type UserSearchPostParamsBody = Schema;
export const UserSearchPostParamsParamsSchema = Type.Object(
  {
    page: Type.Optional(Type.Number({ default: 1, minimum: 1 })),
    page_size: Type.Optional(Type.Number({ default: 10, minimum: 1, maximum: 100 })),
  },
  { $id: 'UserSearchPostParamsParams' },
);
export type UserSearchPostParamsParams = {
  page?: number;
  page_size?: number;
};
type UserSearchPostParams = {
  body: UserSearchPostParamsBody;
  params?: UserSearchPostParamsParams;
};

export default UserSearchPostParams;
