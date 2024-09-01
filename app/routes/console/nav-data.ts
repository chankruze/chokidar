import {
  AlertTriangle,
  LayoutDashboard,
  Settings,
  Smartphone,
} from "lucide-react";
import type { BottomNavItemProps } from "./bottom-nav-item";

type NavLinkType = {
  to: string;
  label: string;
  priority: number;
} & BottomNavItemProps;

export const navLinks: NavLinkType[] = [
  {
    to: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    priority: 1,
  },
  {
    to: "devices",
    label: "Devices",
    icon: Smartphone,
    priority: 2,
  },
  {
    to: "alerts",
    label: "Alerts",
    icon: AlertTriangle,
    priority: 3,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
    priority: 1000,
  },
];
