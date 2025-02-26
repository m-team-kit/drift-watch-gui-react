import { type Drift } from '@/api/models/index';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type PropsWithChildren } from 'react';

const DialogBase = ({ children }: PropsWithChildren) => (
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Parameters</DialogTitle>
      {children}
    </DialogHeader>
  </DialogContent>
);

type DriftParametersProps = {
  drift: Drift;
};
const DriftParameters = ({ drift }: DriftParametersProps) => {
  /*
  const auth = useAuth();

  const drift = useQuery({
    queryKey: ['experimentDrift', `${experimentId}-${driftId}`],
    queryFn: () =>
      experimentIdDriftIdGet({
        params: { experiment_id: experimentId, drift_id: driftId },
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: auth.status !== 'loading',
  });

  if (drift.isLoading || drift.isPending) {
    return <DialogBase>Loading...</DialogBase>;
  }

  if (drift.isError) {
    return <DialogBase>Error: {drift.error.message}</DialogBase>;
  }

  if (drift.data.status !== 200) {
    switch (drift.data.status) {
      case -1:
        return <DialogBase>Network error</DialogBase>;
      case 403:
        return <DialogBase>Forbidden</DialogBase>;
      case 404:
        return <DialogBase>Not found</DialogBase>;
      case 'default':
        return (
          <DialogBase>
            Unknown error
            {drift.data.data.message}
          </DialogBase>
        );
    }
  }

  const parameters = drift.data.data.parameters;
   */
  const parameters = drift.parameters;

  return (
    <DialogBase>
      <pre>{JSON.stringify(parameters, null, 2)}</pre>
    </DialogBase>
  );
};

export default DriftParameters;
