import { Type } from '@sinclair/typebox';

export const PaginationMetadataSchema = Type.Object(
  {
    total: Type.Optional(Type.Number({})),
    total_pages: Type.Optional(Type.Number({})),
    first_page: Type.Optional(Type.Number({})),
    last_page: Type.Optional(Type.Number({})),
    page: Type.Optional(Type.Number({})),
    previous_page: Type.Optional(Type.Number({})),
    next_page: Type.Optional(Type.Number({})),
  },
  { $id: 'PaginationMetadata' },
);
export type PaginationMetadata = {
  total?: number;
  total_pages?: number;
  first_page?: number;
  last_page?: number;
  page?: number;
  previous_page?: number;
  next_page?: number;
};
