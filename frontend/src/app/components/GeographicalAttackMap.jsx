import { Globe, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const attackLocations = [
  { country: 'Russia', lat: 55, lng: 37, attacks: 847, severity: 'critical' },
  { country: 'China', lat: 35, lng: 105, attacks: 732, severity: 'critical' },
  { country: 'North Korea', lat: 40, lng: 127, attacks: 621, severity: 'high' },
  { country: 'Iran', lat: 32, lng: 53, attacks: 489, severity: 'high' },
  { country: 'Vietnam', lat: 16, lng: 107, attacks: 356, severity: 'medium' },
  { country: 'Brazil', lat: -14, lng: -51, attacks: 234, severity: 'medium' },
  { country: 'Ukraine', lat: 48, lng: 31, attacks: 189, severity: 'low' },
  { country: 'India', lat: 20, lng: 77, attacks: 145, severity: 'low' },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return '#EF4444';
    case 'high': return '#F97316';
    case 'medium': return '#F59E0B';
    case 'low': return '#10B981';
    default: return '#22D3EE';
  }
};

const getSeveritySize = (severity) => {
  switch (severity) {
    case 'critical': return 24;
    case 'high': return 20;
    case 'medium': return 16;
    case 'low': return 12;
    default: return 12;
  }
};

export function GeographicalAttackMap() {
  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <h3 className="text-lg font-semibold text-white">Geographical Attack Distribution</h3>
        </div>
        <div className="text-sm text-gray-400">Real-time</div>
      </div>

      {/* World Map Visualization */}
      <div className="relative bg-[#0F172A] rounded-lg p-8 mb-6 min-h-[400px] border border-[#334155] overflow-hidden">
        {/* Simplified World Map Background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <path
              d="M150,100 L200,80 L250,90 L280,70 L320,85 L350,75 L380,90 L420,100 L450,85 L500,95 L550,80 L600,90 L650,85 L700,95 L750,88 L800,100"
              stroke="#22D3EE"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M120,150 Q200,140 280,155 T450,145 T650,160 T850,150"
              stroke="#22D3EE"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="200" cy="200" r="40" stroke="#22D3EE" strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="700" cy="180" r="50" stroke="#22D3EE" strokeWidth="1" fill="none" opacity="0.3" />
            <circle cx="450" cy="250" r="35" stroke="#22D3EE" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Attack Points */}
        {attackLocations.map((location, index) => {
          const x = ((location.lng + 180) / 360) * 100;
          const y = ((90 - location.lat) / 180) * 100;
          const color = getSeverityColor(location.severity);
          const size = getSeveritySize(location.severity);

          return (
            <motion.div
              key={index}
              className="absolute group cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: size * 2,
                  height: size * 2,
                  backgroundColor: color,
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Main Point */}
              <div
                className="rounded-full relative z-10"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: `0 0 ${size}px ${color}`,
                }}
              />

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-xs text-white whitespace-nowrap shadow-xl">
                  <div className="font-semibold text-[#22D3EE] mb-1">{location.country}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Attacks:</span>
                    <span className="font-bold" style={{ color }}>{location.attacks}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Severity:</span>
                    <span className="font-bold uppercase" style={{ color }}>{location.severity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" style={{ opacity: 0.05 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22D3EE" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs text-gray-400">Critical Zones</span>
          </div>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-[#F97316]" />
            <span className="text-xs text-gray-400">High Risk Zones</span>
          </div>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-xs text-gray-400">Total Countries</span>
          </div>
          <p className="text-2xl font-bold text-white">8</p>
        </div>
        <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-xs text-gray-400">Blocked IPs</span>
          </div>
          <p className="text-2xl font-bold text-white">1,523</p>
        </div>
      </div>
    </div>
  );
}
