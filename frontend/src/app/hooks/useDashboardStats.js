import { useState, useEffect } from "react";
import { getDashboardStats } from "../../api/dashboard";

export function useDashboardStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      const res = await getDashboardStats();
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
