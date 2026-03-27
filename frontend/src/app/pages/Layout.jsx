import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { useState } from "react";
import MobileNavigation from "../components/MobileNavigation";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <MobileNavigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
