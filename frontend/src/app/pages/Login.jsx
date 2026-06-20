import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Shield, Eye, EyeOff, ArrowLeft, XCircle } from "lucide-react";

const InputField = ({
  label,
  name,
  type,
  placeholder,
  required = false,
  form,
  validation,
  showPassword,
  setShowPassword,
  handleInputChange,
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      {!validation[name]?.valid && (
        <span className="text-[10px] text-red-400 font-medium flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {validation[name].message}
        </span>
      )}
    </div>
    <div className="relative">
      <input
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        value={form[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-[#0F172A] border ${!validation[name]?.valid ? "border-red-500/50" : "border-[#334155]"} rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#22D3EE] transition-colors`}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE] rounded"
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Real-time validation state
  const [validation, setValidation] = useState({
    username: { valid: true, message: "" },
    password: { valid: true, message: "" },
  });

  const validateField = (name, value) => {
    let valid = true;
    let message = "";

    if (!value) {
      valid = false;
      message = "Required";
    } else {
      if (name === "username") {
        if (value.length < 6 || value.length > 30) {
          valid = false;
          message = "6-30 characters";
        } else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
          valid = false;
          message = "Alphanumeric only";
        }
      } else if (name === "password") {
        if (value.length < 8) {
          valid = false;
          message = "Min 8 characters";
        }
      }
    }

    setValidation((prev) => ({
      ...prev,
      [name]: { valid, message },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Final validation check
    const isInvalid = Object.keys(validation).some(
      (key) => !validation[key].valid,
    );
    if (isInvalid) {
      setError("Please fix validation errors before signing in");
      return;
    }

    if (!form.username || !form.password) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/dashboard");
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

          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444] flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="Enter your username"
              required
              form={form}
              validation={validation}
              handleInputChange={handleInputChange}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              form={form}
              validation={validation}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleInputChange={handleInputChange}
            />

            <button
              type="submit"
              disabled={
                loading ||
                Object.keys(validation).some((key) => !validation[key].valid)
              }
              className="w-full bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-end text-sm text-gray-400 flex items-center gap-1 justify-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#22D3EE] hover:underline font-medium"
            >
              Create
            </Link>
          </p>
          <div className="flex justify-between mt-6">
            <p>
              <Link
                to="/"
                className="text-[#22D3EE] text-sm hover:underline font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> back to home
              </Link>
            </p>
            <p className="text-end text-sm text-gray-400 flex items-center gap-1">
              <Link
                to="/resetPassword"
                className="text-[#22D3EE] hover:underline font-medium flex items-center gap-1"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
