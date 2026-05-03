import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../../api/auth";
import { Shield, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "viewer",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.friendlyMessage || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#10B981]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Account Created
          </h2>
          <p className="text-gray-400 mb-6">
            Your account is pending admin approval. You'll be able to sign in
            once an administrator activates your account.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-2.5 px-6 rounded-lg hover:shadow-lg transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sentinel-IDS</h1>
            <p className="text-xs text-gray-400">Intrusion Detection System</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-2">
            Create account
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Register for access — an admin will approve your account
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  placeholder="John"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  placeholder="Doe"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>
            </div>

            {[
              {
                key: "username",
                label: "Username",
                type: "text",
                placeholder: "johndoe",
              },
              {
                key: "email",
                label: "Email",
                type: "email",
                placeholder: "john@company.com",
              },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Requested Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors appearance-none cursor-pointer"
              >
                <option value="viewer">Viewer (Read-only access)</option>
                <option value="analyst">
                  Analyst (Monitor & analyze threats)
                </option>
                <option value="admin">Admin (Full system control)</option>
              </select>
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
                  placeholder="Min. 8 characters"
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Repeat password"
                required
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#22D3EE] hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
