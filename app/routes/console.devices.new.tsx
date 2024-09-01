import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { APP_TITLE } from "~/consts";
import { addUserDevice } from "~/data-access/DeviceDAO.server";
import type { ConsoleLoader } from "./console/route";

export const meta: MetaFunction = () => {
  return [
    { title: `Add Device / ${APP_TITLE}` },
    {
      property: "og:title",
      content: `Add Device / ${APP_TITLE}`,
    },
    {
      name: "description",
      content: `Add a new product to your store.`,
    },
  ];
};

export default function NewDevicePage() {
  const consoleLoader = useRouteLoaderData<ConsoleLoader>("routes/console");
  const navigate = useNavigate();
  const { state } = useNavigation();

  const busy = state === "submitting";
  const back = () => navigate("/desk/products");

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button size="icon" onClick={back}>
            <ArrowLeft />
          </Button>
          <div className="font-outfit text-2xl font-bold">Add Device</div>
        </div>
        <div className="flex items-center justify-end gap-1">
          <Link reloadDocument to="/desk/products">
            <Button variant="destructive">Cancel</Button>
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl p-4">
        <Form className="space-y-6" method="post" encType="multipart/form-data">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Device Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="pin">Device PIN</Label>
            <Input id="pin" name="pin" required />
          </div>
          <input name="userId" value={consoleLoader?.userId} hidden readOnly />
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                name="__action"
                value="create"
                disabled={busy}
              >
                {busy ? "Hold on..." : "Generate QR"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const __action = formData.get("__action");

  switch (__action) {
    case "create": {
      const name = formData.get("name") as string;
      const pin = formData.get("pin") as string;
      const userId = formData.get("userId") as string;

      const schema = z.object({
        name: z.string().min(1, "Name must not be empty."),
        pin: z.string().min(4, "PIN must have 4 digits."),
      });

      const _validation = schema.safeParse({ name, pin });
      // send error data in response
      if (!_validation.success) {
        const errors = _validation.error.flatten();
        // return validation errors
        return {
          ok: false,
          validationErrors: errors,
        };
      }

      //   const userId = (await getPartnerId(request)) as string;
      const _result = await addUserDevice(userId, { name, pin });

      if (_result.ok && _result.deviceId) {
        return redirect(`/console/devices/${_result.deviceId}`);
      }

      return json({
        ok: false,
        message: "Unable to add new device.",
        error: _result.error,
      });
    }

    default:
      return json({ ok: false, message: "Unknown action" });
  }
}
