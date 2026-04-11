import { useState, useEffect } from "react";
import { getThreatsStats, getAlerts } from "../../api/threats";

export function useThreats() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchStats = async () => {
    try {
      const res = await getThreatsStats();
      setStats(res);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load threat stats");
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts({ page, search });
      //DRF PageNumberPagination returns { count, results}
      setAlerts(res.results ?? res);
      setTotalAlerts(res.count ?? res.length);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // const interval = setInterval(fetchStats, 10000); //refresh every 10 seconds
    fetchStats();
    // return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // const interval = setInterval(fetch, 10000); // refresh every 10 seconds
    fetchAlerts();
    // return () => clearInterval(interval);
  }, [page, search]);

  return {
    stats,
    alerts,
    totalAlerts,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    refetch: fetchAlerts,
  };
}
