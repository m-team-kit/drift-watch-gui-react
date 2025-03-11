import experimentIdPut from '@/api/functions/experimentIdPut';
import { type Experiment, type Permission } from '@/api/models/index';
import { useAuth } from '@/components/AuthContext';
import columnSortButton from '@/components/columnSortButton';
import { useExperiment } from '@/components/experiment/experimentContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { API_BASEPATH } from '@/lib/env';
import useAllowedToEdit from '@/lib/useAllowedToEdit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';

type ChangePermissionCellProps = {
  permission: Required<Experiment>['permissions'][number];
};
const ChangePermisionCell = ({ permission }: ChangePermissionCellProps) => {
  const experiment = useExperiment();
  const allowed = useAllowedToEdit(experiment);
  const auth = useAuth();
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: async (level: Required<Experiment>['permissions'][number]['level']) => {
      const response = await experimentIdPut({
        params: { experiment_id: experiment.id },
        body: {
          name: experiment.name,
          description: experiment.description,
          public: experiment.public,
          permissions: [
            ...(experiment.permissions?.filter(
              (permission) => permission.entity === permission.entity,
            ) ?? []),
            {
              entity: permission.entity,
              level: level,
            },
          ],
          // TODO: generator support read-only fields as omitted for requests
        } as Experiment,
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ['experiment', experiment.id],
      });
      return response;
    },
  });

  if (!allowed) {
    return permission.level;
  }

  return (
    <Select
      onValueChange={(value) => {
        update.mutate(value as Required<Experiment>['permissions'][number]['level']);
      }}
      defaultValue={permission.level}
    >
      <SelectTrigger>
        <SelectValue placeholder="permission" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Permission</SelectLabel>
          <SelectItem value="Read">Read</SelectItem>
          <SelectItem value="Edit">Edit</SelectItem>
          <SelectItem value="Manage">Manage</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const permissionsColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: 'entity',
    header: columnSortButton('Entity'),
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: (ctx) => <ChangePermisionCell permission={ctx.row.original} />,
  },
];
