import { motion, useAnimationControls } from "motion/react";
import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  Shield,
  Eye,
  Lock,
  Wifi,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";

const SEVERITY_ICON = {
  critical: { icon: AlertTriangle, color: "#EF4444", label: "Critical" },
  high: { icon: AlertTriangle, color: "#F97316", label: "High" },
  medium: { icon: Eye, color: "#F59E0B", label: "Medium" },
  low: { icon: Shield, color: "#10B981", label: "Low" },
  informational: { icon: Info, color: "#6B7280", label: "Info" },
};

const STATIC_ACTIVITIES = [
  {
    icon: Shield,
    text: "Blocked SQL injection attempt from 185.220.101.54",
    color: "#10B981",
    severity: "low",
    timestamp: new Date().toISOString(),
  },
  {
    icon: AlertTriangle,
    text: "DDoS attack detected targeting web-server-03",
    color: "#EF4444",
    severity: "critical",
    timestamp: new Date().toISOString(),
  },
  {
    icon: Eye,
    text: "Suspicious login pattern detected from 198.50.133.21",
    color: "#F59E0B",
    severity: "medium",
    timestamp: new Date().toISOString(),
  },
  {
    icon: Lock,
    text: "Brute force attempt blocked on SSH port 22",
    color: "#10B981",
    severity: "low",
    timestamp: new Date().toISOString(),
  },
  {
    icon: Wifi,
    text: "Anomalous network traffic detected on VLAN 100",
    color: "#F59E0B",
    severity: "medium",
    timestamp: new Date().toISOString(),
  },
];

export function LiveActivityTicker({
  events = [],
  onEventClick,
  connected = true,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  // Memoize activities to prevent unnecessary re-renders
  const activities = useMemo(() => {
    if (!connected) return [];
    if (events.length > 0) {
      return events.map((e) => {
        const severityCfg =
          SEVERITY_ICON[e.severity] || SEVERITY_ICON.informational;
        const { icon, color } = severityCfg;

        // Format event text based on available data
        let text = e.text || "Security event detected";
        if (!e.text && e.attack_type && e.src_ip) {
          text = `${e.attack_type} from ${e.src_ip}`;
        } else if (!e.text && e.attack_type) {
          text = `${e.attack_type} detected`;
        }

        return {
          ...e,
          icon,
          text,
          color,
          severityLabel: severityCfg.label,
        };
      });
    }
    return STATIC_ACTIVITIES;
  }, [events, connected]);

  // Duplicate activities for seamless loop (triple for safety)
  const duplicated = useMemo(
    () => [...activities, ...activities, ...activities],
    [activities],
  );

  // Adjust animation duration based on content length
  const animationDuration = Math.max(30, activities.length * 4);

  useEffect(() => {
    if (isPaused || !connected || activities.length === 0) {
      controls.stop();
    } else {
      controls.start({
        x: [0, "-33.33%"],
        transition: {
          duration: animationDuration,
          repeat: Infinity,
          ease: "linear",
        },
      });
    }
  }, [isPaused, activities, animationDuration, controls, connected]);

  return (
    <div
      className="h-12 bg-[#0F172A]/80 backdrop-blur-md border-y border-[#1E293B] overflow-hidden relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 px-3 flex items-center bg-[#0F172A] z-20 border-r border-[#1E293B]">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-red-500 animate-pulse" : "bg-gray-600"}`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {connected ? "Live Feed" : "Disconnected"}
          </span>
        </div>
      </div>

      {!connected ? (
        <div className="flex items-center h-full pl-36 text-xs text-gray-500 italic ">
          System disconnected. Live threat monitoring is offline.
        </div>
      ) : (
        <motion.div
          className="flex items-center h-full gap-16 pl-32 w-max"
          animate={controls}
        >
          {duplicated.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={`${activity.id || activity.text}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap cursor-pointer hover:bg-[#1E293B]/50 px-3 py-1 rounded-full transition-colors group/item"
                whileHover={{ scale: 1.02 }}
                onClick={() => onEventClick && onEventClick(activity)}
              >
                <div className="relative">
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: activity.color }}
                  />
                  <div
                    className="absolute inset-0 blur-sm opacity-50"
                    style={{ backgroundColor: activity.color }}
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200">
                      {activity.text}
                    </span>
                    {activity.severity === "critical" && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  {activity.timestamp && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Gradient fade edges for smooth appearance */}
      <div className="absolute left-24 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0F172A] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F172A] to-transparent pointer-events-none z-10" />
    </div>
  );
}
