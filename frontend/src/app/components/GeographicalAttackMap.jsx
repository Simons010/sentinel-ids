import { Globe, MapPin } from "lucide-react";
import { motion } from "motion/react";

const getSeverityColor = (risk) => {
  if (risk >= 4) return "#EF4444";
  if (risk >= 3) return "#F97316";
  if (risk >= 2) return "#F59E0B";
  return "#10B981";
};

const getSeverityLabel = (risk) => {
  if (risk >= 4) return "critical";
  if (risk >= 3) return "high";
  if (risk >= 2) return "medium";
  return "low";
};

const getSeveritySize = (risk) => {
  if (risk >= 4) return 24;
  if (risk >= 3) return 20;
  if (risk >= 2) return 16;
  return 12;
};

// Rough IP-to-coordinate mapping for known threat ranges (i will replace with a GeoIP library like geoip2-lite in the future)
const IP_COORDS = {
  185: { lat: 55, lng: 37 }, // Russia
  "198.": { lat: 35, lng: 105 }, // China
  "45.": { lat: 40, lng: 127 }, // South Korea
  "91.": { lat: 32, lng: 53 }, // Iran
  "103.": { lat: 16, lng: 107 }, // Vietnam
  "172.": { lat: -14, lng: -51 }, // Brazil
  "5.": { lat: 48, lng: 31 }, // Ukraine
  "10.": { lat: 48, lng: 31 }, // Private IPs
  "192.": { lat: 20, lng: 77 }, // India
};

function getCoords(ip) {
  if (!ip) return { lat: 0, lng: 0 };
  const prefix = ip.split(".").slice(0, 1)[0] + ".";
  return (
    IP_COORDS[prefix] || {
      lat: Math.random() - 0.5 * 140, // Random global distribution for unknown IPs
      lng: Math.random() - 0.5 * 340,
    }
  );
}

export function GeographicalAttackMap({ geoSources = [], geoSummary = {} }) {
  const points = geoSources.map((s) => ({
    ip: s.log__src_ip,
    attacks: s.count,
    risk: s.risk ?? 1,
    ...getCoords(s.log__src_ip),
  }));

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22D3EE]/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#22D3EE]" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Geographical Attack Distribution
          </h3>
        </div>
        <div className="text-sm text-gray-400">Real-time</div>
      </div>

      {/* World Map Visualization */}
      <div className="relative bg-[#0F172A] rounded-lg p-8 mb-6 min-h-[400px] border border-[#334155] overflow-hidden">
        {/* Map Background */}
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
            <circle
              cx="200"
              cy="200"
              r="40"
              stroke="#22D3EE"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="700"
              cy="180"
              r="50"
              stroke="#22D3EE"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="450"
              cy="250"
              r="35"
              stroke="#22D3EE"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Attack Points */}
        {points.map((location, index) => {
          const x = ((location.lng + 180) / 360) * 100;
          const y = ((90 - location.lat) / 180) * 100;
          const color = getSeverityColor(loc.risk);
          const size = getSeveritySize(loc.risk);

          return (
            <motion.div
              key={index}
              className="absolute group cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
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
                  ease: "easeInOut",
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
                  <div className="font-semibold text-[#22D3EE] mb-1">
                    {loc.ip}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Attacks:</span>
                    <span className="font-bold" style={{ color }}>
                      {loc.attacks}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Severity:</span>
                    <span className="font-bold uppercase" style={{ color }}>
                      {getSeverityLabel(loc.risk)}
                    </span>
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
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: MapPin,
            color: "#EF4444",
            label: "Critical Zones",
            value: geoSummary.critical_zones ?? 0,
          },
          {
            icon: MapPin,
            color: "#F97316",
            label: "High Risk Zones",
            value: geoSummary.high_risk_zones ?? 0,
          },
          {
            icon: Globe,
            color: "#22D3EE",
            label: "Total Countries",
            value: geoSummary.total_countries ?? 0,
          },
          {
            icon: MapPin,
            color: "#10B981",
            label: "Blocked IPs",
            value: geoSummary.blocked_ips?.toLocaleString() ?? 0,
          },
        ].map(({ icon: Icon, color, label, value }) => (
          <div className="bg-[#0F172A] rounded-lg p-4 border border-[#334155]">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
