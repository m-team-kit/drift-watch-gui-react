import { createFileRoute } from '@tanstack/react-router';

const RouteComponent = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-10">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-lg">This is the privacy policy page. Please read it carefully.</p>
      <a href="/" className="mt-6 text-blue-500 hover:underline">
        Go back to Home
      </a>
    </div>
  );
};

export const Route = createFileRoute('/PrivacyPolicy')({
  component: RouteComponent,
});
