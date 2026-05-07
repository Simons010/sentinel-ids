import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const LiveFeedContext = createContext();

export function LiveFeedProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const heartbeatInterval = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 15; // Increased even more

  const connect = useCallback(() => {
    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

      // Rotate through possible hostnames to find one that works
      const hosts = [window.location.hostname, "127.0.0.1", "localhost"];
      const host = hosts[reconnectAttempts.current % hosts.length];

      let wsUrl = import.meta.env.VITE_WS_URL;

      // Robust URL adaptation
      if (
        wsUrl &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        if (wsUrl.includes("localhost")) {
          wsUrl = wsUrl.replace("localhost", window.location.hostname);
        } else if (wsUrl.includes("127.0.0.1")) {
          wsUrl = wsUrl.replace("127.0.0.1", window.location.hostname);
        }
      }

      if (!wsUrl) {
        const port =
          window.location.port === "5173" ? "8000" : window.location.port;
        const portSuffix = port ? `:${port}` : "";
        wsUrl = `${protocol}//${host}${portSuffix}/ws/live-feed/`;
      }

      console.log(
        `[WS] Connecting to: ${wsUrl} (Attempt ${reconnectAttempts.current + 1})`,
      );
      ws.current = new WebSocket(wsUrl);

      let pendingEvents = [];
      let updateTimer = null;

      // Connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
          console.warn("[WS] Connection timeout, closing...");
          ws.current.close();
        }
      }, 5000);

      ws.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("[WS] Connected successfully to " + wsUrl);
        setConnected(true);
        reconnectAttempts.current = 0;

        // Start heartbeat
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data.type === "pong") return;
          if (data.type === "connection_established") return;

          let newEvents = [];
          if (data.type === "live-event-batch" && Array.isArray(data.events)) {
            newEvents = data.events;
          } else if (data.type === "live-event" && data.event) {
            newEvents = [data.event];
          }

          if (newEvents.length > 0) {
            pendingEvents.push(...newEvents);

            if (!updateTimer) {
              updateTimer = setTimeout(() => {
                setEvents((prev) => {
                  const combined = [...prev, ...pendingEvents];
                  pendingEvents = [];
                  // Limit to last 100 items for performance
                  return combined
                    .sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
                    )
                    .slice(-100);
                });
                updateTimer = null;
              }, 1000); // Throttled update to 1s
            }
          }
        } catch (error) {
          console.error("[WS] Message parsing error:", error);
        }
      };

      ws.current.onclose = (e) => {
        clearTimeout(connectionTimeout);
        if (updateTimer) clearTimeout(updateTimer);
        if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);

        console.log(
          `[WS] Closed: ${e.code} ${e.reason} (Clean: ${e.wasClean})`,
        );
        setConnected(false);
        ws.current = null;

        const delay = Math.min(
          1000 * Math.pow(1.5, reconnectAttempts.current),
          10000,
        );

        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`[WS] Reconnecting in ${Math.round(delay)}ms...`);
          reconnectTimeout.current = setTimeout(connect, delay);
        } else {
          console.log(
            "[WS] Max retries reached, waiting 30s before resetting...",
          );
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current = 0;
            connect();
          }, 30000);
        }
      };

      ws.current.onerror = (e) => {
        console.error("[WS] Error occurred");
      };
    } catch (error) {
      console.error("[WS] Setup error:", error);
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  const value = React.useMemo(
    () => ({
      events,
      connected,
      reconnect: connect,
    }),
    [events, connected, connect],
  );

  return (
    <LiveFeedContext.Provider value={value}>
      {children}
    </LiveFeedContext.Provider>
  );
}

export const useLiveFeedContext = () => {
  const context = useContext(LiveFeedContext);
  if (!context) {
    throw new Error(
      "useLiveFeedContext must be used within a LiveFeedProvider",
    );
  }
  return context;
};
