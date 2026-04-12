import { motion } from "motion/react";
import { AlertTriangle, Shield, Eye, Lock, Wifi } from "lucide-react";

const SEVERITY_ICON = {
  critical: { icon: AlertTriangle, color: "#EF4444" },
  high: { icon: AlertTriangle, color: "#F97316" },
  medium: { icon: Eye, color: "#F59E0B" },
  low: { icon: Shield, color: "#10B981" },
};

const STATIC_ACTIVITIES = [
  {
    icon: Shield,
    text: "Blocked SQL injection attempt from 185.220.101.54",
    color: "#10B981",
  },
  {
    icon: AlertTriangle,
    text: "DDoS attack detected targeting web-server-03",
    color: "#EF4444",
  },
  {
    icon: Eye,
    text: "Suspicious login pattern detected from 198.50.133.21",
    color: "#F59E0B",
  },
  {
    icon: Lock,
    text: "Brute force attempt blocked on SSH port 22",
    color: "#10B981",
  },
  {
    icon: Wifi,
    text: "Anomalous network traffic detected on VLAN 100",
    color: "#F59E0B",
  },
];

export function LiveActivityTicker({ events = [] }) {
  const activities =
    events.length > 0
      ? events.map((e) => {
          const { icon, color } =
            SEVERITY_ICON[e.severity] || SEVERITY_ICON.low;
          return { icon, text: e.text, color };
        })
      : STATIC_ACTIVITIES;

  // Duplicate activities for seamless loop
  const duplicated = [...activities, ...activities];

  return (
    <div className="h-10 bg-[#1E293B] border-t border-[#334155] overflow-hidden">
      <motion.div
        className="flex items-center h-full gap-12"
        animate={{
          x: [0, -`${50 * activities.length}%`],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicated.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" style={{ color: activity.color }} />
              <span className="text-sm text-gray-300">{activity.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
