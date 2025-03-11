import { type Experiment } from '@/api/models/index';
import { useAuth } from '@/components/AuthContext';
import { useUser } from '@/components/UserContext';

const useAllowedToEdit = (experiment?: Experiment): boolean => {
  const auth = useAuth();
  const user = useUser();

  return (
    experiment?.permissions?.some(
      (permission) =>
        (permission.level === 'Manage' && user.status === 'ok' && user.id === permission.entity) ||
        ((auth.status === 'logged-in' &&
          auth.user.eduperson_entitlement?.some(
            (entitlement) => permission.entity === entitlement,
          )) ??
          false),
    ) ?? false
  );
};

export default useAllowedToEdit;
