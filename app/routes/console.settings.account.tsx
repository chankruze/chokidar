import { useSubmit } from "@remix-run/react";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { Button } from "~/components/ui/button";
import { APP_DESCRIPTION, APP_TITLE } from "~/consts";

export function meta() {
  return [
    { title: `Account - Settings / ${APP_TITLE}` },
    { name: "description", content: APP_DESCRIPTION },
  ];
}

export default function AccountSettingsPage() {
  const submit = useSubmit();

  return (
    <div className="h-full p-4 lg:p-6">
      <Button
        variant="destructive"
        onClick={() =>
          submit(null, {
            method: "post",
            action: "/logout",
          })
        }
      >
        Logout
      </Button>
    </div>
  );
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
