import packageJson from "~/../package.json";
import { APP_TITLE } from "~/consts";
import { NavList } from "./nav-list";

export const Sidebar = () => {
  return (
    <aside className="hidden border-r md:flex md:flex-col md:w-64">
      <div className="p-6 bg-primary text-primary-foreground border-b-4 border-blue-500">
        <p className="font-bold font-outfit text-3xl">{APP_TITLE}</p>
        <p className="italic text-muted-foreground">
          Version {packageJson.version}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <NavList />
      </nav>
    </aside>
  );
};
