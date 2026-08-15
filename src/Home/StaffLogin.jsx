import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Popup from "../Components/Popup";
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
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "info" });
  const navigate = useNavigate();

  const showToast = (message, title = "Login Error", variant = "error") => {
    setPopup({ open: true, title, message, variant });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!username || !password) {
      const msg = "Enter username and password.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }

    if (role !== "Admin") {
      const msg = "Only Admin access is allowed here.";
      setError(msg);
      showToast(msg, "Access Restricted");
      return;
    }

    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      if (data?.user?.role !== "admin") {
        const msg = "This account is not an admin.";
        setError(msg);
        showToast(msg, "Access Denied");
        return;
      }

      setAuth({ token: data.token, user: data.user });
      navigate("/admin/dashboard", { replace: true });
    } catch (e2) {
      const msg = e2?.message || "Login failed.";
      setError(msg);
      showToast(msg, "Login Failed");
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
            transform: translate3d(0, 30px, 0) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .staff-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .staff-login-card {
          animation: loginCardEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .staff-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12);
        }
        .staff-login-stage {
          min-height: calc(100vh - 120px);
        }
        .staff-login-shell {
          max-width: 500px;
        }
        .staff-login-form {
          gap: 14px;
        }
        .staff-login-copy {
          line-height: 1.55;
        }

        @media (max-height: 700px) {
          .staff-login-title {
            font-size: 24px;
          }
          .staff-login-copy {
            display: none;
          }
          .staff-login-label {
            font-size: 9px;
          }
          .staff-login-field,
          .staff-login-action {
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }

        @media (max-width: 640px) {
          .staff-login-title {
            font-size: 16px !important;
          }
          .staff-login-card {
            padding: 14px !important;
          }
        }
        @media (max-height: 600px) {
          .staff-login-shell {
            max-width: 460px;
          }
          .staff-login-card {
            padding: 14px 16px;
            gap: 8px;
          }
          .staff-login-stage {
            padding-top: 4px;
            padding-bottom: 4px;
          }
          .staff-login-shell {
            max-width: 440px;
          }
          .staff-login-card {
            border-radius: 16px;
          }
        }

        @media (min-height: 800px) {
          .staff-login-heading {
            margin-bottom: 14px;
          }
          .staff-login-title {
            font-size: 30px;
          }
          .staff-login-form {
            gap: 16px;
          }
          .staff-login-back {
            padding-top: 2px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .staff-gradient-bg,
          .staff-login-card {
            animation: none !important;
          }
        }
      `}</style>
      <div className="staff-gradient-bg" />

      <div className="relative z-10 flex min-h-screen w-full flex-col bg-[#fcfefd] shadow-2xl">
        <TopNavbar navTextColor="light" />

        <div className="staff-login-stage flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(400px,500px)] xl:gap-10 xl:px-12 xl:py-8 2xl:grid-cols-[minmax(0,1.65fr)_minmax(420px,520px)]">
          <div className="hidden items-center justify-center xl:flex xl:self-stretch">
            <img
              src={Image2}
              alt="Staff at desk"
              className="h-auto max-h-[calc(100vh-190px)] w-full max-w-[min(56vw,720px)] object-contain"
            />
          </div>

          <div className="staff-login-shell flex items-center justify-center w-full">
            {/* Main Interactive Card Container */}
            <div className="staff-login-card relative mt-3 sm:mt-5 xl:mt-6 flex w-full max-w-[min(100%,480px)] flex-col gap-[clamp(10px,1.5vh,16px)] rounded-[22px] border border-blue-950/70 bg-white px-3.5 py-4 sm:px-6 sm:py-6 shadow-[0_6px_28px_rgba(30,58,138,0.32)]">

              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 shadow-sm">
                      <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <h1
                        className="staff-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Staff Login
                      </h1>
                      <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800 whitespace-nowrap">
                        Quarters Portal
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 py-1 text-[11px] font-semibold text-blue-950 shadow-sm transition-all duration-200 hover:bg-blue-950 hover:text-white hover:shadow-md cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    Home
                  </button>
                </div>

                <p className="staff-login-copy m-0 text-[12px] text-slate-700 sm:text-[13px]">
                  Use your official PPA staff credentials to access the admin dashboard.
                </p>
              </div>

              <form className="staff-login-form flex flex-1 flex-col" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="staff-login-label text-[12px] font-bold uppercase tracking-[2px] text-slate-700">Role</label>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`min-h-[clamp(38px,4.2vh,44px)] rounded-full border-2 px-2 py-1.5 text-center text-[clamp(11px,0.95vw,13px)] lg:text-[13px] font-semibold transition-all duration-150 sm:px-3 sm:py-1 cursor-pointer ${role === r
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
                  <label className="staff-login-label text-[12px] font-bold uppercase tracking-[2px] text-slate-700">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="username"
                      name="staff_username"
                      id="staff_username"
                      className="staff-login-field staff-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                      placeholder="staff.username"
                    />
                    <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="staff-login-label text-[12px] font-bold uppercase tracking-[2px] text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      name="staff_password"
                      id="staff_password"
                      className="staff-login-field staff-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-700 transition-colors hover:text-slate-600 cursor-pointer"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="staff-login-action mt-1 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : `Login as ${role}`}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer sticky={false} />
      </div>

      <Popup
        open={popup.open}
        title={popup.title}
        message={popup.message}
        variant={popup.variant}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
