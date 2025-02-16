import experimentSearchPost from '@/api/functions/experimentSearchPost';
import { useAuth } from '@/components/auth';
import { experimentsColumns } from '@/components/experimentsTable';
import Paginate from '@/components/Paginate';
import { DataTable } from '@/components/ui/data-table';
import getQueryPagination from '@/lib/getQueryPagination';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

const HomeComponent = () => {
  const auth = useAuth();

  const [page, setPage] = useState(1);
  const experiments = useQuery({
    queryKey: ['experiments', page],
    queryFn: () =>
      experimentSearchPost({
        body: {},
        params: { page },
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: auth.status !== 'loading',
  });

  const pagination = getQueryPagination(experiments);

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
      <div className="mt-2 mb-2 h-[40px]" />
      <DataTable columns={experimentsColumns} data={experiments.data.data} />
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
