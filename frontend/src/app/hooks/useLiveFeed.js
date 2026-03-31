import { useEffect, useRef, useState } from "react";

export function useLiveFeed() {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws/live-feed/");

    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "live-event") {
        setEvents((prev) => [data.event, ...prev].slice(0, 50)); // Keep only the latest 50 events
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => ws.current?.close(), 3000);
    };

    ws.current.onerror = (e) => console.error("WebSocket error:", e);

    return () => ws.current?.close();
  }, []);

  return { events, connected };
}
