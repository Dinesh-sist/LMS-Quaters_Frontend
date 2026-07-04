import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Image2 from "../assets/image8.png";
import { login } from "../api";
import { setAuth } from "../auth";


const ROLES = ["Admin"];

export default function StaffLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
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
    try {
      const data = await login(username.trim(), password);
      if (data?.user?.role !== "admin") {
        setError("This account is not an admin.");
        return;
      }

      setAuth({ token: data.token, user: data.user });
      navigate("/admin/dashboard", { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes loginCardEnter {
          0% {
            opacity: 0;
            transform: translate3d(75px, 0, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .sl-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .sl-login-card {
          animation: loginCardEnter 1s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .sl-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12);
        }
        @media (prefers-reduced-motion: reduce) {
          .sl-gradient-bg,
          .sl-login-card {
            animation: none !important;
          }
        }
      `}</style>

      <div className="sl-gradient-bg" />

      <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden bg-white shadow-2xl">
        <TopNavbar navTextColor="light" />

        <div className="flex min-h-0 flex-1 items-center px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:px-10 lg:pb-8">          <div className="hidden items-center justify-center lg:flex lg:self-stretch">
          <img
            src={Image2}
            alt="Staff at desk"
            className="h-auto max-h-[calc(100vh-170px)] w-full max-w-[min(58vw,880px)] lg:max-w-[600px] object-contain" />
        </div>

          <div className="flex items-center justify-center lg:justify-start">
            <form
              className="sl-login-card flex w-full max-w-[min(100%,500px)] flex-col gap-[clamp(12px,1.7vh,18px)] rounded-[20px] border border-blue-950/70 bg-white px-4 py-5 shadow-[0_4px_24px_rgba(30,58,138,0.4)] sm:rounded-[24px] sm:px-5 sm:py-6 md:px-6 lg:px-8" onSubmit={handleSubmit}
            >
              <div>
                <h2
                  className="m-0 mb-1 text-[clamp(22px,2.5vw,38px)] lg:text-[38px] font-bold text-slate-900"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Sign In
                </h2>
                <p className="m-0 text-[13px] lg:text-[13px] leading-5 text-slate-400">
                  Use your official PPA staff credentials
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Role</label>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`min-h-[clamp(38px,4.2vh,44px)] rounded-full border-2 px-2 py-1.5 text-center text-[clamp(11px,0.95vw,13px)] lg:text-[13px] font-semibold transition-all duration-150 sm:px-3 sm:py-1 ${role === r
                        ? "border-blue-950 bg-blue-950 text-white shadow-[0_2px_10px_rgba(30,58,138,0.2)]"
                        : "border-slate-200 bg-white text-slate-600 hover:opacity-80"
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    autoComplete="username"
                    className="sl-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="staff.username"
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M3 18c0-4 3.134-6 7-6s7 2 7 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    className="sl-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                      {!showPass && (
                        <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] lg:text-[14px] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}
              >
                {loading ? "Verifying..." : `Login as ${role}`}
              </button>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-auto pt-5 text-center text-[12px] text-slate-400">
                <Link to="/" className="font-semibold text-blue-950 no-underline hover:underline">
                  &larr; Back to Home
                </Link>
              </div>

            </form>
          </div>
        </div>
        <Footer sticky={false} />
      </div>
    </div>
  );
}
