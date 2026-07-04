import {
  Search,
  Bell,
  Menu,
  PanelLeftClose,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useLiveFeed } from "../hooks/useLiveFeed";
import { useNavigate, Link } from "react-router";

export function TopBar({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleMobileMenu,
}) {
  const { user, logout } = useAuth();
  const { data: dashboardData, error: apiError } = useDashboardStats();
  const { connected: wsConnected } = useLiveFeed();
  const navigate = useNavigate();

  const alertCount = dashboardData?.alerts_24h_count ?? 0;

  const isApiLive = !!dashboardData && !apiError;
  const systemStatus = isApiLive ? "LIVE" : "OFFLINE";
  const statusColor = isApiLive ? "text-[#10B981]" : "text-gray-500";
  const dotColor = isApiLive ? "bg-[#10B981]" : "bg-gray-500";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleBadgeColor =
    {
      admin: "text-[#EF4444] bg-[#EF4444]/10",
      analyst: "text-[#F59E0B] bg-[#F59E0B]/10",
      viewer: "text-[#10B981] bg-[#10B981]/10",
    }[user?.role] ?? "text-gray-400 bg-gray-400/10";

  return (
    <div className="h-16 bg-[#1E293B] border-b border-[#334155] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-2xl">
        {/* Desktop Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:p-2 md:hover:bg-[#0F172A] md:rounded-lg md:transition-colors md:text-gray-400 md:hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={
            isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
          }
        >
          {isSidebarCollapsed ? (
            <Menu className="w-5 h-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-9 md:pl-10 pr-4 py-1.5 md:py-2 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4 ml-4 md:ml-6">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] rounded-lg border border-[#334155] cursor-help group"
          title={
            !wsConnected && isApiLive
              ? "System is LIVE, but live ticker is currently disconnected"
              : "System Status"
          }
        >
          <div
            className={`w-2 h-2 rounded-full ${isApiLive ? "animate-pulse" : ""} ${dotColor}`}
          />
          <span className={`text-sm font-medium ${statusColor}`}>
            {systemStatus}
          </span>
        </div>

        <button
          className="relative p-2 hover:bg-[#0F172A] rounded-lg transition-colors group focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          onClick={() => navigate("/dashboard")}
          title={`${alertCount} alerts today`}
          aria-label="View alerts"
        >
          <Bell
            className={`w-5 h-5 transition-colors ${alertCount > 0 ? "text-[#22D3EE] group-hover:text-white" : "text-gray-400"}`}
            aria-hidden="true"
          />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#1E293B] shadow-lg animate-in zoom-in duration-300">
              {alertCount > 99 ? "99+" : alertCount}
            </span>
          )}
        </button>

        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-[#334155]">
          <div className="text-right">
            <p className="text-sm font-medium text-white line-clamp-1">
              {user?.username}
            </p>
            <span
              className={`text-[10px] md:text-[12px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${roleBadgeColor}`}
            >
              {user?.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#334155] flex items-center justify-center text-[#22D3EE] font-bold border border-[#475569]">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Mobile User Icon */}
        <div className="md:hidden w-8 h-8 rounded-lg bg-[#334155] flex items-center justify-center text-[#22D3EE] font-bold border border-[#475569] text-sm">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
