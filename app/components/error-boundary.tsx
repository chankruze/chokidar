import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export const ErrorBoundaryComponent = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="h-full w-full space-y-4 p-6 sm:p-8">
        <div className="font-roboto-mono flex flex-wrap items-center gap-2 font-bold text-red-500">
          <span className="rounded-lg bg-red-700/20 px-3 py-2">
            {error.status}
          </span>
          <span className="text-lg capitalize sm:text-2xl">
            {error.statusText}
          </span>
        </div>
        <p className="rounded-lg bg-primary/5 p-3">{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="h-full w-full space-y-6 p-8">
        <div className="font-roboto-mono flex items-center gap-2 font-bold text-red-500">
          <span className="rounded-lg bg-red-700/20 px-3 py-2">Error</span>
          <span className="text-2xl capitalize">Something went wrong ;(</span>
        </div>
        <pre className="rounded-lg bg-primary/5 p-3">{error.message}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
};
