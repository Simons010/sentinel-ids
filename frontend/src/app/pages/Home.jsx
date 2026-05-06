import { Link } from "react-router";
import {
  Shield,
  Activity,
  Brain,
  Globe,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lock,
  Zap,
  BarChart2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Detection",
    desc: "Gemini-powered semantic analysis classifies threats with 96%+ confidence in real time.",
  },
  {
    icon: Activity,
    title: "Live Threat Monitoring",
    desc: "WebSocket-driven dashboard shows every ingested log and alert the moment it arrives.",
  },
  {
    icon: Globe,
    title: "Network Visualisation",
    desc: "Geographical attack maps and heatmaps show where threats originate across the globe.",
  },
  {
    icon: BarChart2,
    title: "ML Anomaly Detection",
    desc: "Random Forest model trained on UNSW-NB15 catches statistical anomalies rules miss.",
  },
  {
    icon: AlertTriangle,
    title: "Attack Chain Correlation",
    desc: "Batch logs are analysed as sequences — full APT kill chains are detected automatically.",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Admin, Analyst, and Viewer roles keep sensitive data in the right hands.",
  },
];

const stats = [
  { value: "98.2%", label: "Detection Accuracy" },
  { value: "<50ms", label: "Alert Latency" },
  { value: "12", label: "Attack Chain Patterns" },
  { value: "3-Layer", label: "Detection Pipeline" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/80 backdrop-blur border-b border-[#334155]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Sentinel-IDS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-[#22D3EE] rounded-lg text-sm text-gray-300 hover:text-white hover:border-none hover:bg-[#22D3EE] transition-colors active:bg-[#0EA5E9]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-[#22D3EE] text-white rounded-lg active:bg-[#0EA5E9] hover:bg-transparent hover:border hover:border-[#22D3EE] transition-colors"
            >
              Request Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-full text-sm text-[#22D3EE] mb-6">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Intrusion Detection
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Detect threats before{" "}
            <span className="bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] bg-clip-text text-transparent">
              they become incidents
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Sentinel-IDS combines rule-based detection, machine learning anomaly
            scoring, and AI semantic analysis into a single real-time security
            dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all"
            >
              Request Access <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-6 py-3 border border-[#334155] text-gray-300 rounded-lg hover:border-[#22D3EE]/50 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[#334155]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-[#22D3EE] mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to secure your network
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A complete IDS pipeline from raw log ingestion to AI-classified
              alerts, all in one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-[#22D3EE]/50 transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 bg-[#22D3EE]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#22D3EE]" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-[#1E293B] border border-[#334155] rounded-2xl p-12">
          <div className="w-14 h-14 bg-gradient-to-br from-[#22D3EE] to-[#0EA5E9] rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Ready to secure your infrastructure?
          </h2>
          <p className="text-gray-400 mb-8">
            Request access and an administrator will activate your account
            within 24 hours.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#0EA5E9] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#22D3EE]/30 transition-all"
          >
            Request Access <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#334155] py-8 px-6 text-center text-sm text-gray-400">
        © 2026 Sentinel-IDS. All rights reserved.
        <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
