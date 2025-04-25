import experimentSearchPost from '@/api/functions/experimentSearchPost';
import { useAuth } from '@/components/AuthContext';
import { experimentsColumns } from '@/components/experimentsTable';
import Paginate from '@/components/Paginate';
import { TableContent } from '@/components/ui/data-table';
import { API_BASEPATH } from '@/lib/env';
import getQueryPagination from '@/lib/getQueryPagination';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

const HomeComponent = () => {
  const auth = useAuth();

  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]); // Correctly typed sorting state

  const experiments = useQuery({
    queryKey: ['experiments', page, sorting],
    queryFn: () =>
      experimentSearchPost({
        body: {}, // Body remains empty
        params: {
          page,
          sort_by: sorting[0]?.id,
          order_by: sorting[0]?.desc ? 'desc' : 'asc',
        },
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: auth.status !== 'loading',
  });

  const pagination = getQueryPagination(experiments);

  const handleSortChange = useCallback(
    (columnId: string, direction: 'asc' | 'desc' | undefined) => {
      setSorting(direction ? [{ id: columnId, desc: direction === 'desc' }] : []);
      setPage(1); // Reset to the first page when sorting changes
    },
    [],
  );

  // Pass the handler to experimentsColumns
  const columns = useMemo(() => experimentsColumns(handleSortChange), [handleSortChange]);

  // React Table instance
  const table = useReactTable({
    data: experiments.data?.status === 200 ? experiments.data.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (experiments.isLoading || experiments.isPending) {
    return <div>Loading...</div>;
  }

  if (experiments.isError) {
    return <div>Error: {experiments.error.message}</div>;
  }

  if (experiments.data.status !== 200) {
    switch (experiments.data.status) {
      case -1:
        return <div>Network error</div>;
      case 422:
        return (
          <div>
            Invalid request
            {experiments.data.data.message}
          </div>
        );
      case 'default':
        return (
          <div>
            Unknown error
            {experiments.data.data.message}
          </div>
        );
    }
  }

  return (
    <>
      {/* Table content */}
      <TableContent table={table} columns={columns} />
      {/* Pagination */}
      <Paginate
        page={page}
        setPage={setPage}
        pagination={'data' in pagination ? pagination.data : undefined}
        className="mt-2"
      />
    </>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
