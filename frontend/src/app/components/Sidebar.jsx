import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
  Globe,
  BarChart3,
  FileUp,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: AlertTriangle, label: "Threats", path: "/threats" },
  { icon: Globe, label: "Network", path: "/network" },
  { icon: FileUp, label: "Logs Upload", path: "/logsUpload" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ isCollapsed }) {
  const location = useLocation();

  return (
    <div
      className={`hidden h-screen bg-[#0F172A] border-r border-[#334155] md:flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`p-6 border-b border-[#334155] ${isCollapsed ? "px-4" : ""}`}
      >
        <Link
          to="/"
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">
                Sentinel-IDS
              </h1>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                AI-Powered Security
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 p-4 space-y-1 ${isCollapsed ? "px-2" : ""}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#22D3EE] text-white shadow-lg shadow-[#22D3EE]/20"
                  : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
              }`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className={`p-4 border-t border-[#334155] ${isCollapsed ? "px-2" : ""}`}
      >
        <button
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-3" : "gap-3 px-4"} py-3 rounded-lg text-gray-400 hover:bg-[#1E293B] hover:text-white transition-all`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
