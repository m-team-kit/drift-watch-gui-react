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
