import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Shield, Eye, EyeOff, Home } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(err.friendlyMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sentinel-IDS</h1>
            <p className="text-xs text-gray-400">Intrusion Detection System</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-10">
          <h2 className="text-xl text-center font-semibold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-center text-sm text-gray-400 mb-6">
            Sign in to your account to continue
          </p>
          <p className="text-end text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#22D3EE] hover:underline font-medium"
            >
              Create
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter your username"
                required
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="flex justify-between mt-6">
            <p>
              <Link
                to="/home"
                className="text-[#22D3EE] hover:underline font-medium flex items-center gap-1"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
            </p>
            <p className="text-end text-sm text-gray-400 ">
              Forgot your password?{" "}
              <Link
                to="/resetPassword"
                className="text-[#22D3EE] hover:underline font-medium "
              >
                Reset it
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
