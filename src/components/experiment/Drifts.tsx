import experimentIdDriftSearchPost from '@/api/functions/experimentIdDriftSearchPost';
import { type Experiment } from '@/api/models';
import { driftsColumns } from '@/components/driftsTable';
import Paginate from '@/components/Paginate';
import { DataTable } from '@/components/ui/data-table';
import getQueryPagination from '@/lib/getQueryPagination';
import { useQuery } from '@tanstack/react-query';
import { type FC, useMemo, useState } from 'react';

type DriftsProps = {
  experiment: Experiment;
};
const Drifts: FC<DriftsProps> = ({ experiment }) => {
  const [page, setPage] = useState(1);
  const columns = useMemo(() => driftsColumns(experiment.id), [experiment.id]);

  const drifts = useQuery({
    queryKey: ['experimentDrift', experiment.id, page],
    queryFn: () =>
      experimentIdDriftSearchPost({
        params: {
          experiment_id: experiment.id,
          page,
        },
        body: {},
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
        },
      }),
  });

  const pagination = getQueryPagination(drifts);

  if (drifts.isLoading || drifts.isPending) {
    return <div>Loading...</div>;
  }

  if (drifts.isError) {
    return <div>Error: {drifts.error.message}</div>;
  }

  if (drifts.data.status !== 200) {
    switch (drifts.data.status) {
      case -1:
        return <div>Network error</div>;
      case 422:
        return <div>Malformed query</div>;
      case 'default':
        return (
          <div>
            Unknown error
            {drifts.data.data.message}
          </div>
        );
    }
  }

  return (
    <>
      <DataTable columns={columns} data={drifts.data.data} />
      {pagination.status === 'valid' ? (
        <Paginate page={page} setPage={setPage} pagination={pagination.data} />
      ) : (
        pagination.status
      )}
    </>
  );
};

export default Drifts;
