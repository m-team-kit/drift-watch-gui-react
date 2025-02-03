import experimentIdDriftSearchPost from '@/api/functions/experimentIdDriftSearchPost';
import { type Experiment } from '@/api/models';
import ButtonBadge from '@/components/ButtonBadge';
import { DriftsTable } from '@/components/driftsTable';
import Paginate from '@/components/Paginate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import getQueryPagination from '@/lib/getQueryPagination';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';

const FilterInput = ({
  filter,
  setFilter,
}: {
  filter: string[];
  setFilter: Dispatch<SetStateAction<string[]>>;
}) => {
  const [newFilter, setNewFilter] = useState('');

  return (
    <div className="mb-2 flex justify-center">
      <div className="flex items-center grow max-w-[80ch]">
        <Label htmlFor="new-tag" className="self-center me-2">
          Filter tag
        </Label>
        <Input
          className="max-w-[14ch]"
          onChange={(e) => setNewFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setFilter([...filter, newFilter]);
              setNewFilter('');
            }
          }}
          value={newFilter}
        />
        <Button
          className="ms-2"
          onClick={() => {
            setFilter([...filter, newFilter]);
            setNewFilter('');
          }}
          size="sm"
        >
          <Plus /> <span className="sr-only">Add Tag</span>
        </Button>
        <div className="ms-2 flex gap-1">
          {filter.map((f) => (
            <ButtonBadge
              key={f}
              onClick={() => setFilter((filters) => filters.filter((filter) => filter !== f))}
            >
              {f}
            </ButtonBadge>
          ))}
        </div>
      </div>
    </div>
  );
};

type DriftsProps = {
  experiment: Experiment;
};
const Drifts: FC<DriftsProps> = ({ experiment }) => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string[]>([]);

  const drifts = useQuery({
    queryKey: ['experimentDrift', experiment.id, page, filter.join(',')],
    queryFn: () =>
      experimentIdDriftSearchPost({
        params: {
          experiment_id: experiment.id,
          page,
        },
        body: {
          ...(filter.length > 0 && {
            tags: {
              $all: filter,
            },
          }),
        },
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
        },
      }),
  });

  const pagination = getQueryPagination(drifts);

  // TODO: deduplicate the <FilterInput filter={filter} setFilter={setFilter} /> in all the returns

  if (drifts.isLoading || drifts.isPending) {
    return (
      <>
        <FilterInput filter={filter} setFilter={setFilter} />
        <div>Loading...</div>
      </>
    );
  }

  if (drifts.isError) {
    return (
      <>
        <FilterInput filter={filter} setFilter={setFilter} />
        <div>Error: {drifts.error.message}</div>
      </>
    );
  }

  if (drifts.data.status !== 200) {
    switch (drifts.data.status) {
      case -1:
        return (
          <>
            <FilterInput filter={filter} setFilter={setFilter} />
            <div>Network error</div>
          </>
        );
      case 422:
        return (
          <>
            <FilterInput filter={filter} setFilter={setFilter} />
            <div>Malformed query</div>
          </>
        );
      case 'default':
        return (
          <>
            <FilterInput filter={filter} setFilter={setFilter} />
            <div>
              Unknown error
              {drifts.data.data.message}
            </div>
          </>
        );
    }
  }

  return (
    <>
      <FilterInput filter={filter} setFilter={setFilter} />
      <DriftsTable data={drifts.data.data} experimentId={experiment.id} />
      <Paginate
        page={page}
        setPage={setPage}
        pagination={'data' in pagination ? pagination.data : undefined}
        className="mt-2"
      />
    </>
  );
};

export default Drifts;
