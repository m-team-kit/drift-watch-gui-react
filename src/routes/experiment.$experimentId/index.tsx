import experimentIdGet from '@/api/functions/experimentIdGet';
import { useAuth } from '@/components/AuthContext';
import Drifts from '@/components/experiment/Drifts';
import ExperimentPermissions from '@/components/experiment/ExperimentPermissions';
import PublicCheckbox from '@/components/experiment/PublicCheckbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/components/UserContext';
import { API_BASEPATH } from '@/lib/env';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

const RouteComponent = () => {
  const auth = useAuth();
  const user = useUser();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { experimentId } = Route.useParams();
  const experiment = useQuery({
    queryKey: ['experiment', experimentId],
    queryFn: () =>
      experimentIdGet({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params: { experiment_id: experimentId },
        config: {
          basePath: API_BASEPATH,
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: auth.status !== 'loading',
  });

  if (experiment.isLoading || experiment.isPending) {
    return <div>Loading...</div>;
  }

  if (experiment.isError) {
    return <div>Error: {experiment.error.message}</div>;
  }

  if (experiment.data.status !== 200) {
    switch (experiment.data.status) {
      case -1:
        return <div>Network error</div>;
      case 404:
        return <div>Not found</div>;
      case 'default':
        return (
          <div>
            Unknown error
            {experiment.data.data.message}
          </div>
        );
    }
  }

  const allowedToEdit =
    experiment.data.data.permissions?.some(
      (permission) =>
        (permission.level === 'Manage' && user.status === 'ok' && user.id === permission.entity) ||
        ((auth.status === 'logged-in' &&
          auth.user.eduperson_entitlement?.some(
            (entitlement) => permission.entity === entitlement,
          )) ??
          false),
    ) ?? false;

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-xl">Experiment {experiment.data.data.id}</h1>
      </div>
      <Tabs defaultValue="drifts">
        <div className="flex justify-center">
          <div className="flex mt-2 grow max-w-[80ch] justify-between">
            <div className="w-[10ch]">
              <Button asChild variant="outline" className="me-2">
                <Link to="/">
                  <ArrowLeft /> Back
                </Link>
              </Button>
            </div>
            <TabsList>
              <TabsTrigger value="drifts">Drifts</TabsTrigger>
              {experiment.data.data.permissions !== undefined && (
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              )}
            </TabsList>
            <div className="w-[10ch]" />
          </div>
        </div>
        <TabsContent value="drifts">
          <Drifts experiment={experiment.data.data} />
        </TabsContent>
        {experiment.data.data.permissions !== undefined && (
          <TabsContent value="permissions">
            <ExperimentPermissions permissions={experiment.data.data.permissions} />
            <PublicCheckbox experiment={experiment.data.data} editable={allowedToEdit} />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};

export const Route = createFileRoute('/experiment/$experimentId/')({
  component: RouteComponent,
});
