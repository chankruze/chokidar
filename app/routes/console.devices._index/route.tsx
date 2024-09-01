import { Link, useRouteLoaderData } from "@remix-run/react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { APP_DESCRIPTION, APP_TITLE } from "~/consts";
import type { DevicesLoader } from "../console.devices";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function meta() {
  return [
    { title: `Devices / ${APP_TITLE}` },
    { name: "title", content: APP_TITLE },
    { name: "og:title", content: `Devices / ${APP_TITLE}` },
    { name: "description", content: APP_DESCRIPTION },
    { name: "og:description", content: APP_DESCRIPTION },
  ];
}

export default function DevicesPage() {
  const loaderData = useRouteLoaderData<DevicesLoader>(
    "routes/console.devices"
  );

  if (loaderData?.devices)
    return (
      <div className="min-h-full">
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-outfit text-2xl font-bold">Devices</div>
          {/* action buttons */}
          <div className="flex items-center justify-end gap-1">
            {/* <Button>
            <Download className="size-5" />
            <span>Export</span>
          </Button> */}
            <Link to="new">
              <Button className="gap-1">
                <Plus className="size-5" />
                <span>Add Device</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-4">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-expect-error */}
          <DataTable columns={columns} data={loaderData.devices} />
        </div>
      </div>
    );

  return <div className="p-4">No devices found!</div>;
}
