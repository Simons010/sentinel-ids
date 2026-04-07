const SEVERITY_MAP = {
  "Brute Force Attack": "Critical",
  "SQL Injection": "Critical",
  "DDoS Attack": "High",
  "Port Scan": "Low",
  "XSS Attempt": "Medium",
  "Privilege Escalation": "High",
};

export default function TopThreatVectors({ data }) {
  const threats = data?.length
    ? data.map((t) => ({
        name: t.attack_type,
        count: t.count,
        severity: SEVERITY_MAP[t.attack_type] ?? "Medium",
      }))
    : [];

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Threat Vectors
      </h3>
      <div className="space-y-3">
        {threats.length === 0 ? (
          <p className="text-gray-400 text-sm">No threat data available</p>
        ) : (
          threats.map((threat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg"
            >
              <div>
                <p className="text-white font-medium">{threat.name}</p>
                <p className="text-xs text-gray-400">{threat.count} attempts</p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  threat.severity === "Critical"
                    ? "bg-[#EF4444]/20 text-[#EF4444]"
                    : threat.severity === "High"
                      ? "bg-[#F97316]/20 text-[#F97316]"
                      : threat.severity === "Medium"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                        : "bg-[#10B981]/20 text-[#10B981]"
                }`}
              >
                {threat.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
