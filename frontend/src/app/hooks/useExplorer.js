import { useState, useEffect } from "react";
import { getLogs, getAlerts } from "../../api/explorer";

export function useExplorer() {
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [logPage, setLogPage] = useState(1);
  const [logSearch, setLogSearch] = useState("");

  const [alertPage, setAlertPage] = useState(1);
  const [alertSearch, setAlertSearch] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getLogs({ page: logPage, search: logSearch });
      setLogs(res.results ?? res);
      setTotalLogs(res.count ?? res.length);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await getAlerts({ page: alertPage, search: alertSearch });
      setAlerts(res.results ?? res);
      setTotalAlerts(res.count ?? res.length);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [logPage, logSearch]);

  useEffect(() => {
    fetchAlerts();
  }, [alertPage, alertSearch]);

  return {
    logs,
    totalLogs,
    logPage,
    setLogPage,
    logSearch,
    setLogSearch,
    alerts,
    totalAlerts,
    alertPage,
    setAlertPage,
    alertSearch,
    setAlertSearch,
    loading,
    error,
    refetchLogs: fetchLogs,
    refetchAlerts: fetchAlerts,
  };
}
