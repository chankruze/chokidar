import { NavLink } from "@remix-run/react";
import { Loader, type LucideIcon } from "lucide-react";
import { cn } from "~/utils/shadcn";

export type NavListItemProps = {
  to: string;
  label: string;
  icon?: LucideIcon;
};

export const NavListItem = ({ to, label, icon: Icon }: NavListItemProps) => {
  return (
    <li className="flex">
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          cn(
            "flex flex-1 items-center justify-between px-4 py-3 font-outfit transition-all duration-300",
            {
              "bg-blue-300/30 text-primary": isActive,
              "hover:bg-accent": !isActive,
              "bg-red-300/30 text-red-500": isPending,
            }
          )
        }
      >
        {({ isPending }) => (
          <>
            <div className="flex items-center gap-3">
              {Icon ? <Icon className="h-5 w-5" /> : null}
              <span>{label}</span>
            </div>
            {isPending ? (
              <div>
                <span>
                  <Loader className="animate-spin" />
                </span>
              </div>
            ) : null}
          </>
        )}
      </NavLink>
    </li>
  );
};
