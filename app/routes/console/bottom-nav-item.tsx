import { NavLink } from "@remix-run/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/utils/shadcn";

export type BottomNavItemProps = {
  to: string;
  icon: LucideIcon;
};

export const BottomNavItem = ({ to, icon: Icon }: BottomNavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        cn("rounded-2xl p-3 duration-150", {
          "bg-yellow-400/10 text-yellow-400": isActive,
          "hover:bg-accent/5": !isActive,
          "bg-red-400/10 text-red-400": isPending,
        })
      }
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
    </NavLink>
  );
};
