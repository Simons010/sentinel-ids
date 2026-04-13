import { useState, useEffect, useRef } from "react";
import { getDashboardStats } from "../../api/dashboard";
import { toast } from "sonner";

export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousRef = useRef(null);

  const fetch = async () => {
    try {
      const res = await getDashboardStats();
      if (previousRef.current) {
        const previous = previousRef.current;
        if ((res.critical_threats ?? 0) > (previous.critical_threats ?? 0)) {
          toast.warning("New critical threat detected", {
            description: `Critical threats: ${res.critical_threats}`,
          });
        } else if ((res.active_alerts ?? 0) > (previous.active_alerts ?? 0)) {
          toast.info("New alert received", {
            description: `Active alerts: ${res.active_alerts}`,
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
