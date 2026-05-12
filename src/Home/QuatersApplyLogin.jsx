import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminBuilding from "../assets/AdminBuilding.jpg";
import Logo from "../assets/Logo.png";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function IconId() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="13" rx="2" />
      <circle cx="7.5" cy="10" r="2" />
      <path d="M11 9h4M11 12h3" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Vacant Quarters/Plots", to: "/dashboard" },
  { label: "Staff Login", to: "/StaffLogin" },
];

export default function QuartersApplyLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(true); // ✅ 

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setErrorMessage("");
    setIsSubmitting(true);

    if (username.trim() !== "employee" || password !== "employee123") {
      setError("Invalid username or password.");
      setIsSubmitting(false);
      return;
    }

    navigate("/ApplyForQuarters", { replace: true });
  };

  return (
    <div className="font-sans bg-[#0f1f3d] h-screen flex flex-col overflow-hidden">


      {/* ── Main ── */}
      <main className="flex-1 flex items-stretch overflow-hidden min-h-0">

        {/* LEFT — image panel (hidden below lg) */}
        <div className="hidden lg:block flex-[0_0_66.6667%] relative overflow-hidden">
          <img
            src={adminBuilding}
            alt="Admin Building"
            className="w-full h-full object-cover object-center"
          />
          <div className="inline-block bg-orange-500 text-white text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1 rounded mb-3.5">
            Paradip Port Authority
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(15,31,61,0.7)]" />

          {/* Bottom caption */}
          <div className="absolute bottom-12 left-12 right-12">

            <h2 className="text-white text-[34px] font-black leading-[1.15] tracking-[-0.02em] mb-3 m-0">
              Built for the<br />Next Generation.
            </h2>
            <p className="text-white/65 text-sm leading-relaxed m-0 mt-3">
              A secure, unified quarters management system<br />
              for port employees across the estate.
            </p>
          </div>
        </div>

        {/* RIGHT — form panel */}
        <div className="flex-1 lg:flex-[0_0_33.3333%] bg-[#ffffff] flex flex-col px-6 py-8 overflow-hidden relative">
          {/* Top-center logo */}
          <div className="absolute top-[36px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 ">
              <img
                src={Logo}
                alt="Paradip Port Authority logo"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[20px] font-semibold text-blue-950 mt-4 mb-0 text-center">
              Paradip Port Authority
            </p>
          </div>

          <Link to="/" className="absolute top-5 right-6 inline-flex items-center gap-1 text-sm font-bold text-[#e87722] no-underline hover:underline transition-colors duration-200">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 2L4 7l5 5" />
            </svg>
            Back to Home
          </Link>

          <div className="w-full max-w-[475px] mx-auto flex-1 pt-[120px] flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,31,61,0.10)] px-8 py-9">
              <div
                className={`w-full max-w-[400px] mx-auto transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
              >
                <div className="text-center mb-6">
                  <h1 className="text-[36px] font-semibold text-blue-950 mb-2 m-0">
                    Employee Login
                  </h1>
                  <p className="text-slate-500 text-sm m-0 mt-2">
                    Sign in to access the quarters application portal.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-[14px] font-bold uppercase tracking-widest text-blue-900 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-800 pointer-events-none">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full pl-10 pr-4 py-4 text-sm rounded-xl border border-blue-100 bg-blue-50/60 text-gray-700 placeholder-gray-400/60 outline-none transition-all duration-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[14px] font-bold uppercase tracking-widest text-blue-900 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-800 pointer-events-none">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="w-full pl-10 pr-10 py-4 text-sm rounded-xl border border-blue-100 bg-blue-50/60 text-gray-700 placeholder-gray-400/60 outline-none transition-all duration-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-800 hover:text-blue-600 transition-colors"
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
                  <div className="mt-3 mb-1 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5">
                    <svg className="flex-shrink-0 mt-0.5 text-red-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs text-red-600 leading-snug">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="relative w-full py-3.5 rounded-xl text-white text-sm font-black tracking-[0.15em] uppercase overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed mt-5 group"
                  style={{
                    background: "linear-gradient(135deg, #fc882a 0%, #ff6105 100%)",
                    boxShadow: "0 4px 20px rgba(5, 19, 55, 0.45)",
                  }}
                >
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Logging in…
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-[14px] text-blue-950 mt-auto ">
            <p>
              © 2026 Paradip Port Authority. All rights reserved.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}

    </div>
  );
}
