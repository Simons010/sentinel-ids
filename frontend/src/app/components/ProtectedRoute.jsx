import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F172A]">
        <div className="w-8 h-8 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
