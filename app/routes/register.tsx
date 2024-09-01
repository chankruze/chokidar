import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { ErrorBoundaryComponent } from "~/components/error-boundary";
import { ErrorDiv } from "~/components/error-div";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { APP_DESCRIPTION, APP_TITLE } from "~/consts";
import { registerUser } from "~/data-access/UserDAO.server";
import { createUserSession, getUserId } from "~/lib/session.server";
import { safeRedirect } from "~/utils/safe-redirect.server";

export const meta: MetaFunction = () => {
  return [
    { title: `Signup / ${APP_TITLE}` },
    { name: "og:title", content: `Signup / ${APP_TITLE}` },
    { name: "description", content: APP_DESCRIPTION },
    { name: "og:description", content: APP_DESCRIPTION },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: to check if the user still exists in db
  const userId = await getUserId(request);
  if (userId) return redirect("/desk");
  return null;
}

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const { state } = useNavigation();
  const actionData = useActionData<typeof action>();

  const busy = state === "submitting";
  const redirectTo = searchParams.get("redirectTo") || "/console";

  return (
    <main className="grid min-h-[100dvh] md:grid-cols-3 md:gap-0">
      {/* left */}
      <div className="flex flex-col justify-between gap-8 bg-primary p-8 text-primary-foreground">
        <div>
          <p className="font-montserrat font-medium uppercase tracking-widest">
            {APP_TITLE}
          </p>
        </div>
        <div className="space-y-4">
          <div className="font-outfit text-4xl font-medium md:text-5xl lg:text-6xl">
            <p>Welcome Back!</p>
          </div>
          <p className="font-poppins lg:text-lg">
            Discover the world&apos;s best community of vendors and business
            owners.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl bg-secondary/10 p-6 font-roboto">
          <p className="line-clamp-3">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nemo
            obcaecati nostrum numquam modi iure dolores dicta! Distinctio itaque
            magnam ullam eaque perspiciatis amet dignissimos nobis!
          </p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">Steve Smith</p>
              <p className="text-xs">Apple Inc.</p>
            </div>
          </div>
        </div>
      </div>
      {/* right */}
      <div className="md:col-span-2 md:overflow-y-auto">
        <div className="mx-auto flex h-full w-full max-w-lg flex-col justify-center gap-8 p-8">
          <div className="space-y-1">
            <h1 className="font-outfit text-3xl font-medium">
              Setup your desk! 💻
            </h1>
            <p className="font-poppins text-stone-500">
              Signup to access the desk
            </p>
          </div>
          {/* form error segment */}
          {actionData &&
          !actionData.ok &&
          typeof actionData.validationErrors === "string" ? (
            <div className="rounded-lg bg-red-300/20 p-4 text-center text-red-500">
              {actionData.validationErrors}
            </div>
          ) : null}
          {/* form start */}
          <Form className="w-full space-y-6" method="post">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="i.e. Alex Washington"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="i.e. alex@example.com"
                required
              />
              {actionData &&
              actionData.validationErrors &&
              actionData.validationErrors.fieldErrors.email ? (
                <ErrorDiv>
                  {actionData.validationErrors.fieldErrors.email.at(0)}
                </ErrorDiv>
              ) : null}
            </div>
            {/* password section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="i.e. Secret@123"
                  required
                />
                {actionData &&
                actionData.validationErrors &&
                actionData.validationErrors.fieldErrors.password ? (
                  <ErrorDiv>
                    {actionData.validationErrors.fieldErrors.password.at(0)}
                  </ErrorDiv>
                ) : null}
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="i.e. Secret@123"
                  required
                />
                {actionData &&
                actionData.validationErrors &&
                actionData.validationErrors.fieldErrors.confirmPassword ? (
                  <ErrorDiv>
                    {actionData.validationErrors.fieldErrors.confirmPassword.at(
                      0
                    )}
                  </ErrorDiv>
                ) : null}
              </div>
            </div>
            {/* remember me */}
            <div className="flex items-center gap-2">
              <Checkbox name="remember" id="remember" />
              <Label htmlFor="remember">Remember me for a week</Label>
            </div>
            {/* redirect to */}
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <Button
                className="w-full"
                type="submit"
                name="__action"
                value="signup"
                disabled={busy}
              >
                {busy ? "Processing..." : "Signup"}
              </Button>
            </div>
          </Form>
          {/* form end */}
          <div className="text-center font-roboto text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  const __action = formData.get("__action");

  switch (__action) {
    case "signup": {
      const {
        ok,
        data: userId,
        validationErrors,
        error,
      } = await registerUser(formData);

      if (ok && userId) {
        const remember = formData.get("remember") === "on";

        return createUserSession({
          request,
          userId,
          remember,
          redirectTo,
        });
      }

      return json({ ok: false, validationErrors, error }, { status: 500 });
    }

    default: {
      throw new Error("Unknown action");
    }
  }
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
