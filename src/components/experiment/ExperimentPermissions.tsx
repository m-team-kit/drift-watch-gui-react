import { type Experiment } from '@/api/models/index';
import { permissionsColumns } from '@/components/permissionsTable';
import { TableContent } from '@/components/ui/data-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';

import { useCallback, useMemo, useState, type FC } from 'react';

type ExperimentPermissmissionsProps = {
  permissions?: Experiment['permissions'];
};
const ExperimentPermissions: FC<ExperimentPermissmissionsProps> = ({ permissions = [] }) => {
  // State variables for sorting order
  const [sorting, setSorting] = useState<SortingState>([]);

  // Sorting handler
  const handleSortChange = useCallback(
    (columnId: string, direction: 'asc' | 'desc' | undefined) => {
      setSorting(direction ? [{ id: columnId, desc: direction === 'desc' }] : []);
    },
    [],
  );

  // Pass the sorting handler to permissionsColumns
  const columns = useMemo(() => permissionsColumns(handleSortChange), [handleSortChange]);

  // React Table component
  const table = useReactTable({
    data: permissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return <TableContent table={table} columns={columns} />;
};

export default ExperimentPermissions;
