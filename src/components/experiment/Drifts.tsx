import experimentIdDriftSearchPost from '@/api/functions/experimentIdDriftSearchPost';
import { type Drift, type Experiment } from '@/api/models';
import ButtonBadge from '@/components/ButtonBadge';
import { driftsColumns, selectedDrifts } from '@/components/driftsTable';
import EChartsDiagram from '@/components/echarts';
import Paginate from '@/components/Paginate';
import { Button } from '@/components/ui/button';
import { TableContent } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import getQueryPagination from '@/lib/getQueryPagination';
import { useSignals } from '@preact/signals-react/runtime';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useMemo, useState } from 'react';

const deselectNotMatchingTags = (tags: string[]) => {
  selectedDrifts.value = selectedDrifts.value.filter((drift) =>
    tags.every((tag) => drift.tags?.includes(tag) ?? false),
  );
};

const deselectNotMatchingCompletion = (completion: Drift['job_status']) => {
  selectedDrifts.value = selectedDrifts.value.filter((drift) => drift.job_status === completion);
};

type FilterInputProps = {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  completion: Drift['job_status'] | undefined;
  setCompletion: Dispatch<SetStateAction<Drift['job_status'] | undefined>>;
};
const FilterInput = ({ tags, setTags, completion, setCompletion }: FilterInputProps) => {
  const [newFilter, setNewFilter] = useState('');
  const [key, setKey] = useState(+new Date());

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
              setTags([...tags, newFilter]);
              setNewFilter('');
            }
          }}
          value={newFilter}
        />
        <Button
          className="ms-2"
          onClick={() => {
            if (newFilter.length === 0) {
              return;
            }
            const newTags = [...tags, newFilter];
            setTags(newTags);
            deselectNotMatchingTags(newTags);
            setNewFilter('');
          }}
          disabled={newFilter.length === 0}
          size="sm"
        >
          <Plus /> <span className="sr-only">Add Tag</span>
        </Button>
        <div className="ms-2 flex gap-1 grow min-w-1">
          {tags.map((f) => (
            <ButtonBadge
              key={f}
              onClick={() => setTags((filters) => filters.filter((filter) => filter !== f))}
            >
              {f}
            </ButtonBadge>
          ))}
        </div>
        <Select
          key={key}
          value={completion}
          onValueChange={(v) => {
            const newCompletion = v as Drift['job_status'];
            deselectNotMatchingCompletion(newCompletion);
            setCompletion(newCompletion);
          }}
        >
          <SelectTrigger className="grow-0 shrink w-[15ch]">
            <SelectValue placeholder="Completion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Running">Running</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectSeparator />
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setCompletion(undefined);
                setKey(+new Date());
              }}
            >
              Clear
            </Button>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

type DriftsProps = {
  experiment: Experiment;
};
const Drifts: FC<DriftsProps> = ({ experiment }) => {
  useSignals();

  const [page, setPage] = useState(1);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [completionFilter, setCompletionFilter] = useState<Drift['job_status'] | undefined>(
    undefined,
  );

  const drifts = useQuery({
    queryKey: ['experimentDrift', experiment.id, page, tagsFilter.join(','), completionFilter],
    queryFn: () =>
      experimentIdDriftSearchPost({
        params: {
          experiment_id: experiment.id,
          page,
        },
        body: {
          ...(tagsFilter.length > 0 && {
            tags: {
              $all: tagsFilter,
            },
          }),
          ...(completionFilter != null && {
            job_status: completionFilter,
          }),
        },
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
        },
      }),
  });

  const pagination = getQueryPagination(drifts);

  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => driftsColumns(experiment.id), [experiment.id]);

  const table = useReactTable({
    data: drifts.data?.status === 200 ? drifts.data.data : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <FilterInput
        tags={tagsFilter}
        setTags={setTagsFilter}
        completion={completionFilter}
        setCompletion={setCompletionFilter}
      />
      {(drifts.isLoading || drifts.isPending) && <div>Loading...</div>}
      {drifts.isError && <div>Error: {drifts.error.message}</div>}
      {drifts.data?.status === -1 && <div>Network error</div>}
      {drifts.data?.status === 422 && <div>Malformed query</div>}
      {drifts.data?.status === 'default' && (
        <div>
          Unknown error
          {drifts.data.data.message}
        </div>
      )}
      <EChartsDiagram drifts={selectedDrifts.value} />
      {selectedDrifts.value.length > 0 && (
        <div className="container">
          <div className="flex justify-center mt-2">
            <span>
              {selectedDrifts.value.length} drift{selectedDrifts.value.length > 1 ? 's' : null}{' '}
              selected
              <Button
                variant="destructive"
                className="ms-2"
                size="sm"
                onClick={() => (selectedDrifts.value = [])}
              >
                Clear
              </Button>
            </span>
          </div>
        </div>
      )}
      {drifts.data?.status === 200 && <TableContent table={table} columns={columns} />}
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
