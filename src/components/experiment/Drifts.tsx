// Import necessary modules and components
import experimentIdDriftSearchPost from '@/api/functions/experimentIdDriftSearchPost';
import { type Drift, type Experiment } from '@/api/models';
import { useAuth } from '@/components/AuthContext';
import ButtonBadge from '@/components/ButtonBadge';
import { driftsColumns, selectedDrifts } from '@/components/driftsTable';
import EChartsDiagram from '@/components/echarts';
import Paginate from '@/components/Paginate';
import { Button } from '@/components/ui/button';
import { TableContent } from '@/components/ui/data-table';
import { DatePicker } from '@/components/ui/date-picker';
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
import { API_BASEPATH } from '@/lib/env';
import getQueryPagination from '@/lib/getQueryPagination';
import { useSignals } from '@preact/signals-react/runtime';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { addDays, addSeconds } from 'date-fns';
import { Plus } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useCallback, useMemo, useState } from 'react';

// Function to deselect drifts that do not match the provided tags
const deselectNotMatchingTags = (tags: string[]) => {
  selectedDrifts.value = selectedDrifts.value.filter((drift) =>
    tags.every((tag) => drift.tags?.includes(tag) ?? false),
  );
};

// Function to deselect drifts that do not match the provided job status
const deselectNotMatchingCompletion = (completion: Drift['job_status']) => {
  selectedDrifts.value = selectedDrifts.value.filter((drift) => drift.job_status === completion);
};

// Function to deselect drifts outside the specified date range
const deselectOutOfDateRange = (before: Date | undefined, after: Date | undefined) => {
  selectedDrifts.value = selectedDrifts.value.filter((drift) => {
    const createdAt = new Date(drift.created_at);
    return (after == null || createdAt >= after) && (before == null || createdAt <= before);
  });
};

// Props for the FilterInput component
type FilterInputProps = {
  tags: string[]; // List of tags to filter by
  setTags: Dispatch<SetStateAction<string[]>>; // Function to update tags
  completion: Drift['job_status'] | undefined; // Job status filter
  setCompletion: Dispatch<SetStateAction<Drift['job_status'] | undefined>>; // Function to update job status
  before: Date | undefined; // Upper bound for date filter
  setBefore: Dispatch<SetStateAction<Date | undefined>>; // Function to update upper bound
  after: Date | undefined; // Lower bound for date filter
  setAfter: Dispatch<SetStateAction<Date | undefined>>; // Function to update lower bound
};

// Component for filtering drifts based on tags, job status, and date range
const FilterInput = ({
  tags,
  setTags,
  completion,
  setCompletion,
  before,
  setBefore,
  after,
  setAfter,
}: FilterInputProps) => {
  const [newFilter, setNewFilter] = useState(''); // State for new tag input
  const [key, setKey] = useState(+new Date()); // Key to force re-render of Select component

  return (
    <>
      {/* Tag filter input */}
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
          {/* Job status filter */}
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
      {/* Date range filter */}
      <div className="mb-2 max-w-[80ch] mx-auto">
        <div className="flex items-center justify-between max-w-[80ch]">
          <div className="flex items-center">
            <Label htmlFor="after" className="me-2">
              After
            </Label>
            <DatePicker
              id="after"
              date={after}
              setDate={(date) => {
                deselectOutOfDateRange(before, date);
                setAfter(date);
              }}
            />
          </div>
          <div className="flex items-center">
            <Label htmlFor="before" className="mx-2">
              Before
            </Label>
            <DatePicker
              id="before"
              date={before}
              setDate={(date) => {
                // Shift by ~1 day to make bounds inclusive
                const newDate = date ? addSeconds(addDays(date, 1), -1) : undefined;
                deselectOutOfDateRange(newDate, after);
                setBefore(newDate);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Props for the Drifts component
type DriftsProps = {
  experiment: Experiment; // Experiment data
};

// Main component to display and filter drifts
const Drifts: FC<DriftsProps> = ({ experiment }) => {
  useSignals(); // Hook to enable reactive signals

  // State variables for filters and pagination
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [completionFilter, setCompletionFilter] = useState<Drift['job_status'] | undefined>(undefined);
  const [before, setBefore] = useState<Date | undefined>(undefined);
  const [after, setAfter] = useState<Date | undefined>(undefined);

  const auth = useAuth(); // Authentication context

  // Fetch drifts data using react-query
  const drifts = useQuery({
    queryKey: [
      'experimentDrift',
      experiment.id,
      page,
      sorting,
      tagsFilter.join(','),
      completionFilter,
      before,
      after,
    ],
    queryFn: () =>
      experimentIdDriftSearchPost({
        params: {
          experiment_id: experiment.id,
          page,
          sort_by: sorting[0]?.id,
          order_by: sorting[0]?.desc ? 'desc' : 'asc',
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
          ...((before != null || after != null) && {
            created_at: {
              ...(before != null && {
                $lt: before.toISOString(),
              }),
              ...(after != null && {
                $gt: after.toISOString(),
              }),
            },
          }),
        },
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
  });

  const pagination = getQueryPagination(drifts); // Pagination helper

  // Function to handle sorting changes
  const handleSortChange = useCallback(
    (columnId: string, direction: 'asc' | 'desc' | undefined) => {
      setSorting(direction ? [{ id: columnId, desc: direction === 'desc' }] : []);
      setPage(1); // Reset to the first page when sorting changes
    },
    [], // Dependencies array
  );

  // Pass the sorting handler to driftsColumns
  const columns = useMemo(
    () => driftsColumns(experiment.id, handleSortChange),
    [experiment.id, handleSortChange],
  );

  // React Table instance
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
      {/* Filter input component */}
      <FilterInput
        tags={tagsFilter}
        setTags={setTagsFilter}
        completion={completionFilter}
        setCompletion={setCompletionFilter}
        before={before}
        setBefore={setBefore}
        after={after}
        setAfter={setAfter}
      />
      {/* Loading and error states */}
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
      <div className="mb-4" />
      {/* Visualization of selected drifts */}
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
      {/* Table content */}
      {drifts.data?.status === 200 && <TableContent table={table} columns={columns} />}
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

export default Drifts;
