import  { type Drift } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const driftsColumns: (experimentId: string) => ColumnDef<Drift>[] = (experimentId) => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
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
    header: 'Drift',
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
