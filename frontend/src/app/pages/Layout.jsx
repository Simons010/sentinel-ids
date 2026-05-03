import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { LiveActivityTicker } from "../components/LiveActivityTicker";
import { EventDetailsDialog } from "../components/EventDetailsDialog";
import { useLiveFeed } from "../hooks/useLiveFeed";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useState } from "react";
import MobileNavigation from "../components/MobileNavigation";

export default function Layout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { events, connected } = useLiveFeed();
  
  // Initialize dashboard stats here with toasts enabled to make them system-wide
  useDashboardStats(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
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

        {/* Global Live Ticker */}
        <LiveActivityTicker 
          events={events} 
          connected={connected}
          onEventClick={handleEventClick}
        />

        <EventDetailsDialog 
          event={selectedEvent} 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
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
