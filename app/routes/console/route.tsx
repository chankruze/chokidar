import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUserId } from "~/lib/session.server";
import { BottomNavList } from "./bottom-nav-list";
import { Sidebar } from "./sidebar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({ userId });
};

export type ConsoleLoader = typeof loader;

export default function ConsoleLayout() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/* <Topbar /> */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {/* <DialogProvider /> */}
          <Outlet />
        </main>
      </div>
      {/* mobile bottom navbar */}
      <nav className="md:hidden">
        <BottomNavList />
      </nav>
    </div>
  );
}
