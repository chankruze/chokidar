import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserDevicesForListing } from "~/data-access/DeviceDAO.server";
import { requireUserId } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const devices = await getUserDevicesForListing(userId);
  return json({ devices });
}

export type DevicesLoader = typeof loader;

export default function DevicesLayout() {
  return <Outlet />;
}
