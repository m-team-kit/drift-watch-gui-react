import experimentIdDriftSearchPost from '@/api/functions/experimentIdDriftSearchPost';
import { type Drift, type Experiment } from '@/api/models';
import ButtonBadge from '@/components/ButtonBadge';
import { DriftsTable } from '@/components/driftsTable';
import Paginate from '@/components/Paginate';
import { Button } from '@/components/ui/button';
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
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';

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
            setTags([...tags, newFilter]);
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
          onValueChange={(v) => setCompletion(v as Drift['job_status'])}
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

  // TODO: deduplicate the <FilterInput filter={filter} setFilter={setFilter} /> in all the returns

  if (drifts.data === undefined || drifts.data.status !== 200) {
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
      </>
    );
  }

  return (
    <>
      <FilterInput
        tags={tagsFilter}
        setTags={setTagsFilter}
        completion={completionFilter}
        setCompletion={setCompletionFilter}
      />
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
