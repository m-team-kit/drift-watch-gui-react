import { type Drift } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { type ColumnDef, type Table } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import DriftParameters from '@/components/DriftParameters';
import { Checkbox } from '@/components/ui/checkbox';
import { signal, useComputed, effect } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';
import { useMemo } from 'react';

// Add this to persist selections
export const selectedDrifts = signal<Array<Drift>>([]);

// Function to get current experiment ID from URL path
export const getCurrentExperimentId = (): string | null => {
  const path = window.location.pathname;
  const match = path.match(/\/experiment\/([^/]+)/);
  return match ? match[1] : null;
};

// Save to localStorage when selections change
effect(() => {
  try {
    const experimentId = getCurrentExperimentId();
    if (experimentId) {
      localStorage.setItem(
        `drift-selections-${experimentId}`,
        JSON.stringify(selectedDrifts.value.map(d => d.id))
      );
    }
  } catch (e) {
    console.error("Failed to save selections to localStorage:", e);
  }
});

// Load from localStorage on initial render
export const initializeSelections = (drifts: Drift[], experimentId: string) => {
  if (!experimentId || !drifts || !Array.isArray(drifts)) {
    return;
  }

  try {
    const savedSelectionIds = localStorage.getItem(`drift-selections-${experimentId}`);
    if (savedSelectionIds) {
      const ids = new Set(JSON.parse(savedSelectionIds));
      const savedDrifts = drifts.filter(drift => drift && ids.has(drift.id));
      selectedDrifts.value = savedDrifts;
    }
  } catch (e) {
    console.error("Failed to restore selections from localStorage:", e);
  }
};

type HeadCheckProps = {
  table: Table<Drift>;
};
const HeadCheck = ({ table }: HeadCheckProps) => {
  useSignals();

  // Create a Set of selected IDs for O(1) lookups
  const selectedIds = useMemo(() =>
    new Set(selectedDrifts.value.map(drift => drift.id)),
    [selectedDrifts.value]
  );

  const visibleRows = table.getRowModel().rows;
  const all = visibleRows.length > 0 && visibleRows.every(row => selectedIds.has(row.original.id));
  const some = !all && visibleRows.some(row => selectedIds.has(row.original.id));

  // With Radix UI Checkbox, we use "indeterminate" string for the indeterminate state
  const checkedState = all ? true : some ? "indeterminate" : false;

  return (
    <Checkbox
      checked={checkedState}
      onCheckedChange={(checked) => {
        if (checked) {
          // Add all visible rows to selection without duplicates
          const newSelections = visibleRows
            .filter(row => !selectedIds.has(row.original.id))
            .map(row => row.original);

          selectedDrifts.value = [...selectedDrifts.value, ...newSelections];
        } else {
          // Remove all visible rows from selection
          const visibleIds = new Set(visibleRows.map(row => row.original.id));
          selectedDrifts.value = selectedDrifts.value.filter(drift => !visibleIds.has(drift.id));
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

  // Add null check to prevent errors
  if (!drift || !drift.id) {
    return null;
  }

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
) => ColumnDef<Drift>[] = (experimentId, onSortChange) => [
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
