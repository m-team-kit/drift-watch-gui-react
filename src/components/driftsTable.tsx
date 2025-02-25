import { type Drift } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type Table,
  useReactTable,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import EChartsDiagram from '@/components/echarts';
import { Checkbox } from '@/components/ui/checkbox';
import { signal, useComputed } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { useMemo, useState } from 'react';
import { TableContent } from './ui/data-table';

export const selectedDrifts = signal<Array<Drift>>([]);

type HeadCheckProps = {
  table: Table<Drift>;
};
const HeadCheck = ({ table }: HeadCheckProps) => {
  useSignals();

  let all = true;
  let some = false;
  for (const row of table.getCenterRows()) {
    if (!selectedDrifts.value.some((drift) => drift.id === row.original.id)) {
      all = false;
    } else {
      some = true;
    }
  }

  return (
    <Checkbox
      checked={all || (some && 'indeterminate')}
      onCheckedChange={() => {
        if (all) {
          // remove rows from selected
          selectedDrifts.value = selectedDrifts.value.filter(
            (drift) => !table.getCenterRows().some((row) => row.original.id === drift.id),
          );
        } else {
          // add rows without duplicate to selected
          selectedDrifts.value = Array.from(
            new Set<Drift>([
              ...selectedDrifts.value,
              ...table.getCenterRows().map((row) => row.original),
            ]),
          );
        }
      }}
      aria-label="Select all"
    />
  );
};

type CheckProps = {
  drift: Drift;
};
const Check = ({ drift }: CheckProps) => {
  useSignals();
  const isSelected = useComputed(() =>
    selectedDrifts.value.some((select) => select.id === drift.id),
  );

  return (
    <Checkbox
      checked={isSelected.value}
      onCheckedChange={() =>
        isSelected.peek()
          ? (selectedDrifts.value = selectedDrifts.value.filter((select) => select.id !== drift.id))
          : (selectedDrifts.value = selectedDrifts.value.concat(drift))
      }
      aria-label="Select row"
      className="me-3"
    />
  );
};

export const driftsColumns: (experimentId: string) => ColumnDef<Drift>[] = (experimentId) => [
  {
    id: 'select',
    header: ({ table }) => <HeadCheck table={table} />,
    cell: ({ row }) => <Check drift={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
  /*
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (ctx) => (
      <div
        style={{
          overflowWrap: 'break-word',
          maxWidth: '10ch',
        }}
      >
        {ctx.row.original.id.replace('-', '-\u200B')}
      </div>
    ),
  },
   */
  {
    accessorKey: 'created_at',
    header: columnSortButton('Created'),
    cell: (ctx) => new Date(ctx.row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: 'job_status',
    header: columnSortButton('Status'),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: (ctx) => ctx.row.original.tags?.join(', '),
  },
  {
    accessorKey: 'drift_detected',
    header: columnSortButton('Drift'),
    cell: (ctx) => (ctx.row.original.drift_detected ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'schema_version',
    sortingFn: 'alphanumeric',
    header: columnSortButton('Schema'),
  },
  {
    header: 'Actions',
    cell: (ctx) => (
      <Button asChild size="sm" className="w-full">
        <Link to={`/experiment/${experimentId}/drift/${ctx.row.original.id}`}>
          <Eye /> View
        </Link>
      </Button>
    ),
  },
];

type DataTableProps = {
  data: Drift[];
  experimentId: string;
};

export const DriftsTable = ({ data, experimentId }: DataTableProps) => {
  useSignals();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => driftsColumns(experimentId), [experimentId]);

  const table = useReactTable({
    data,
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
      {selectedDrifts.value.length > 0 && (
        <div className="mx-auto max-w-[80ch] mb-2">
          <EChartsDiagram drifts={selectedDrifts.value} />
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
      <TableContent table={table} columns={columns} />
    </>
  );
};
