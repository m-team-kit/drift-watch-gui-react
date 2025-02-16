import { type Experiment } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { Button } from '@/components/ui/button';
import { useUser } from '@/components/UserContext';
import { Link } from '@tanstack/react-router';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

type ViewExperimentButtonProps = { experiment: Experiment };
const ViewExperimentButton = ({ experiment }: ViewExperimentButtonProps) => {
  const user = useUser();

  const canView =
    experiment.public ||
    (user.status === 'ok' &&
      experiment.permissions?.some((perm) => perm.entity === user.id /* && perm.level*/));

  return (
    <Button asChild disabled={!canView} variant={canView ? undefined : 'ghost'}>
      <Link to={`/experiment/${experiment.id}`}>
        <Eye /> View
      </Link>
    </Button>
  );
};

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
    cell: (ctx) => <ViewExperimentButton experiment={ctx.row.original} />,
  },
];
