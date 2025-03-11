import { type Experiment } from '@/api/models/index';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type TableMeta<Permission> = {
    experiment?: Experiment;
  };
}
