import { motion } from 'motion/react';
import { AlertTriangle, Shield, Eye, Lock, Wifi } from 'lucide-react';

const activities = [
  { icon: Shield, text: 'Blocked SQL injection attempt from 185.220.101.54', color: '#10B981' },
  { icon: AlertTriangle, text: 'DDoS attack detected targeting web-server-03', color: '#EF4444' },
  { icon: Eye, text: 'Suspicious login pattern detected from 198.50.133.21', color: '#F59E0B' },
  { icon: Lock, text: 'Brute force attempt blocked on SSH port 22', color: '#10B981' },
  { icon: Wifi, text: 'Anomalous network traffic detected on VLAN 100', color: '#F59E0B' },
  { icon: Shield, text: 'XSS payload neutralized in web request', color: '#10B981' },
  { icon: AlertTriangle, text: 'Critical: Zero-day exploit attempt detected', color: '#EF4444' },
  { icon: Eye, text: 'Port scanning activity from 91.215.85.13', color: '#F59E0B' },
];

export function LiveActivityTicker() {
  // Duplicate activities for seamless loop
  const duplicatedActivities = [...activities, ...activities];

  return (
    <div className="h-10 bg-[#1E293B] border-t border-[#334155] overflow-hidden">
      <motion.div
        className="flex items-center h-full gap-12"
        animate={{
          x: [0, -50 * activities.length + '%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-center gap-2 whitespace-nowrap">
              <Icon className="w-4 h-4" style={{ color: activity.color }} />
              <span className="text-sm text-gray-300">{activity.text}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
