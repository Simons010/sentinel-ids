import { createBrowserRouter } from "react-router";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Threats from "./pages/Threats.jsx";
import Network from "./pages/Network.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import Reports from "./pages/Reports.jsx";
import LogsUpload from "./pages/LogsUpload.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  // Public routes
  { path: "/home", Component: Home },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },

  //Protected routes - all inside Layout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
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
