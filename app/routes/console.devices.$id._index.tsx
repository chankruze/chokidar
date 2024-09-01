import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link, useRouteLoaderData, useSubmit } from "@remix-run/react";
import { ArrowLeft, Link2Off } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { deleteUserDevice } from "~/data-access/DeviceDAO.server";
import { copy } from "~/utils/click-to-copy";
import { generateQRCode } from "~/utils/qr";
import { DeviceLoader } from "./console.devices.$id";
import type { ConsoleLoader } from "./console/route";

export default function DevicePage() {
  const consoleLoader = useRouteLoaderData<ConsoleLoader>("routes/console");
  const deviceLoaderData = useRouteLoaderData<DeviceLoader>(
    "routes/console.devices.$id"
  );
  const [qrCode, setQrCode] = useState("");
  const submit = useSubmit();

  const deleteDevice = () =>
    submit(
      { __action: "delete", userId: consoleLoader?.userId as string },
      { navigate: false, method: "post" }
    );

  useEffect(() => {
    const loadQR = async () => {
      try {
        const qrCodeUrl = await generateQRCode({
          deviceId: deviceLoaderData?.device?._id,
          devicePin: deviceLoaderData?.device?.pin,
        });
        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    loadQR();
  }, []);

  if (!deviceLoaderData?.device) return null;

  return (
    <div className="h-full">
      <div className="flex items-center justify-between gap-4 border-b p-4">
        {/* back and title */}
        <div className="flex items-center gap-4">
          <Link to="/console/devices">
            <Button size="icon">
              <ArrowLeft />
            </Button>
          </Link>
          <p className="line-clamp-1 font-outfit text-2xl font-bold">
            {deviceLoaderData.device?.name}
          </p>
        </div>
        {/* action buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="destructive"
            onClick={deleteDevice}
            className="gap-1"
          >
            <Link2Off className="size-5" />
            <span>Unlink</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {/* QR */}
        <div className="mx-auto lg:mx-0 flex size-48 items-center justify-center border">
          {qrCode ? (
            <img
              src={qrCode}
              alt={`${deviceLoaderData.device.name} Device Link QR`}
              className="h-full w-full object-cover"
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        {/* Device Info */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm">Device ID</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => copy(deviceLoaderData.device?._id as string)}
                >
                  <p className="text-xl lg:text-3xl font-bold font-roboto-mono">
                    {deviceLoaderData.device._id}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-1">
            <p className="text-sm">Device PIN</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => copy(deviceLoaderData.device?.pin as string)}
                >
                  <p className="text-xl lg:text-3xl font-bold font-roboto-mono">
                    {deviceLoaderData.device.pin}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to copy</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const __action = formData.get("__action");

  switch (__action) {
    case "delete": {
      const userId = formData.get("userId") as string;
      const deviceId = params?.id as string;
      console.log({ userId, deviceId });
      await deleteUserDevice(deviceId, userId);
      return redirect("/console/devices");
    }

    default: {
      throw new Error("Unknown action!");
    }
  }
}
