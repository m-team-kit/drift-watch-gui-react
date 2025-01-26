import { type PaginationMetadata } from '@/api/models/index';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/button-pagination';

import { range } from 'lodash';
import { useEffect } from 'react';

type PaginateProps = {
  page: number;
  setPage: (page: number) => void;
  pagination?: PaginationMetadata;
  className?: string;
};
const Paginate = ({ page, setPage, pagination, className }: PaginateProps) => {
  useEffect(() => {
    if (pagination?.total_pages !== undefined && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [page, pagination?.total_pages, setPage]);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={pagination?.previous_page !== undefined}
            onClick={() =>
              pagination?.previous_page !== undefined
                ? setPage(pagination.previous_page)
                : undefined
            }
          />
        </PaginationItem>
        {pagination?.total_pages !== undefined &&
          (pagination.total_pages > 1 && pagination.total_pages <= 5 ? (
            range(1, pagination.total_pages + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onClick={() => setPage(p)} key={p}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))
          ) : (
            <>
              <PaginationItem>
                <PaginationLink isActive={pagination.page === 1} onClick={() => setPage(1)} key={1}>
                  1
                </PaginationLink>
              </PaginationItem>
              {pagination.total_pages > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {page >= 3 && pagination.total_pages > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
                </PaginationItem>
              )}
              {page !== 1 && page !== pagination.total_pages && (
                <PaginationItem>
                  <PaginationLink isActive onClick={() => setPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}
              {page <= pagination.total_pages - 2 && pagination.total_pages > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                </PaginationItem>
              )}
              {page < pagination.total_pages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pagination.total_pages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={pagination.page === pagination.total_pages}
                    onClick={() =>
                      pagination.total_pages !== undefined
                        ? setPage(pagination.total_pages)
                        : undefined
                    }
                  >
                    {pagination.total_pages}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          ))}

        {pagination?.total_pages === undefined && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={pagination?.next_page !== undefined}
            onClick={() =>
              pagination?.next_page !== undefined ? setPage(pagination.next_page) : undefined
            }
            data-testid="paginator-next"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
