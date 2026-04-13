/** Loading placeholders shaped like each page’s real layout (cards, grids, tables). */

const panel =
  "bg-[#0F172A] border border-[#334155] rounded-xl animate-pulse";
const panelLg =
  "bg-[#0F172A] border border-[#334155] rounded-lg animate-pulse";

function StatCardSkeleton() {
  return (
    <div
      className={`${panelLg} h-32 p-4 flex flex-col justify-between`}
      aria-hidden
    >
      <div className="h-3 w-24 bg-[#334155]/70 rounded" />
      <div className="h-8 w-20 bg-[#334155]/70 rounded" />
      <div className="h-6 w-full bg-[#334155]/40 rounded" />
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="mt-8 pt-6 border-t border-[#334155]">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="h-4 w-48 bg-[#334155]/50 rounded animate-pulse" />
        <div className="flex gap-6">
          <div className="h-4 w-40 bg-[#334155]/50 rounded animate-pulse" />
          <div className="h-4 w-36 bg-[#334155]/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Dashboard"
        subtitle="Real-time threat monitoring and AI-powered analysis"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#334155] animate-pulse" />
        <div className="h-4 w-40 bg-[#334155]/50 rounded animate-pulse" />
      </div>
      <div className={`${panelLg} h-10 w-full rounded-none border-x-0`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-28 bg-[#334155]/70 rounded mb-6" />
          <div className="mx-auto w-48 h-48 rounded-full bg-[#334155]/40" />
        </div>
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-36 bg-[#334155]/70 rounded mb-4" />
          <div className="h-56 w-full bg-[#334155]/30 rounded-lg" />
        </div>
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-40 bg-[#334155]/70 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-10 bg-[#334155]/30 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className={`${panel} p-6`}>
        <div className="flex justify-between mb-4">
          <div className="h-5 w-52 bg-[#334155]/70 rounded" />
          <div className="h-4 w-28 bg-[#334155]/50 rounded" />
        </div>
        <div className="h-80 min-h-[320px] bg-[#334155]/25 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${panel} p-6 min-h-[300px]`}>
          <div className="h-5 w-44 bg-[#334155]/70 rounded mb-4" />
          <div className="h-64 bg-[#334155]/25 rounded-lg" />
        </div>
        <div className={`${panel} p-6 min-h-[300px]`}>
          <div className="h-5 w-40 bg-[#334155]/70 rounded mb-4" />
          <div className="h-24 bg-[#334155]/30 rounded-lg mb-3" />
          <div className="h-32 bg-[#334155]/25 rounded-lg" />
        </div>
      </div>
      <FooterSkeleton />
    </div>
  );
}

export function ThreatsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Threat Intelligence"
        subtitle="Comprehensive threat analysis and alert management"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-28 bg-[#334155]/70 rounded mb-6" />
          <div className="mx-auto w-48 h-48 rounded-full bg-[#334155]/40" />
        </div>
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-32 bg-[#334155]/70 rounded mb-4" />
          <div className="h-56 w-full bg-[#334155]/30 rounded-lg" />
        </div>
        <div className={`${panel} min-h-[380px] p-6`}>
          <div className="h-5 w-36 bg-[#334155]/70 rounded mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-12 bg-[#334155]/30 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
      <div className={`${panel} p-6 min-h-[200px]`}>
        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-[#334155]/40 rounded-lg" />
          <div className="h-5 w-44 bg-[#334155]/70 rounded mt-2" />
        </div>
        <div className="h-20 bg-[#334155]/25 rounded-lg" />
      </div>
      <div className={`${panel} p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="h-5 w-36 bg-[#334155]/70 rounded" />
          <div className="h-9 w-full sm:w-72 bg-[#334155]/40 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                {[
                  "Alert ID",
                  "Timestamp",
                  "Source IP",
                  "Destination",
                  "Threat",
                  "Severity",
                  "Conf.",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/60">
              {Array.from({ length: 6 }, (_, i) => (
                <tr key={i}>
                  <td className="py-3 px-2">
                    <div className="h-3 w-14 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-3 w-28 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-3 w-24 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-3 w-28 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-3 w-20 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-6 w-16 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-3 w-8 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-6 w-14 bg-[#334155]/50 rounded animate-pulse" />
                  </td>
                  <td className="py-3 px-2">
                    <div className="h-8 w-8 bg-[#334155]/50 rounded animate-pulse ml-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FooterSkeleton />
    </div>
  );
}

export function NetworkLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Monitor"
        subtitle="Global threat visualization and network activity tracking"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#334155] animate-pulse" />
        <div className="h-4 w-40 bg-[#334155]/50 rounded animate-pulse" />
      </div>
      <div className={`${panelLg} h-10 w-full rounded-none border-x-0`} />
      <div className={`${panel} p-6`}>
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          <div className="h-5 w-48 bg-[#334155]/70 rounded" />
          <div className="h-4 w-32 bg-[#334155]/50 rounded" />
        </div>
        <div className="min-h-[400px] bg-[#334155]/20 rounded-lg border border-[#334155]/50" />
      </div>
      <div className={`${panel} p-6`}>
        <div className="flex justify-between mb-4">
          <div className="h-5 w-56 bg-[#334155]/70 rounded" />
          <div className="h-4 w-24 bg-[#334155]/50 rounded" />
        </div>
        <div className="h-48 bg-[#334155]/25 rounded-lg mb-4" />
        <div className="h-8 w-full bg-[#334155]/20 rounded" />
      </div>
      <div className={`${panel} p-6 min-h-[320px]`}>
        <div className="h-5 w-40 bg-[#334155]/70 rounded mb-4" />
        <div className="h-64 bg-[#334155]/25 rounded-lg" />
      </div>
      <FooterSkeleton />
    </div>
  );
}

export function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Machine learning insights and detection statistics"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className={`${panel} p-6`}>
        <div className="flex justify-between mb-4">
          <div className="h-5 w-52 bg-[#334155]/70 rounded" />
          <div className="h-4 w-28 bg-[#334155]/50 rounded" />
        </div>
        <div className="h-80 min-h-[320px] bg-[#334155]/25 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${panel} p-6 min-h-[280px]`}>
          <div className="h-5 w-40 bg-[#334155]/70 rounded mb-4" />
          <div className="grid grid-cols-2 gap-4 h-52">
            <div className="bg-[#334155]/25 rounded-lg" />
            <div className="bg-[#334155]/25 rounded-lg" />
          </div>
        </div>
        <div className={`${panel} p-6 min-h-[280px]`}>
          <div className="h-5 w-44 bg-[#334155]/70 rounded mb-4" />
          <div className="h-52 bg-[#334155]/25 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${panel} p-6 min-h-[260px]`}>
          <div className="h-5 w-48 bg-[#334155]/70 rounded mb-4" />
          <div className="h-48 bg-[#334155]/25 rounded-lg" />
        </div>
        <div className={`${panel} p-6 min-h-[260px]`}>
          <div className="h-5 w-36 bg-[#334155]/70 rounded mb-4" />
          <div className="h-48 bg-[#334155]/25 rounded-lg" />
        </div>
      </div>
      <div className={`${panel} p-6`}>
        <div className="flex gap-3 mb-6">
          <div className="w-12 h-12 bg-[#334155]/40 rounded-lg" />
          <div className="h-5 w-32 bg-[#334155]/70 rounded mt-3" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-14 bg-[#334155]/25 rounded-lg" />
          ))}
        </div>
      </div>
      <FooterSkeleton />
    </div>
  );
}

export function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your security preferences and system settings"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`${panel} p-6 min-h-[260px]`}>
            <div className="h-5 w-40 bg-[#334155]/70 rounded mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, j) => (
                <div key={j}>
                  <div className="h-3 w-24 bg-[#334155]/50 rounded mb-2" />
                  <div className="h-10 w-full bg-[#334155]/30 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`${panel} p-6 min-h-[200px]`}>
        <div className="h-5 w-36 bg-[#334155]/70 rounded mb-6" />
        <div className="space-y-4 max-w-xl">
          <div className="h-10 w-full bg-[#334155]/30 rounded-lg" />
          <div className="h-10 w-full bg-[#334155]/30 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-full max-w-md bg-[#334155]/30 rounded-lg animate-pulse border border-[#334155]" />
      </div>
      <div className={`${panel} p-6 min-h-[180px]`}>
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-5 w-28 bg-[#334155]/70 rounded mb-2" />
            <div className="h-3 w-48 bg-[#334155]/40 rounded" />
          </div>
          <div className="h-9 w-32 bg-[#334155]/40 rounded-lg" />
        </div>
        <div className="h-12 bg-[#334155]/25 rounded-lg" />
      </div>
      <div className={`${panel} p-6 min-h-[180px]`}>
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-5 w-32 bg-[#334155]/70 rounded mb-2" />
            <div className="h-3 w-52 bg-[#334155]/40 rounded" />
          </div>
          <div className="h-9 w-28 bg-[#334155]/40 rounded-lg" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-14 bg-[#334155]/25 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Shown on Reports while history is loading (generator panel stays interactive). */
export function ReportsHistorySectionSkeleton() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="mb-6">
        <div className="h-5 w-56 bg-[#334155]/70 rounded animate-pulse mb-2" />
        <div className="h-3 w-72 bg-[#334155]/40 rounded animate-pulse" />
      </div>
      <div className="mb-6">
        <div className="h-10 w-full bg-[#0F172A] border border-[#334155] rounded-lg animate-pulse" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              {[
                "Report Name",
                "Report Type",
                "Date Generated",
                "Generated By",
                "Format",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/60">
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i}>
                <td className="py-4 px-4">
                  <div className="h-4 w-40 bg-[#334155]/50 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-[#334155]/40 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-28 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-36 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-20 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-7 w-14 bg-[#334155]/50 rounded-full animate-pulse" />
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="h-9 w-28 bg-[#334155]/50 rounded-lg animate-pulse ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Logs upload page: drop zone + history table layout while history loads. */
export function LogsUploadHistorySectionSkeleton() {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-6">
      <div className="mb-4">
        <div className="h-5 w-40 bg-[#334155]/70 rounded animate-pulse mb-2" />
        <div className="h-3 w-64 bg-[#334155]/40 rounded animate-pulse" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#334155]">
              {[
                "File Name",
                "Upload Date",
                "Total Logs",
                "Status",
                "Analysis Result",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]/60">
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i}>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#334155]/50 rounded animate-pulse" />
                    <div className="h-4 w-36 bg-[#334155]/50 rounded animate-pulse" />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-32 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-12 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-7 w-20 bg-[#334155]/50 rounded-full animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-44 bg-[#334155]/50 rounded animate-pulse" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <div className="w-9 h-9 bg-[#334155]/50 rounded animate-pulse" />
                    <div className="w-9 h-9 bg-[#334155]/50 rounded animate-pulse" />
                    <div className="w-9 h-9 bg-[#334155]/50 rounded animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
