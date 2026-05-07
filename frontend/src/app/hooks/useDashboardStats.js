import { useState, useEffect, useRef } from "react";
import { getDashboardStats } from "../../api/dashboard";
import { toast } from "sonner";

export function useDashboardStats(enableToasts = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousRef = useRef(null);

  const fetch = async () => {
    try {
      const res = await getDashboardStats();
      if (enableToasts && previousRef.current) {
        const previous = previousRef.current;
        if ((res.critical_threats ?? 0) > (previous.critical_threats ?? 0)) {
          toast.error("Critical Threat Detected", {
            description: `Alert level escalated. ${res.critical_threats} critical issues now active.`,
            duration: 8000,
            className:
              "bg-red-500 border-red-500/50 text-white border-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
          });
        } else if ((res.active_alerts ?? 0) > (previous.active_alerts ?? 0)) {
          toast.warning("Security Alert", {
            description: `New network activity flagged for review. ${res.active_alerts} total alerts active.`,
            duration: 5000,
            className:
              "bg-orange-500 border-orange-500/50 text-white border-2 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
          });
        }
      }
      previousRef.current = res;
      setData(res);
      setError(null);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetch };
}
