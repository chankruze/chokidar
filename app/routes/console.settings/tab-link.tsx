import { NavLink } from "@remix-run/react";
import { NavListItemProps } from "~/components/nav-list-item";
import { cn } from "~/utils/shadcn";

export const TabLink = ({ label, to }: NavListItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "text-stone-500 font-medium py-2 px-4 lg:px-6 border-b-2 border-b-transparent",
          { "text-primary border-b-2 border-b-blue-500 bg-blue-50": isActive }
        )
      }
      end
    >
      {label}
    </NavLink>
  );
};
