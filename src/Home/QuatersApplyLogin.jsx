import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import adminBuilding from "../assets/AdminBuilding.jpg";
import Logo from "../assets/Logo.png";

export default function QuartersApplyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError("");
    setIsLoading(true);

    if (username.trim() !== "employee" || password !== "employee123") {
      setError("Invalid username or password.");
      setIsLoading(false);
      return;
    }

    navigate("/Quarters/Apply", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4">
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .employee-gradient-bg {
          position: absolute; inset: 0; z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .employee-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30,58,138,.12);
        }
      `}</style>
      <div className="employee-gradient-bg" />

      <div className="relative z-10 flex h-[92vh] w-[min(99.5vw,1480px)] max-h-[1220px] max-w-[1800px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl sm:h-[93vh] sm:rounded-[32px] lg:h-[94vh]">
        <TopNavbar />

        <div className="min-h-0 flex-1 px-3 pb-4 pt-1 sm:px-5 sm:pb-6 sm:pt-2 lg:grid lg:grid-cols-[1.22fr_0.78fr] lg:gap-6 lg:px-8 lg:pb-8 lg:pt-1 xl:px-10">
          <div className="hidden lg:flex items-start justify-end">
            <div className="relative h-[clamp(600px,72vh,820px)] w-full overflow-hidden rounded-[30px] bg-slate-100 shadow-[0_12px_40px_rgba(15,31,61,0.14)]">
              <img
                src={adminBuilding}
                alt="Paradip Port Authority building"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(15,31,61,0.08)] via-[rgba(15,31,61,0.14)] to-[rgba(15,31,61,0.78)]" />

              

              <div className="absolute bottom-10 left-10 right-10">
                <div className="mb-4 flex items-center gap-3">
                  
                  
                </div>

                <h2
                  className="m-0 max-w-[520px] text-[34px] font-bold leading-[1.1] text-white xl:text-[40px]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Employee access for the quarters application system.
                </h2>
                <p className="m-0 mt-4 max-w-[520px] text-[15px] leading-7 text-white/75">
                  Manage housing requests, continue saved applications, and stay connected to the latest quarters updates in one secure portal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-start pt-3 sm:pt-4 lg:h-[clamp(600px,2vh,700px)] lg:pt-0">
            <div className="flex w-full max-w-[560px] flex-col justify-between gap-5 rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-[0_4px_32px_rgba(30,58,138,0.09)] sm:rounded-3xl sm:px-6 sm:py-7 md:px-8 lg:h-full lg:px-7 xl:px-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-2.5 shadow-sm">
                    <img
                      src={Logo}
                      alt="Paradip Port Authority logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                      Paradip Port Authority
                    </p>
                    <h1
                      className="m-0 mt-2 text-[24px] font-bold text-slate-900 sm:text-[38px]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Employee Login
                    </h1>
                    <p className="m-0 mt-2 text-[13px] leading-6 text-slate-400">
                      Sign in to access the quarters application portal with your employee credentials.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 pr-10 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      placeholder="employee"
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
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 pr-10 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                    >
                      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                        />
                        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                        {!showPass && (
                          <path
                            d="M3 3l14 14"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

             
                     

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Employee"}
                </button>
              </div>

              {/* Dev notice */}
              <div className="mt-4 text-center text-[12px] text-slate-400"></div>

              {/* Back to home */}
              <p className="mt-auto pt-5   text-center text-[12px] text-slate-400 m-0">
                <Link to="/" className="text-blue-950 no-underline font-semibold hover:underline">
                  ← Back to Home
                </Link>
              </p>
              <p className="m-0 text-center text-[11px] text-slate-400">
                  &copy; 2026 Paradip Port Authority. All rights reserved.
                </p>

            </div>
            </div>
          </div>
        </div>
      </div>

    
  );
}
