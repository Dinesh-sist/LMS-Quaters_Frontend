import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Image from "../assets/Image13.png";
import Logo from "../assets/Logo.png";
import {
  getEmployeeClasses,
  login,
  lookupEmployee,
  registerEmployee,
  requestPasswordResetOtp,
  resetEmployeePassword,
  verifyPasswordResetOtp,
} from "../api";
import { setAuth } from "../auth";

export default function QuartersApplyLogin({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [reg, setReg] = useState({
    employeeId: "",
    dateOfBirth: "",
    employeeName: "",
    dateOfJoining: "",
    className: "",
    classChoice: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirmPass, setShowRegConfirmPass] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [classOptions, setClassOptions] = useState([]);
  const [forgotStep, setForgotStep] = useState("request");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  const normalizedClassOptions = useMemo(() => {
    const items = Array.isArray(classOptions) ? classOptions : [];



    const opts = items
      .map((c) => ({
        priority: c?.Class_PRIORITY,
        className: c?.class_name,
        classValue: c?.Class,
      }))
      .filter((c) => {
        const className = typeof c.className === "string" ? c.className.trim() : "";
        const classValue = typeof c.classValue === "string" ? c.classValue.trim() : "";
        if (!className && !classValue) return false;
        if (className && className.toLowerCase() === "none") return false;
        if (classValue && classValue.toLowerCase() === "none") return false;
        return true;
      })
      .map((c) => {
        const className = typeof c.className === "string" ? c.className.trim() : "";
        const classValue = typeof c.classValue === "string" ? c.classValue.trim() : "";
        const priority = Number(c.priority);

        if (className.toUpperCase() === "CLASS-I" || classValue.toUpperCase().includes("CLASS-I")) {
          if (priority === 1) return { value: classValue || className, label: `${classValue || className} (Senior)` };
          if (priority === 2) return { value: classValue || className, label: `${classValue || className} (Junior)` };
        }

        return { value: classValue || className, label: classValue || className };
      });

    return opts.length
      ? opts
      : [
        { value: "Class I", label: "Class I" },
        { value: "Class II", label: "Class II" },
        { value: "Class III", label: "Class III" },
        { value: "Class IV", label: "Class IV" },
      ];
  }, [classOptions]);

  const fetchClasses = useCallback(async () => {
    try {
      const data = await getEmployeeClasses();
      setClassOptions(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setClassOptions([]);
    }
  }, []);

  const resetForgotState = () => {
    setForgotStep("request");
    setForgotIdentifier("");
    setForgotOtp("");
    setForgotResetToken("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setShowForgotNewPass(false);
    setShowForgotConfirmPass(false);
    setForgotMessage("");
  };

  useEffect(() => {
    if (initialMode === "register") {
      setMode("register");
      fetchClasses();
    }
  }, [fetchClasses, initialMode]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const data = await login(username.trim(), password);
      if (data?.user?.role?.toLowerCase() !== "employee") {
        setError("This account is not an employee.");
        return;
      }
      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("lmsq_terms_accepted", "1");
      navigate("/Quarters/ApplyEmployees", { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    if (!forgotIdentifier.trim()) {
      setError("Enter your Employee ID or registered email.");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordResetOtp(forgotIdentifier.trim());
      setForgotStep("verify");
      setForgotMessage("OTP sent to your registered email.");
    } catch (e2) {
      setError(e2?.message || "Could not send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    if (!forgotOtp.trim()) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifyPasswordResetOtp(forgotIdentifier.trim(), forgotOtp.trim());
      setForgotResetToken(data?.resetToken || "");
      setForgotStep("reset");
      setForgotMessage("OTP verified. Create your new password.");
    } catch (e2) {
      setError(e2?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    if (!forgotNewPassword) {
      setError("Enter a new password.");
      return;
    }
    if (forgotNewPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await resetEmployeePassword(forgotResetToken, forgotNewPassword);
      setForgotMessage("Password changed successfully. Please login with your new password.");
      window.setTimeout(() => {
        resetForgotState();
        setMode("login");
      }, 1200);
    } catch (e2) {
      setError(e2?.message || "Could not reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");

    if (!reg.email.trim()) return setError("Email is required.");
    if (!reg.password) return setError("Password is required.");
    if (reg.password !== reg.confirmPassword) return setError("Passwords do not match.");

    setIsLoading(true);
    try {
      await registerEmployee({
        employeeId: reg.employeeId.trim(),
        dateOfBirth: reg.dateOfBirth,
        employeeName: reg.employeeName.trim(),
        dateOfJoining: reg.dateOfJoining,
        className: reg.className.trim(),
        classChoice: reg.classChoice,
        mobile: reg.mobile.trim(),
        email: reg.email.trim(),
        password: reg.password,
      });

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        setReg({
          employeeId: "",
          dateOfBirth: "",
          employeeName: "",
          dateOfJoining: "",
          className: "",
          classChoice: "",
          mobile: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setUsername("");
        setPassword("");
        navigate("/QuartersApplyLogin", { replace: true });
      }, 1200);
    } catch (e2) {
      setError(e2?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async () => {
    setError("");
    if (!reg.employeeId.trim() || !reg.dateOfBirth) {
      setError("Enter Employee ID and Date of Birth to fetch details.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await lookupEmployee(reg.employeeId.trim(), reg.dateOfBirth);
      setReg((r) => ({
        ...r,
        employeeName: data?.employeeName || r.employeeName,
        dateOfJoining: data?.dateOfJoining || r.dateOfJoining,
        className: data?.className || r.className,
        classChoice: data?.classChoice || r.classChoice,
      }));
    } catch (e2) {
      setError(e2?.message || "Employee lookup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === "register") {
    return (
      <div className="relative h-screen w-full overflow-hidden">
        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ql-gradient-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
            background-size: 300% 300%;
            animation: gradientMove 15s ease-in-out infinite;
          }
          .ql-input:focus {
            border-color: #1e3a8a !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.12);
          }
        `}</style>

        <div className="ql-gradient-bg" />

        <div className="relative z-10 flex h-screen w-full flex-col overflow-hidden bg-white shadow-2xl">
          <TopNavbar navTextColor="light" />

          <div className="flex min-h-0 flex-1 items-center px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 lg:grid lg:grid-cols-[2fr_1fr] lg:gap-6 lg:px-8 lg:pb-8 ">
            <div className="hidden items-center justify-center lg:flex lg:self-stretch">
              <img
                src={Image}
                alt="Paradip Port Authority building"
                className="h-auto max-h-[calc(100vh-170px)] w-full max-w-[min(58vw,880px)] lg:max-w-[600px] object-contain"
              />
            </div>

            <div className="flex items-center justify-center lg:justify-start">
              <form
                className="flex max-h-full w-full max-w-[min(100%,560px)] flex-col gap-[clamp(12px,1.7vh,18px)] overflow-y-auto rounded-[20px] border border-slate-200 bg-white px-4 py-5 shadow-[0_4px_24px_rgba(30,58,138,0.08)] sm:rounded-[24px] sm:px-5 sm:py-6 md:px-6 lg:px-7 "
                onSubmit={handleRegister}
              >
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-2 shadow-sm">
                      <img src={Logo} alt="Paradip Port Authority logo" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                        Paradip Port Authority
                      </p>
                      <h1
                        className="m-0 mt-1.5 text-[22px] font-bold text-slate-900 sm:text-[26px] lg:text-[32px]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        Employee Registration
                      </h1>
                    </div>
                  </div>

                  <p className="m-0 text-[12px] leading-5 text-slate-400 sm:text-[13px]">
                    Fill in your employee details to create access for the quarters application portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Employee ID</label>
                    <input
                      type="text"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.employeeId}
                      onChange={(e) => setReg((r) => ({ ...r, employeeId: e.target.value }))}
                      placeholder="Employee ID"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.dateOfBirth}
                        onChange={(e) => setReg((r) => ({ ...r, dateOfBirth: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-[12px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Fetch
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                    Name of the Employee
                  </label>
                  <input
                    type="text"
                    className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={reg.employeeName}
                    onChange={(e) => setReg((r) => ({ ...r, employeeName: e.target.value }))}
                    placeholder="Employee name"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.dateOfJoining}
                      onChange={(e) => setReg((r) => ({ ...r, dateOfJoining: e.target.value }))}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Class Name</label>
                    <input
                      type="text"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.className}
                      onChange={(e) => setReg((r) => ({ ...r, className: e.target.value }))}
                      placeholder="Class name"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Choose a class</label>
                  <select
                    className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200"
                    value={reg.classChoice}
                    onChange={(e) => setReg((r) => ({ ...r, classChoice: e.target.value }))}
                  >
                    <option value="">Choose a class</option>
                    {normalizedClassOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Mobile number</label>
                    <input
                      type="tel"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.mobile}
                      onChange={(e) => setReg((r) => ({ ...r, mobile: e.target.value }))}
                      placeholder="Mobile"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Email (Username)</label>
                    <input
                      type="email"
                      autoComplete="email"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.email}
                      onChange={(e) => setReg((r) => ({ ...r, email: e.target.value }))}
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPass ? "text" : "password"}
                        autoComplete="new-password"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.password}
                        onChange={(e) => setReg((r) => ({ ...r, password: e.target.value }))}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass((p) => !p)}
                        className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showRegPass ? "Hide password" : "Show password"}
                      >
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                          {!showRegPass && (
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Re-enter password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPass ? "text" : "password"}
                        autoComplete="new-password"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] lg:text-[13px] lg:text-[13px] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.confirmPassword}
                        onChange={(e) => setReg((r) => ({ ...r, confirmPassword: e.target.value }))}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPass((p) => !p)}
                        className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showRegConfirmPass ? "Hide password" : "Show password"}
                      >
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                          <path
                            d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                          {!showRegConfirmPass && (
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
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  type="submit"
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] lg:text-[14px] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Submit Registration"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] lg:text-[14px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50"
                  onClick={() => {
                    setError("");
                    navigate("/QuartersApplyLogin");
                  }}
                >
                  Back to Login
                </button>

              </form>
            </div>
          </div>
        </div>
        <Footer sticky={false} />

        {successOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
              <div className="text-[15px] font-bold text-slate-900">Successfully registered</div>
              <div className="mt-1 text-[13px] text-slate-500">Redirecting back to Employee Login…</div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-slate-50 font-sans">
        <TopNavbar navTextColor="dark" />
        
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {forgotStep === "request" ? "Reset Password" : forgotStep === "verify" ? "Enter OTP" : "New Password"}
              </h1>
            </div>

            <form
              className="flex flex-col gap-5"
              onSubmit={
                forgotStep === "request"
                  ? handleRequestOtp
                  : forgotStep === "verify"
                    ? handleVerifyOtp
                    : handleResetPassword
              }
            >
              {forgotStep === "request" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Employee ID or Email
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="Enter your ID or email"
                  />
                </div>
              ) : null}

              {forgotStep === "verify" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-xl font-medium tracking-[0.2em] text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                  />
                </div>
              ) : null}

              {forgotStep === "reset" ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
              ) : null}

              {forgotMessage ? (
                <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {forgotMessage}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {error}
                </div>
              ) : null}

              <div className="mt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Processing..." : forgotStep === "request" ? "Send Reset Link" : forgotStep === "verify" ? "Verify Code" : "Update Password"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
                  onClick={() => {
                    setError("");
                    resetForgotState();
                    setMode("login");
                  }}
                >
                  Return to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
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
        .employee-gradient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #e87722, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
        .employee-login-card {
          animation: loginCardEnter 1s cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
        }
        .employee-login-stage {
          min-height: clamp(520px, calc(100vh - 170px), 760px);
        }
        .employee-login-shell {
          width: 100%;
        }
        .employee-login-form {
          gap: 16px;
        }
        .employee-login-copy {
          line-height: 1.5;
        }
        .employee-input:focus {
          border-color: #1e3a8a !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(30,58,138,.12);
        }
        @media (max-width: 1024px) {
          .employee-login-title {
            font-size: 24px;
          }
          .employee-login-copy {
            font-size: 12px;
          }
          .employee-login-label {
            font-size: 10px;
            letter-spacing: 1.7px;
          }
          .employee-login-field,
          .employee-login-action {
            font-size: 12px;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .employee-login-shell {
            justify-content: center;
          }
          .employee-login-card {
            margin-inline: auto;
          }
        }
        @media (max-width: 1279px) {
          .employee-login-stage {
            min-height: auto;
          }
          .employee-login-shell {
            justify-content: center;
          }
          .employee-login-card {
            margin-inline: auto;
          }
        }
        @media (max-height: 760px) and (min-width: 1280px) {
          .employee-login-stage {
            align-items: flex-start;
            min-height: auto;
          }
          .employee-login-card {
            gap: 10px;
            padding-block: 18px;
          }
          .employee-login-heading {
            margin-bottom: 8px;
          }
          .employee-login-title {
            font-size: 24px;
          }
          .employee-login-form {
            gap: 12px;
          }
          .employee-login-back {
            padding-top: 2px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .employee-gradient-bg,
          .employee-login-card {
            animation: none !important;
          }
        }
      `}</style>
      <div className="employee-gradient-bg" />

      <div className="relative z-10 flex min-h-screen w-full flex-col bg-[#fcfefd] shadow-2xl">
        <TopNavbar navTextColor="light" />

        <div className="employee-login-stage flex flex-1 items-center px-4 py-5 sm:px-6 sm:py-6 xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,520px)] xl:gap-8 xl:px-8 xl:py-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(400px,540px)]">
          <div className="hidden items-center justify-center xl:flex xl:self-stretch">
            <img
              src={Image}
              alt="Paradip Port Authority building"
              className="h-auto max-h-[calc(100vh-190px)] w-full max-w-[min(58vw,760px)] object-contain" />
          </div>

          <div className="employee-login-shell flex items-center justify-center xl:justify-start">
            <div className="employee-login-card flex w-full max-w-[min(100%,500px)] flex-col gap-[clamp(12px,1.7vh,18px)] rounded-[20px] border border-blue-950/70 bg-white px-4 py-5 shadow-[0_4px_24px_rgba(30,58,138,0.4)] sm:rounded-[24px] sm:px-5 sm:py-6 md:px-6 xl:px-7">
              <div>
                <div className="employee-login-heading mb-4 flex items-center gap-4">

                  <div>

                    <h1
                      className="employee-login-title m-0 mt-1.5 text-[22px] font-bold text-slate-900 sm:text-[26px] lg:text-[28px] "
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Employee Login
                    </h1>
                  </div>
                </div>

                <p className="employee-login-copy m-0 text-[12px] text-slate-400 sm:text-[13px]">
                  Sign in to access the quarters application portal with your employee credentials.
                </p>
              </div>

              <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1.5">
                  <label className="employee-login-label text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="off"
                      name="employee_username"
                      id="employee_username"
                      className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      placeholder="Email"
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
                  <label className="employee-login-label text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      name="employee_password"
                      id="employee_password"
                      className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
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

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  type="submit"
                  className="employee-login-action mt-1 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Employee"}
                </button>

                <button
                  type="button"
                  className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px]"
                  onClick={() => {
                    setError("");
                    resetForgotState();
                    setMode("forgot");
                  }}
                >
                  Forgot Password?
                </button>

                <button
                  type="button"
                  className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px]"
                  onClick={async () => {
                    setError("");
                    navigate("/EmployeeRegister");
                  }}
                >
                  New Register
                </button>

                <div className="employee-login-back mt-auto pt-3 text-center text-[12px] text-slate-400">
                  <Link to="/" className="font-semibold text-blue-950 no-underline hover:underline">
                    &larr; Back to Home
                  </Link>
                </div>

              </form>
            </div>
          </div>
        </div>
        <Footer sticky={false} />
      </div>
    </div>
  );
}

