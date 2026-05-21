import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  Globe,
  FileText,
  Menu,
} from "lucide-react";

export default function MobileNavigation({ onToggleMobileMenu }) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: AlertTriangle, label: "Threats", path: "/dashboard/threats" },
    { icon: Globe, label: "Network", path: "/dashboard/network" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-50 px-4 py-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                isActive ? "text-[#22D3EE]" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] md:text-[12px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={onToggleMobileMenu}
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] md:text-[12px] md:text-[12px] font-medium">
            More
          </span>
        </button>
      </div>
    </div>
  );
}
