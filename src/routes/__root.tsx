import AuthProvider from '@/components/auth';
import LoginButton from '@/components/LoginButton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import '../main.css';

const RouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );
const QueryDevTools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      );

const queryClient = new QueryClient();

const RootComponent = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="p-2 flex gap-2 text-lg justify-between">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <LoginButton />
        </div>
        <hr />
        <div className="p-2">
          <Outlet />
        </div>
        <RouterDevtools />
        <QueryDevTools />
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export const Route = createRootRoute({
  component: RootComponent,
});
