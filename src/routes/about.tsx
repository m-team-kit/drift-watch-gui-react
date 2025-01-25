import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  // @ts-expect-error circular dependency?
  component: AboutComponent,
});

const AboutComponent = () => (
  <div className="p-2">
    <h3>About</h3>
  </div>
);
