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

export const experimentsColumns = (
  onSortChange: (columnId: string, direction: 'asc' | 'desc' | undefined) => void,
): ColumnDef<Experiment>[] => [
  {
    accessorKey: 'name',
    header: columnSortButton('Name', onSortChange),
  },
  {
    accessorKey: 'created_at',
    header: columnSortButton('Created', onSortChange),
    cell: (ctx) => new Date(ctx.row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: 'public',
    header: columnSortButton('Public', onSortChange),
  },
  {
    header: 'Actions',
    cell: (ctx) => <ViewExperimentButton experiment={ctx.row.original} />,
  },
];
