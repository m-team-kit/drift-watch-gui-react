import experimentIdDriftIdGet from '@/api/functions/experimentIdDriftIdGet';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

const RouteComponent = () => {
  const auth = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { experimentId, driftId } = Route.useParams();
  const drift = useQuery({
    queryKey: ['experimentDrift', `${experimentId}-${driftId}`],
    queryFn: () =>
      experimentIdDriftIdGet({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params: { experiment_id: experimentId, drift_id: driftId },
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: auth.status !== 'loading',
  });

  if (drift.isLoading || drift.isPending) {
    return <div>Loading...</div>;
  }

  if (drift.isError) {
    return <div>Error: {drift.error.message}</div>;
  }

  if (drift.data.status !== 200) {
    switch (drift.data.status) {
      case -1:
        return <div>Network error</div>;
      case 404:
        return <div>Not found</div>;
      case 'default':
        return (
          <div>
            Unknown error
            {drift.data.data.message}
          </div>
        );
    }
  }

  return (
    <>
      <div className="flex justify-center mb-2 mt-2">
        <div className="grow max-w-[80ch] shrink-0">
          <Button asChild variant="outline">
            <Link to={`/experiment/${experimentId}`}>
              <ArrowLeft /> Back
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Card className="grow max-w-[80ch]">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(drift.data.data.parameters, null, 2)}</pre>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const Route = createFileRoute('/experiment/$experimentId/drift/$driftId')({
  component: RouteComponent,
});
