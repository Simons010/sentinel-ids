import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Threats from "./pages/Threats.jsx";
import Network from "./pages/Network.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Reports from "./pages/Reports.jsx";
import LogsUpload from "./pages/LogsUpload.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "threats", Component: Threats },
      { path: "network", Component: Network },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
      { path: "logsUpload", Component: LogsUpload },
      { path: "reports", Component: Reports },
    ],
  },
]);
