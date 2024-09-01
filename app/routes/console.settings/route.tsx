import { Outlet } from "@remix-run/react";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { APP_DESCRIPTION, APP_TITLE } from "~/consts";
import { TabLink } from "./tab-link";

export function meta() {
  return [
    { title: `Settings / ${APP_TITLE}` },
    { name: "title", content: APP_TITLE },
    { name: "og:title", content: `Settings / ${APP_TITLE}` },
    { name: "description", content: APP_DESCRIPTION },
    { name: "og:description", content: APP_DESCRIPTION },
  ];
}

export default function SettingsLayout() {
  return (
    <div className="min-h-full">
      <div className="space-y-4 border-b p-4 pb-0 lg:space-y-6">
        <p className="font-outfit text-2xl font-bold">Settings</p>
        <div className="flex items-center">
          <TabLink to="account" label="Account" />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
