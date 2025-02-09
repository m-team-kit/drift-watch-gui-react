import { type Experiment } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const experimentsColumns: ColumnDef<Experiment>[] = [
  {
    accessorKey: 'name',
    header: columnSortButton('Name'),
  },
  {
    accessorKey: 'created_at',
    header: columnSortButton('Created'),
    cell: (ctx) => new Date(ctx.row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: 'public',
    header: columnSortButton('Public'),
  },
  {
    header: 'Actions',
    cell: (ctx) => (
      <Button
        asChild
        disabled={!ctx.row.original.public}
        variant={ctx.row.original.public ? undefined : 'ghost'}
      >
        <Link to={`/experiment/${ctx.row.original.id}`}>
          <Eye /> View
        </Link>
      </Button>
    ),
  },
];
