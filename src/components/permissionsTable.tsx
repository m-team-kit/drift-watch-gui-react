import type { Permission } from '@/api/models/index';
import columnSortButton from '@/components/columnSortButton';
import { ColumnDef } from '@tanstack/react-table';

export const permissionsColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: 'entity',
    header: columnSortButton('Entity'),
  },
  {
    accessorKey: 'level',
    header: 'Level',
  },
];
