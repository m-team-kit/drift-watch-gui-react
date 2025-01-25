import experimentSearchPost from '@/api/functions/experimentSearchPost';
import { experimentsColumns } from '@/components/experimentsTable';
import { DataTable } from '@/components/ui/data-table';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const experiments = useQuery({
    queryKey: ['experiments'],
    queryFn: () =>
      experimentSearchPost({
        body: {},
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
        },
      }),
  });

  if (experiments.isLoading || experiments.isPending) {
    return <div>Loading...</div>;
  }

  if (experiments.isError) {
    return <div>Error: {experiments.error.message}</div>;
  }

  if (experiments.data.status !== 200) {
    switch (experiments.data.status) {
      case -1:
        return <div>Network error</div>;
      case 422:
        return (
          <div>
            Invalid request
            {experiments.data.data.message}
          </div>
        );
      case 'default':
        return (
          <div>
            Unknown error
            {experiments.data.data.message}
          </div>
        );
    }
  }

  return (
    <>
      <div className="mt-2 mb-2 h-[40px]" />
      <DataTable columns={experimentsColumns} data={experiments.data.data} />
    </>
  );
}
