import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { register, checkAvailability } from "../../api/auth";
import {
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  XCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

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
      {validation[name]?.checking ? (
        <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Checking...
        </span>
      ) : (
        !validation[name]?.valid && (
          <span className="text-[10px] text-red-400 font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {validation[name].message}
          </span>
        )
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  </div>
);

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

  // Real-time validation state
  const [validation, setValidation] = useState({
    first_name: { valid: true, message: "" },
    last_name: { valid: true, message: "" },
    username: { valid: true, message: "", checking: false },
    email: { valid: true, message: "", checking: false },
    password: { valid: true, message: "" },
    confirmPassword: { valid: true, message: "" },
    pwned: { checked: false, compromised: false, loading: false },
  });

  // Debounced uniqueness checks
  useEffect(() => {
    if (!form.username || form.username.length < 6) return;

    const timeout = setTimeout(async () => {
      setValidation((prev) => ({
        ...prev,
        username: { ...prev.username, checking: true },
      }));
      try {
        const { available } = await checkAvailability({
          username: form.username,
        });
        setValidation((prev) => ({
          ...prev,
          username: {
            ...prev.username,
            valid: available,
            message: available ? "" : "Username taken",
            checking: false,
          },
        }));
      } catch (err) {
        setValidation((prev) => ({
          ...prev,
          username: { ...prev.username, checking: false },
        }));
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [form.username]);

  useEffect(() => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return;

    const timeout = setTimeout(async () => {
      setValidation((prev) => ({
        ...prev,
        email: { ...prev.email, checking: true },
      }));
      try {
        const { available } = await checkAvailability({ email: form.email });
        setValidation((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            valid: available,
            message: available ? "" : "Email registered",
            checking: false,
          },
        }));
      } catch (err) {
        setValidation((prev) => ({
          ...prev,
          email: { ...prev.email, checking: false },
        }));
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [form.email]);

  // Password complexity regex
  const hasUpper = /[A-Z]/;
  const hasLower = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

  // Debounced compromised check
  useEffect(() => {
    if (form.password.length < 8) return;

    const timeout = setTimeout(async () => {
      setValidation((prev) => ({
        ...prev,
        pwned: { ...prev.pwned, loading: true },
      }));
      try {
        // crypto.subtle is only available in secure contexts (HTTPS or localhost)
        if (!window.crypto || !window.crypto.subtle) {
          console.warn("Crypto Subtle API not available - skipping pwned check");
          setValidation((prev) => ({
            ...prev,
            pwned: { checked: true, compromised: false, loading: false },
          }));
          return;
        }

        const msgUint8 = new TextEncoder().encode(form.password);
        const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase();

        const prefix = hashHex.slice(0, 5);
        const suffix = hashHex.slice(5);

        const res = await fetch(
          `https://api.pwnedpasswords.com/range/${prefix}`,
        );
        const text = await res.text();
        const compromised = text
          .split("\n")
          .some((line) => line.split(":")[0] === suffix);

        setValidation((prev) => ({
          ...prev,
          pwned: { checked: true, compromised, loading: false },
        }));
      } catch (err) {
        console.error("Pwned check failed:", err);
        setValidation((prev) => ({
          ...prev,
          pwned: { ...prev.pwned, loading: false },
        }));
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [form.password]);

  const validateField = (name, value) => {
    let valid = true;
    let message = "";

    // Mandatory Field Check
    if (
      !value &&
      [
        "username",
        "email",
        "password",
        "confirmPassword",
        "first_name",
        "last_name",
      ].includes(name)
    ) {
      valid = false;
      message = "Required";
    } else {
      switch (name) {
        case "username":
          if (value.length < 6 || value.length > 30) {
            valid = false;
            message = "6-30 characters";
          } else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
            valid = false;
            message = "Alphanumeric only";
          }
          break;
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            valid = false;
            message = "Invalid format";
          }
          break;
        case "password":
          if (value.length < 8) {
            valid = false;
            message = "Min 8 characters";
          } else if (
            !hasUpper.test(value) ||
            !hasLower.test(value) ||
            !hasNumber.test(value) ||
            !hasSpecial.test(value)
          ) {
            valid = false;
            message = "Weak password";
          }
          break;
        case "confirmPassword":
          if (value !== form.password) {
            valid = false;
            message = "No match";
          }
          break;
        default:
          break;
      }
    }

    setValidation((prev) => ({
      ...prev,
      [name]: { ...prev[name], valid, message },
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

    // Final check before submission
    const isInvalid = Object.keys(validation).some((key) => {
      if (key === "pwned")
        return validation.pwned.compromised || validation.pwned.loading;
      return !validation[key].valid || validation[key].checking;
    });

    if (isInvalid) {
      setError("Please fix the validation errors before submitting");
      return;
    }

    // Check if mandatory fields are empty
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.first_name ||
      !form.last_name
    ) {
      setError("All fields are required");
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
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444] flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="First Name"
                name="first_name"
                type="text"
                placeholder="John"
                required
                form={form}
                validation={validation}
                handleInputChange={handleInputChange}
              />
              <InputField
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Doe"
                required
                form={form}
                validation={validation}
                handleInputChange={handleInputChange}
              />
            </div>

            <InputField
              label="Username"
              name="username"
              type="text"
              placeholder="johndoe"
              required
              form={form}
              validation={validation}
              handleInputChange={handleInputChange}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="john@company.com"
              required
              form={form}
              validation={validation}
              handleInputChange={handleInputChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Requested Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#22D3EE] transition-colors appearance-none cursor-pointer"
              >
                <option value="viewer">Viewer (Read-only access)</option>
                <option value="analyst">
                  Analyst (Monitor & analyze threats)
                </option>
                <option value="admin">Admin (Full system control)</option>
              </select>
            </div>

            <div className="space-y-2">
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Min. 8-12 characters"
                required
                form={form}
                validation={validation}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleInputChange={handleInputChange}
              />

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-2 px-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((step) => {
                      const strength = [
                        form.password.length >= 8,
                        hasUpper.test(form.password) &&
                          hasLower.test(form.password),
                        hasNumber.test(form.password),
                        hasSpecial.test(form.password),
                      ].filter(Boolean).length;

                      return (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-colors ${step <= strength ? (strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-500" : "bg-emerald-500") : "bg-gray-700"}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {[
                      { label: "8-12+ chars", met: form.password.length >= 8 },
                      {
                        label: "Upper/Lower",
                        met:
                          hasUpper.test(form.password) &&
                          hasLower.test(form.password),
                      },
                      { label: "Number", met: hasNumber.test(form.password) },
                      { label: "Special", met: hasSpecial.test(form.password) },
                    ].map((req) => (
                      <span
                        key={req.label}
                        className={`text-[10px] flex items-center gap-1 ${req.met ? "text-emerald-400" : "text-gray-500"}`}
                      >
                        {req.met ? (
                          <CheckCircle className="w-2.5 h-2.5" />
                        ) : (
                          <div className="w-1 h-1 bg-gray-500 rounded-full" />
                        )}
                        {req.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compromised Check Indicator */}
              {validation.pwned.loading ? (
                <div className="flex items-center gap-2 text-[10px] text-cyan-400 px-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking security database...
                </div>
              ) : validation.pwned.checked && validation.pwned.compromised ? (
                <div className="flex items-center gap-2 text-[10px] text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  This password was found in a public data breach. Please choose
                  a different one.
                </div>
              ) : (
                validation.pwned.checked &&
                !validation.pwned.compromised && (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 px-1">
                    <CheckCircle className="w-3 h-3" />
                    Password not found in known breaches.
                  </div>
                )
              )}
            </div>

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
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
                Object.keys(validation).some((key) => {
                  if (key === "pwned")
                    return (
                      validation.pwned.compromised || validation.pwned.loading
                    );
                  return !validation[key].valid || validation[key].checking;
                })
              }
              className="w-full bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex justify-between mt-6">
            <p>
              <Link
                to="/"
                className="text-[#22D3EE] hover:underline font-medium flex items-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Home
              </Link>
            </p>
            <p className="text-center text-sm text-gray-400">
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
    </div>
  );
}
