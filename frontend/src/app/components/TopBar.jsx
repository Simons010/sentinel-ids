import { Search, Bell, User, Menu, PanelLeftClose } from "lucide-react";

export function TopBar({ onToggleSidebar, isSidebarCollapsed }) {
  return (
    <div className="h-16 bg-[#1E293B] border-b border-[#334155] px-6 flex items-center justify-between">
      {/* Left Section - Toggle Button + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-[#0F172A] rounded-lg transition-colors text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-expanded={!isSidebarCollapsed}
        >
          {isSidebarCollapsed ? (
            <Menu className="w-5 h-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search logs, alerts, IPs..."
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Live Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] rounded-lg border border-[#334155]">
          <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-[#10B981]">LIVE</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-[#0F172A] rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]">
          <Bell className="w-5 h-5 text-gray-400" aria-hidden="true" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-xs rounded-full flex items-center justify-center">
            7
            <span className="sr-only">unread notifications</span>
          </span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 pl-3 pr-4 py-2 hover:bg-[#0F172A] rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Security Analyst</p>
          </div>
        </button>
      </div>
    </div>
  );
}
