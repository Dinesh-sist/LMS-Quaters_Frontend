import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import adminBuilding from "../assets/AdminBuilding.jpg";
import Logo from "../assets/Logo.png";
import { getEmployeeClasses, login, lookupEmployee, registerEmployee } from "../api";
import { setAuth } from "../auth";

export default function QuartersApplyLogin() {
  const [mode, setMode] = useState("login"); // "login" | "register"
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

  const fetchClasses = async () => {
    try {
      const data = await getEmployeeClasses();
      setClassOptions(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setClassOptions([]);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const data = await login(username.trim(), password);
      if (data?.user?.role !== "employee") {
        setError("This account is not an employee.");
        return;
      }
      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("lmsq_terms_accepted", "1");
      navigate("/Quarters/Apply", { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed.");
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
        setMode("login");
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
      <div className="relative min-h-screen w-full overflow-hidden">
        <style>{`
          .about-gradient-bg {
            background: linear-gradient(
              135deg,
              #08142b 0%,
              #10264d 35%,
              #163564 65%,
              #e87722 100%
            );
          }

          .about-geo-overlay {
            background-image:
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 72px 72px;
            pointer-events: none;
          }

          .about-glow-orb {
            width: 520px;
            height: 520px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(232,119,34,0.14) 0%, transparent 68%);
            pointer-events: none;
          }

          .about-glow-orb-2 {
            width: 340px;
            height: 340px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(16,38,77,0.5) 0%, transparent 70%);
            pointer-events: none;
          }

          .employee-input:focus {
            border-color: #1e3a8a !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(30,58,138,.12);
          }
        `}</style>

        <div className="about-gradient-bg absolute inset-0 -z-10" />
        <div className="absolute inset-0 bg-black/20 -z-10" />
        <div className="about-geo-overlay absolute inset-0 -z-10" />
        <div className="about-glow-orb absolute bottom-[-140px] right-[-100px] -z-10" />
        <div className="about-glow-orb-2 absolute top-[-80px] left-[-80px] -z-10" />

        <div className="relative z-10 flex min-h-screen flex-col">
          <TopNavbar titleColor="text-white" />

          <div className="mx-auto w-full max-w-[980px] px-4 pb-8 sm:px-6 sm:pb-10">
            <h1
              className="m-0 text-[26px] font-bold text-white sm:text-[32px] lg:text-[40px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              New Register
            </h1>
            <p className="mt-2 text-[13px] leading-6 text-white/70">
              Fill the details below to create your employee login.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">
              <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Employee ID</label>
                    <input
                      type="text"
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                        className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                    className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.dateOfJoining}
                      onChange={(e) => setReg((r) => ({ ...r, dateOfJoining: e.target.value }))}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">Class Name</label>
                    <input
                      type="text"
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                    className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200"
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
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                        className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 pr-10 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                        className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 pr-10 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Submit Registration"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50"
                  onClick={() => {
                    setError("");
                    setMode("login");
                  }}
                >
                  Back to Login
                </button>
              </form>
            </div>
          </div>
        </div>

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
        <TopNavbar navTextColor="dark" />

        <div className="min-h-0 overflow-auto flex-1 px-3 pb-4 pt-1 sm:px-5 sm:pb-6 sm:pt-2 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:px-8 lg:pb-8 lg:pt-1 xl:px-10">
          <div className="hidden items-start justify-end pt-1 lg:flex lg:h-[clamp(580px,72vh,760px)]">
            <img
              src={adminBuilding}
              alt="Paradip Port Authority building"
              className="h-full w-full max-w-[660px] rounded-[28px] object-cover xl:max-w-[760px]"
            />
          </div>

          <div className="flex items-start justify-start pt-3 sm:pt-4 lg:h-[clamp(580px,64vh,680px)] lg:pt-1">
            <div className="flex h-full w-full max-w-[720px] flex-col gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-6 shadow-[0_4px_32px_rgba(30,58,138,0.09)] sm:rounded-3xl sm:px-7 sm:py-8 md:px-9 lg:px-10 xl:px-12">
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-2.5 shadow-sm">
                    <img src={Logo} alt="Paradip Port Authority logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-500">
                      Paradip Port Authority
                    </p>
                    <h1
                      className="m-0 mt-2 text-[24px] font-bold text-slate-900 sm:text-[28px] lg:text-[38px]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Employee Login
                    </h1>
                  </div>
                </div>

                <p className="m-0 text-[13px] leading-6 text-slate-400">
                  Sign in to access the quarters application portal with your employee credentials.
                </p>
              </div>

              <form className="flex flex-1 flex-col gap-5" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      autoComplete="username"
                      className="employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-4 py-3 pr-10 text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
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
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
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
                  className="mt-1 w-full rounded-2xl border-0 bg-blue-950 py-3.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Employee"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50"
                  onClick={async () => {
                    setError("");
                    await fetchClasses();
                    setMode("register");
                  }}
                >
                  New Register
                </button>

                <div className="mt-auto pt-5 text-center text-[12px] text-slate-400">
                  <Link to="/" className="font-semibold text-blue-950 no-underline hover:underline">
                    &larr; Back to Home
                  </Link>
                </div>

                <p className="m-0 text-center text-[11px] text-slate-400">
                  &copy; 2026 Paradip Port Authority. All rights reserved.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

