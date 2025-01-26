import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import '../main.css';

const queryClient = new QueryClient();

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
        {/*
        {' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
        */}
      </div>
      <hr />
      <div className="p-2">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools position="right" />
    </TooltipProvider>
  </QueryClientProvider>
);

export const Route = createRootRoute({
  component: RootComponent,
});
