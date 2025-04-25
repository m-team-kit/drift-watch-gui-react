import { type Experiment } from '@/api/models/index';
import { permissionsColumns } from '@/components/permissionsTable';
import { DataTable } from '@/components/ui/data-table';
import { type FC } from 'react';

type ExperimentPermissmissionsProps = {
  permissions: Required<Experiment>['permissions'];
};
const ExperimentPermissions: FC<ExperimentPermissmissionsProps> = ({ permissions }) => {
  const onSortChange = (columnId: string, direction: 'asc' | 'desc' | undefined) => {};
  return <DataTable data={permissions} columns={permissionsColumns(onSortChange)} />;
};

export default ExperimentPermissions;
