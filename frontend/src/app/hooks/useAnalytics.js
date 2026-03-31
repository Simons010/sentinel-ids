import { useState, useEffect } from "react";
import { getAnalytics } from "../../api/analytics";

export function useAnalytics(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res))
      .catch((e) => setError(e.friendlyMessage || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
