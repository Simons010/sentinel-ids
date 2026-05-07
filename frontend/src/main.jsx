import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./app/context/AuthContext.jsx";
import { LiveFeedProvider } from "./app/context/LiveFeedContext.jsx";
import { Toaster } from "sonner";
import { router } from "./app/routes.jsx";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LiveFeedProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </LiveFeedProvider>
    </AuthProvider>
  </StrictMode>,
);
