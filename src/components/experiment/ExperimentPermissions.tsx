import { type Experiment } from '@/api/models/index';
import { permissionsColumns } from '@/components/permissionsTable';
import { DataTable } from '@/components/ui/data-table';
import { type FC } from 'react';

type ExperimentPermissmissionsProps = {
  permissions: Required<Experiment>['permissions'];
};
const ExperimentPermissions: FC<ExperimentPermissmissionsProps> = ({ permissions }) => {
  return <DataTable data={permissions} columns={permissionsColumns} />;
};

export default ExperimentPermissions;
