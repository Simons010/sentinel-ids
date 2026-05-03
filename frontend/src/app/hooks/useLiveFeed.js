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
      ws.current = new WebSocket("ws://localhost:8000/ws/live-feed/");

      ws.current.onopen = () => {
        setConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data.type === "live-event" && data.event) {
            setEvents((prev) => {
              const newEvents = [data.event, ...prev];
              return newEvents.slice(0, 50); // Keep only the latest 50 events
            });
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
