import { Type } from '@sinclair/typebox';

export const UserSchema = Type.Object(
  {
    id: Type.String({ format: 'uuid', readOnly: true }),
    created_at: Type.String({ readOnly: true }),
    subject: Type.Optional(Type.String({ readOnly: true })),
    issuer: Type.Optional(Type.String({ readOnly: true })),
    email: Type.Optional(Type.String({ format: 'email', readOnly: true })),
  },
  { $id: 'User' },
);
export type User = {
  id: string;
  created_at: string;
  subject?: string;
  issuer?: string;
  email?: string;
};
