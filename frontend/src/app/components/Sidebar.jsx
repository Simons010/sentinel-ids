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
  Database,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: AlertTriangle, label: "Threats", path: "/dashboard/threats" },
  { icon: Globe, label: "Network", path: "/dashboard/network" },
  { icon: Database, label: "Data Explorer", path: "/dashboard/explorer" },
  { icon: FileUp, label: "Logs Upload", path: "/dashboard/logsUpload" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar({ isCollapsed, isMobileOpen, onMobileClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || "viewer";

  const filteredNavItems = navItems.filter((item) => {
    if (item.path === "/settings") {
      return userRole === "admin" || user?.username === "d3fau1t";
    }
    if (item.path === "/logsUpload") {
      return (
        userRole === "admin" ||
        userRole === "analyst" ||
        user?.username === "d3fau1t"
      );
    }
    return true;
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    if (onMobileClose) onMobileClose();
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[60] w-64 bg-[#0F172A] border-r border-[#334155] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex flex-col
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    ${isCollapsed ? "md:w-20" : "md:w-64"}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden backdrop-blur-sm transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <div className={sidebarClasses}>
        {/* Logo */}
        <div
          className={`p-6 border-b border-[#334155] ${isCollapsed ? "md:px-4" : ""}`}
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/dashboard"
              onClick={onMobileClose}
              className={`flex items-center ${isCollapsed ? "md:justify-center" : "gap-3"}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {(!isCollapsed || isMobileOpen) && (
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

            {/* Close button for mobile */}
            <button
              onClick={onMobileClose}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
              aria-label="Close Mobile Menu"
            >
              <LogOut className="w-5 h-5 rotate-180" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 p-4 space-y-1 ${isCollapsed ? "md:px-2" : ""}`}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onMobileClose}
                className={`w-full flex items-center ${isCollapsed ? "md:justify-center md:px-3" : "gap-3 px-4"} py-3 rounded-lg transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE] ${
                  isActive
                    ? "bg-[#22D3EE] text-white shadow-lg shadow-[#22D3EE]/20"
                    : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
                }`}
                title={isCollapsed ? item.label : ""}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {(!isCollapsed || isMobileOpen) && (
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
          className={`p-4 border-t border-[#334155] ${isCollapsed ? "md:px-2" : ""}`}
        >
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? "md:justify-center md:px-3" : "gap-3 px-4"} py-3 rounded-lg hover:bg-[#334155]  text-gray-400 hover:text-[#EF4444] transition-all focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]`}
            title={isCollapsed ? "Logout" : ""}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-medium whitespace-nowrap">Logout</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
