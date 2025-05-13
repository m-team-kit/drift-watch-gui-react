import { type Drift } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import DriftParameters from '@/components/DriftParameters';
import { Checkbox } from '@/components/ui/checkbox';
import { signal, useComputed } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

export const selectedDrifts = signal<Set<string>>(new Set());

type HeadCheckProps = {
  table: Table<Drift>;
};

// Function to evaluate the status of HeadCheck
const getHeadCheckStatus = (table: Table<Drift>): 'all' | 'some' | 'none' => {
  const displayedRowIds = table.getCenterRows().map((row) => row.original.id);
  const selectedRowIds = Array.from(selectedDrifts.value).filter((id) =>
    displayedRowIds.includes(id),
  );

  if (selectedRowIds.length === displayedRowIds.length && displayedRowIds.length > 0) {
    return 'all';
  }
  if (selectedRowIds.length > 0) {
    return 'some';
  }
  return 'none';
};

const HeadCheck = ({ table }: HeadCheckProps) => {
  useSignals();

  // Dynamically calculate the status without storing any state
  const status = getHeadCheckStatus(table);
  const all = status === 'all';
  const some = status === 'some';

  return (
    <Checkbox
      checked={all || (some && 'indeterminate')}
      onCheckedChange={() => {
        const displayedRowIds = table.getCenterRows().map((row) => row.original.id);
        if (all) {
          // Deselect all displayed rows
          selectedDrifts.value = new Set(
            Array.from(selectedDrifts.value).filter((id) => !displayedRowIds.includes(id)),
          );
        } else {
          // Select all displayed rows
          selectedDrifts.value = new Set([...selectedDrifts.value, ...displayedRowIds]);
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

  // Access the signal value directly, which will cause a re-render when it changes
  const isSelected = selectedDrifts.value.has(drift.id);

  return (
    <Checkbox
      checked={isSelected}
      onCheckedChange={(checked) => {
        const updatedSet = new Set(selectedDrifts.value);
        if (checked === false) {
          // Remove the drift from the selected set
          updatedSet.delete(drift.id);
        } else {
          // Add the drift to the selected set
          updatedSet.add(drift.id);
        }
        selectedDrifts.value = updatedSet; // Update the signal
      }}
      aria-label="Select row"
      className="me-3"
    />
  );
};

export const driftsColumns: (
  experimentId: string,
  onSortChange: (columnId: string, direction: 'asc' | 'desc' | undefined) => void,
) => ColumnDef<Drift>[] = (_, onSortChange) => [
  {
    id: 'select',
    header: ({ table }) => <HeadCheck table={table} />,
    cell: ({ row }) => <Check drift={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: columnSortButton('Created', onSortChange),
    cell: (ctx) => new Date(ctx.row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: 'job_status',
    header: columnSortButton('Status', onSortChange),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: (ctx) => ctx.row.original.tags?.join(', '),
  },
  {
    accessorKey: 'drift_detected',
    header: columnSortButton('Drift', onSortChange),
    cell: (ctx) => (ctx.row.original.drift_detected ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'schema_version',
    sortingFn: 'alphanumeric',
    header: columnSortButton('Schema', onSortChange),
  },
  {
    header: 'Actions',
    cell: (ctx) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="w-full">
            <Eye /> View
          </Button>
        </DialogTrigger>
        <DriftParameters drift={ctx.row.original} />
      </Dialog>
    ),
  },
];
