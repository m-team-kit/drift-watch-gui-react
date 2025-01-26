import { type PaginationMetadata, PaginationMetadataSchema } from '@/api/models/index';
import { Value } from '@sinclair/typebox/value';
import { type UseQueryResult } from '@tanstack/react-query';

type PaginationMeta =
  | {
      // loading, missing, ...
      status: 'unavailable';
    }
  | {
      // failed to validate
      status: 'invalid';
    }
  | {
      status: 'valid';
      data: PaginationMetadata;
    };
const getQueryPagination = (
  query: UseQueryResult<{ response: Response; status: number | 'default' }>,
): PaginationMeta => {
  if (
    query.data?.status !== undefined &&
    typeof query.data.status === 'number' &&
    query.data.status >= 200 &&
    query.data.status < 300
  ) {
    const header = query.data.response.headers.get('X-Pagination');
    if (header == null) {
      console.warn("Missing 'X-Pagination' header");
      return { status: 'invalid' };
    }
    try {
      const data = Value.Parse(PaginationMetadataSchema, JSON.parse(header));
      return { status: 'valid', data };
    } catch (e) {
      console.warn("Failed to parse 'X-Pagination' header", e);
      return { status: 'invalid' };
    }
  }
  return { status: 'unavailable' };
};

export default getQueryPagination;
