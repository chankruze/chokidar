import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { APP_TITLE } from "~/consts";
import { getUserDeviceById } from "~/data-access/DeviceDAO.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (id) {
    const device = await getUserDeviceById(id);
    return json({ device });
  }

  return json({ device: null });
};

export type DeviceLoader = typeof loader;

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.device?.name} / ${APP_TITLE}` },
    {
      property: "og:title",
      content: `${data?.device?.name} / ${APP_TITLE}`,
    },
    {
      name: "description",
      content: `${data?.device?.description}`,
    },
  ];
};

export default function DevicePage() {
  return <Outlet />;
}
