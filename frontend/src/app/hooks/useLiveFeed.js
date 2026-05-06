import { useEffect, useRef, useState, useCallback } from "react";

export function useLiveFeed() {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/live-feed/";
      ws.current = new WebSocket(wsUrl);
      let pendingEvents = [];
      let updateTimer = null;

      ws.current.onopen = () => {
        setConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data.type === "live-event" && data.event) {
            pendingEvents.push(data.event);

            // Throttle updates to max once every 500ms for smoother UI
            if (!updateTimer) {
              updateTimer = setTimeout(() => {
                setEvents((prev) => {
                  const newEvents = [...prev, ...pendingEvents];
                  pendingEvents = [];
                  return newEvents.slice(-50); // Keep the 50 most recent events
                });
                updateTimer = null;
              }, 500);
            }
          } else if (data.type === "connection_established") {
            // Connection established successfully
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = () => {
        setConnected(false);

        // Attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            10000,
          ); // Exponential backoff

          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.current.onerror = (e) => {
        console.error("WebSocket error:", e);
        setConnected(false);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return { events, connected };
}
