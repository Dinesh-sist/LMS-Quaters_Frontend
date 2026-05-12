import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Image2 from "../assets/image2.png";

const ROLES = ["Estate Officer", "Admin", "Finance", "Technical"];
const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState(ROLES[0]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    if (!username || !password) {
      setError("Enter username and password.");
      return;
    }

    if (role !== "Admin") {
      setError("Only Admin access is allowed here.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        navigate("/admin/verify", { replace: true });
      } else {
        setError("Invalid admin credentials. Use admin / admin123.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 relative overflow-hidden">

      {/* Animated gradient background */}
      <style>{`
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .sl-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .sl-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30,58,138,.12);
        }
        .sl-submit:hover:not(:disabled) {
          background: #2b4a8f !important;
          transform: translateY(-1px);
        }
      `}</style>
      <div className="sl-gradient-bg" />

      {/* Outer white card */}
      <div className="relative z-10 w-[88vw] max-w-[1200px] min-h-[82vh] bg-white rounded-[28px] shadow-2xl flex flex-col overflow-hidden">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Body — image left, form right */}
        <div className="flex-1 grid grid-cols-2 min-h-0">

          {/* ── LEFT: Image panel ── */}
          <div className="flex items-center justify-center pl-10 pr-6 py-8">
            <img
              src={Image2}
              alt="Staff at desk"
              className="w-full max-w-[560px] h-auto object-contain"
            />
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="flex items-center justify-center px-12 py-10">
            <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-3xl px-9 py-10 shadow-[0_4px_32px_rgba(30,58,138,0.09)] flex flex-col gap-5">

              {/* Heading */}
              <div className="mb-0.5">
                <h2 className="font-bold text-[26px] text-slate-900 m-0 mb-1" style={{ fontFamily: "Georgia, serif" }}>
                  Sign In
                </h2>
                <p className="text-[13px] text-slate-400 m-0">
                  Use your official PPA staff credentials
                </p>
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
                  Role
                </label>
                <div className="flex gap-2 flex-wrap">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-full border-2 cursor-pointer transition-all duration-150
                        ${role === r
                          ? "bg-blue-950 text-white border-blue-950 shadow-[0_2px_10px_rgba(30,58,138,0.2)]"
                          : "bg-white text-slate-600 border-slate-200 hover:opacity-80"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="sl-input w-full text-[13px] px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 bg-blue-50 text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="staff.username"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M3 18c0-4 3.134-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="sl-input w-full text-[13px] px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 bg-blue-50 text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 p-0.5 flex items-center"
                  >
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
                      {!showPass && <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="sl-submit w-full text-sm font-bold py-3.5 rounded-2xl border-0 cursor-pointer bg-blue-950 text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Verifying…" : `Login as ${role}`}
              </button>

              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Dev notice */}
              <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="6" stroke="#f97316" strokeWidth="1.4"/>
                  <path d="M7 4v4M7 10v.5" stroke="#f97316" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <p className="m-0 text-[11.5px] text-orange-700 leading-relaxed">
                  Use admin / admin123 to sign in as the Admin user and land on the Verify Quarter Applications page.
                </p>
              </div>

              {/* Back to home */}
              <p className="text-center text-xs text-slate-400 m-0">
                <Link to="/" className="text-blue-950 no-underline font-semibold hover:underline">
                  ← Back to Home
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
