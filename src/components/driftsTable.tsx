import { type Drift } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import EChartsDiagram from '@/components/echarts';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignals } from '@preact/signals-react/runtime';
import { useMemo, useState } from 'react';
import { TableContent } from './ui/data-table';

export const driftsColumns: (experimentId: string) => ColumnDef<Drift>[] = (experimentId) => [
  {
    id: 'select',
    /*
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
     */
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="me-3"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    header: columnSortButton('Schema Version'),
  },
  {
    header: 'Actions',
    cell: (ctx) => (
      <Button asChild>
        <Link href={`/experiment/${experimentId}/drift/${ctx.row.original.id}`}>
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
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => driftsColumns(experimentId), [experimentId]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <>
      <TableContent table={table} columns={columns} />
      {table.getIsSomeRowsSelected() && (
        <div className="p-4 mx-auto max-w-[80ch]">
          <EChartsDiagram drifts={table.getSelectedRowModel().rows.map((row) => row.original)} />
        </div>
      )}
    </>
  );
};
