import { NavListItem } from "~/components/nav-list-item";
import { navLinks } from "./nav-data";

export const NavList = () => {
  return (
    <ul className="space-y-1">
      {navLinks
        .sort((a, b) => (a.priority < b.priority ? -1 : 1))
        .map((link) => (
          <NavListItem key={`nav-${link.to}`} {...link} />
        ))}
    </ul>
  );
};
