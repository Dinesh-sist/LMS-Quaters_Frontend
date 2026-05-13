import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Image2 from "../assets/image2.png";

const ROLES = ["Admin", "Estate Officer", "Finance", "Technical"];
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
    if (!username || !password) { setError("Enter username and password."); return; }
    if (role !== "Admin") { setError("Only Admin access is allowed here."); return; }
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
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-3 py-3 sm:px-4 sm:py-6 lg:px-6">

      <style>{`
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .sl-gradient-bg {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .sl-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30,58,138,.12);
        }
      `}</style>
      <div className="sl-gradient-bg" />

      {/* Outer white card — wider, auto height */}
      <div className="relative z-10 flex h-[82vh] w-[min(98vw,1080px)] max-h-[1180px] max-w-[1800px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl sm:rounded-[32px]">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Body */}
        <div className="min-h-0 flex-1 flex-col lg:grid lg:grid-cols-2">

          {/* LEFT: Image — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:flex items-center justify-center px-8 py-8 xl:px-10">
            <img
              src={Image2}
              alt="Staff at desk"
              className="h-auto w-full max-w-[420px] object-contain xl:max-w-[500px]"
            />
          </div>

          {/* RIGHT: Form */}
          <div className="flex items-center justify-center px-3 pb-5 pt-2 sm:px-6 sm:pb-8 sm:pt-4 lg:px-10 lg:py-8 xl:px-12">
            <div className="flex w-full max-w-[480px] flex-col gap-4 rounded-[24px] border border-slate-200 bg-white px-4 py-6 shadow-[0_4px_32px_rgba(30,58,138,0.09)] sm:rounded-3xl sm:px-6 sm:py-8 md:px-8 lg:px-9">

              {/* Heading */}
              <div>
                <h2 className="m-0 mb-1 text-[24px] font-bold text-slate-900 sm:text-[26px]" style={{ fontFamily: "Georgia, serif" }}>
                  Sign In
                </h2>
                <p className="m-0  text-[13px] leading-5 text-slate-400">
                  Use your official PPA staff credentials
                </p>
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">Role</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`min-h-[40px] rounded-full border-2 px-3 py-2 text-[11px] font-semibold transition-all duration-150 sm:px-4 sm:py-1.5 sm:text-xs ${
                        role === r
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
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">Username</label>
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
                <label className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="sl-input w-full text-[13px] px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 bg-blue-50 text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
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
                className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
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
