import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminBuilding from "../assets/AdminBuilding.jpg";
import Logo from "../assets/Logo.png";

export default function QuartersApplyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError("");
    setErrorMessage("");
    setIsSubmitting(true);

    if (username.trim() !== "employee" || password !== "employee123") {
      setError("Invalid username or password.");
      setIsSubmitting(false);
      return;
    }

    navigate("/Quarters/Apply", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0f1f3d] font-sans lg:h-screen lg:overflow-hidden">
      <main className="flex min-h-0 flex-1 items-stretch overflow-visible lg:h-full lg:overflow-hidden">
        <div className="relative hidden overflow-hidden lg:block lg:flex-[0_0_58%] xl:flex-[0_0_66.6667%]">
          <img
            src={adminBuilding}
            alt="Admin Building"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(15,31,61,0.7)]" />

          <div className="absolute bottom-10 left-10 right-10 xl:bottom-12 xl:left-12 xl:right-12">
            <div className="mb-3.5 inline-block rounded bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Paradip Port Authority
            </div>
            <h2 className="m-0 mb-3 text-[30px] font-black leading-[1.15] tracking-[-0.02em] text-white xl:text-[34px]">
              Built for the
              <br />
              Next Generation.
            </h2>
            <p className="m-0 mt-3 text-sm leading-relaxed text-white/65">
              A secure, unified quarters management system
              <br />
              for port employees across the estate.
            </p>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col bg-white px-4 py-5 sm:px-6 sm:py-6 lg:flex-[0_0_42%] lg:px-5 lg:py-5 xl:flex-[0_0_33.3333%]">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-1 self-start text-xs font-bold text-[#e87722] no-underline transition-colors duration-200 hover:underline sm:text-sm lg:absolute lg:right-6 lg:top-5"
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 7l5 5" />
            </svg>
            Back to Home
          </Link>

          <div className="mt-4 flex flex-col items-center sm:mt-5 lg:absolute lg:left-1/2 lg:top-6 lg:mt-0 lg:-translate-x-1/2">
            <div className="h-20 w-20 rounded-2xl bg-white p-1 sm:h-24 sm:w-24 lg:h-20 lg:w-20">
              <img
                src={Logo}
                alt="Paradip Port Authority logo"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mb-0 mt-3 text-center text-base font-semibold text-blue-950 sm:mt-4 sm:text-[18px] lg:mt-3 lg:text-[16px]">
              PARADIP PORT AUTHORITY
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-[360px]  flex-1 flex-col justify-center pt-8 sm:max-w-[380px] sm:pt-10 lg:max-w-[340px] lg:pt-[90px]">
            <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_4px_24px_rgba(15,31,61,0.10)] sm:px-6 sm:py-8 lg:px-7 lg:py-6">
              <div
                className={`mx-auto w-full max-w-[400px] transition-all duration-500 ${
                  loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="mb-5 text-center sm:mb-6 lg:mb-4">
                  <h1 className="m-0 mb-2 text-[22px] font-semibold text-blue-950 sm:text-[25px] lg:text-[23px]">
                    Employee Login
                  </h1>
                  <p className="m-0 mt-2 text-xs leading-5 text-slate-500">
                    Sign in to access the quarters application portal.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-blue-900">
                    Username
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-800">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      className="w-full rounded-xl border border-blue-100 bg-blue-50/60 py-3 pl-10 pr-4 text-xs text-gray-700 outline-none transition-all duration-200 placeholder-gray-400/60 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-blue-900">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-800">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      className="w-full rounded-xl border border-blue-100 bg-blue-50/60 py-3 pl-10 pr-10 text-xs text-gray-700 outline-none transition-all duration-200 placeholder-gray-400/60 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-800 transition-colors hover:text-blue-600"
                    >
                      {showPass ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-1 mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5">
                    <svg className="mt-0.5 shrink-0 text-red-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs leading-snug text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="group relative mt-5 w-full overflow-hidden rounded-xl py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.15em] lg:mt-4"
                  style={{
                    background: "linear-gradient(135deg, #fc882a 0%, #ff6105 100%)",
                    boxShadow: "0 4px 20px rgba(5, 19, 55, 0.45)",
                  }}
                >
                  <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center text-center text-[10px] text-blue-950 sm:mt-8 sm:text-[11px] lg:mt-4">
            <p>&copy; 2026 Paradip Port Authority. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
