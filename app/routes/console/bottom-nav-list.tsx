import { BottomNavItem } from "./bottom-nav-item";
import { navLinks } from "./nav-data";

export const BottomNavList = () => {
  return (
    <ul className="grid grid-flow-col grid-rows-1 place-items-center  gap-4 overflow-x-auto border-t p-2">
      {navLinks.map(({ to, icon }) => (
        <BottomNavItem key={`nav-${to}`} to={to} icon={icon} />
      ))}
    </ul>
  );
};
