import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export function ThreatLevelIndicator({ threatScore, level, lastUpdated }) {
  const getLevelColor = () => {
    switch (level) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#F97316';
      case 'Critical': return '#EF4444';
      default: return '#22D3EE';
    }
  };

  const color = getLevelColor();
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (threatScore / 100) * circumference;

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Threat Level</h3>
        {level === 'Critical' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mb-4">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="#334155"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="70"
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                filter: level === 'Critical' ? `drop-shadow(0 0 8px ${color})` : 'none'
              }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-white mb-1">{threatScore}</p>
            <p className="text-sm text-gray-400">/ 100</p>
          </div>
        </div>

        {/* Level Badge */}
        <div 
          className="px-6 py-2 rounded-full font-bold text-white mb-2"
          style={{ backgroundColor: color }}
        >
          {level} Threat
        </div>

        {/* Last Updated */}
        <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
}
