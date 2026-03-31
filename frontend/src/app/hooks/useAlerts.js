import { useState, useEffect, use } from "react";
import { getAlerts } from "../../api/alerts";

export function useAlerts(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    try {
      const res = await getAlerts(params);
      setData(res);
      setError(null);
    } catch (e) {
      setError(e.friendlyMessage || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [JSON.stringify(params)]); // refetch when params change

  return { data, loading, error, refetch: fetch };
}
