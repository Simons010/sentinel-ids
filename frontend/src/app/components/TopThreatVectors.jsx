export default function TopThreatVectors() {
    return (
        <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Threat Vectors</h3>
          <div className="space-y-3">
            {[
              { name: 'SQL Injection', count: 342, severity: 'Critical' },
              { name: 'DDoS Attempts', count: 289, severity: 'High' },
              { name: 'Brute Force', count: 167, severity: 'Medium' },
              { name: 'XSS Attacks', count: 124, severity: 'Medium' },
              { name: 'Port Scanning', count: 98, severity: 'Low' }
            ].map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                <div>
                  <p className="text-white font-medium">{threat.name}</p>
                  <p className="text-xs text-gray-400">{threat.count} attempts</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  threat.severity === 'Critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                  threat.severity === 'High' ? 'bg-[#F97316]/20 text-[#F97316]' :
                  threat.severity === 'Medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                  'bg-[#10B981]/20 text-[#10B981]'
                }`}>
                  {threat.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
    )
}