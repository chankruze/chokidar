import { ActionFunctionArgs, json } from "@remix-run/node";
import { getUserDeviceById } from "~/data-access/DeviceDAO.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    try {
      const { deviceId, devicePin } = await request.json();

      if (!deviceId || !devicePin) {
        return json(
          { ok: false, message: "Device ID and PIN are required" },
          { status: 400 }
        );
      }

      const device = await getUserDeviceById(deviceId);

      if (!device) {
        return json(
          { ok: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      // If authenticated, return success response
      if (device.pin === devicePin) {
        return json(
          { ok: true, message: "Device authenticated successfully" },
          { status: 200 }
        );
      }

      return json({ ok: false, message: "Incorrect PIN" }, { status: 401 });
    } catch (error) {
      console.error(error);
      return json(
        { ok: false, message: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
