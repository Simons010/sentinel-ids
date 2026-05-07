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

export function TopBar({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuth();
  const { data: dashboardData } = useDashboardStats();
  const { connected } = useLiveFeed();
  const navigate = useNavigate();

  const alertCount = dashboardData?.alerts_24h_count ?? 0;

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
    <div className="h-16 bg-[#1E293B] border-b border-[#334155] px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <Menu className="w-5 h-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs, alerts, IPs..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 ml-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] rounded-lg border border-[#334155]">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-[#10B981] animate-pulse" : "bg-gray-500"}`}
          />
          <span
            className={`text-sm font-medium ${connected ? "text-[#10B981]" : "text-gray-500"}`}
          >
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        <button
          className="relative p-2 hover:bg-[#0F172A] rounded-lg transition-colors group focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          onClick={() => navigate("/")}
          title={`${alertCount} alerts today`}
          aria-label="View alerts"
        >
          <Bell
            className={`w-5 h-5 transition-colors ${alertCount > 0 ? "text-[#22D3EE] group-hover:text-white" : "text-gray-400"}`}
            aria-hidden="true"
          />
          {alertCount > 0 && (
            <>
              <span className="sr-only">{alertCount} unread alerts</span>
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-[#1E293B]" aria-hidden="true">
                {alertCount > 99 ? "99+" : alertCount}
              </span>
            </>
          )}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 pr-2 py-2 bg-[#0F172A] rounded-lg border border-[#334155]">
          <Link to="/settings" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#22D3EE]/30 transition-all">
              <span className="text-xs font-bold text-white">
                {user?.initials ?? "?"}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white leading-tight group-hover:text-[#22D3EE] transition-colors">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name}`
                  : (user?.username ?? "User")}
              </p>
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${roleBadgeColor}`}
              >
                {user?.role ?? "viewer"}
              </span>
            </div>
          </Link>
          <div className="w-px h-8 bg-[#334155] mx-1" />
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-[#334155] rounded-lg transition-colors text-gray-400 hover:text-[#EF4444] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
