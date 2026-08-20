import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  UserCheck,
} from "lucide-react";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Popup from "../Components/Popup";
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
  forgotUsername,
} from "../api";
import { setAuth } from "../auth";

export default function QuartersApplyLogin({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "forgot" | "forgot-username" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "info" });
  const navigate = useNavigate();

  const showToast = (message, title = "Notice", variant = "error") => {
    setPopup({ open: true, title, message, variant });
  };

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
  const [isRegEmailReadOnly, setIsRegEmailReadOnly] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  const [classOptions, setClassOptions] = useState([]);
  const [forgotStep, setForgotStep] = useState("request"); // "request" | "verify" | "reset"
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [forgotResetToken, setForgotResetToken] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotAccountInfo, setForgotAccountInfo] = useState(null);

  // Forgot Username State
  const [forgotUserEmpId, setForgotUserEmpId] = useState("");
  const [forgotUserDob, setForgotUserDob] = useState("");
  const [retrievedUsername, setRetrievedUsername] = useState(null);
  const [copiedUsername, setCopiedUsername] = useState(false);

  const resetForgotUsernameState = () => {
    setForgotUserEmpId("");
    setForgotUserDob("");
    setRetrievedUsername(null);
    setCopiedUsername(false);
  };

  const resetForgotState = () => {
    setForgotStep("request");
    setForgotIdentifier("");
    setForgotOtp("");
    setOtpValues(["", "", "", "", "", ""]);
    setResendCountdown(0);
    setForgotResetToken("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setShowForgotNewPass(false);
    setShowForgotConfirmPass(false);
    setForgotMessage("");
    setForgotAccountInfo(null);
  };

  const otpInputRefs = useRef([]);

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

  const handleForgotUsername = async (e) => {
    e?.preventDefault();
    setError("");
    setRetrievedUsername(null);
    setCopiedUsername(false);

    if (!forgotUserEmpId.trim()) {
      setError("Please enter your Employee ID.");
      showToast("Please enter your Employee ID.", "Validation Error");
      return;
    }
    if (!forgotUserDob) {
      setError("Please select your Date of Birth.");
      showToast("Please select your Date of Birth.", "Validation Error");
      return;
    }

    setIsLoading(true);
    try {
      const data = await forgotUsername(forgotUserEmpId.trim(), forgotUserDob);
      setRetrievedUsername({
        username: data.username,
        employeeName: data.employeeName,
        employeeId: data.employeeId,
      });
      showToast("Username retrieved successfully.", "Account Found", "success");
    } catch (err) {
      const msg = err?.message || "Could not retrieve username.";
      setError(msg);
      showToast(msg, "Search Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUsername = () => {
    if (!retrievedUsername?.username) return;
    navigator.clipboard.writeText(retrievedUsername.username);
    setCopiedUsername(true);
    setTimeout(() => setCopiedUsername(false), 2000);
  };

  const handleUseUsernameForLogin = () => {
    if (!retrievedUsername?.username) return;
    const uName = retrievedUsername.username;
    resetForgotUsernameState();
    setError("");
    setUsername(uName);
    setMode("login");
  };

  useEffect(() => {
    if (initialMode === "register") {
      setMode("register");
      fetchClasses();
    }
  }, [fetchClasses, initialMode]);

  // Handle countdown for OTP resend
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Focus the first OTP box when entering the verify step
  useEffect(() => {
    if (mode === "forgot" && forgotStep === "verify") {
      const t = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [mode, forgotStep]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const data = await login(username.trim(), password);
      if (data?.user?.role?.toLowerCase() !== "employee") {
        setError("This account is not an employee.");
        showToast("This account is not an employee.", "Access Denied");
        return;
      }
      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("lmsq_terms_accepted", "1");
      navigate("/Quarters/ApplyEmployees", { replace: true });
    } catch (e2) {
      const msg = e2?.message || "Login failed.";
      setError(msg);
      showToast(msg, "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    if (!forgotIdentifier.trim()) {
      const msg = "Enter your Employee ID or registered email.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordResetOtp(forgotIdentifier.trim());
      setForgotStep("verify");
      setOtpValues(["", "", "", "", "", ""]);
      setForgotOtp("");
      setResendCountdown(30);
      const successMsg = "OTP sent successfully to your registered email.";
      setForgotMessage(successMsg);
      showToast(successMsg, "OTP Sent", "success");
    } catch (e2) {
      const msg = e2?.message || "Could not send OTP.";
      setError(msg);
      showToast(msg, "Request Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isLoading) return;
    setError("");
    setForgotMessage("");
    setIsLoading(true);
    try {
      await requestPasswordResetOtp(forgotIdentifier.trim());
      setOtpValues(["", "", "", "", "", ""]);
      setForgotOtp("");
      setResendCountdown(30);
      const successMsg = "A new 6-digit OTP has been sent to your registered email.";
      setForgotMessage(successMsg);
      showToast(successMsg, "OTP Resent", "success");
      otpInputRefs.current[0]?.focus();
    } catch (e2) {
      const msg = e2?.message || "Failed to resend OTP.";
      setError(msg);
      showToast(msg, "Resend Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpBoxChange = (index, value) => {
    setError("");
    const numericVal = value.replace(/\D/g, "");

    if (!numericVal) {
      const updated = [...otpValues];
      updated[index] = "";
      setOtpValues(updated);
      setForgotOtp(updated.join(""));
      return;
    }

    const updated = [...otpValues];
    if (numericVal.length === 1) {
      updated[index] = numericVal;
      setOtpValues(updated);
      setForgotOtp(updated.join(""));
      if (index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    } else {
      // Pasted or entered multiple digits
      const chars = numericVal.slice(0, 6).split("");
      chars.forEach((c, i) => {
        if (index + i < 6) {
          updated[index + i] = c;
        }
      });
      setOtpValues(updated);
      setForgotOtp(updated.join(""));
      const nextIdx = Math.min(index + chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const updated = [...otpValues];
        updated[index - 1] = "";
        setOtpValues(updated);
        setForgotOtp(updated.join(""));
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otpValues];
        updated[index] = "";
        setOtpValues(updated);
        setForgotOtp(updated.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpValues(updated);
    setForgotOtp(updated.join(""));
    const targetIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[targetIdx]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    const currentOtp = otpValues.join("").trim();
    if (currentOtp.length < 6) {
      const msg = "Please enter the complete 6-digit OTP.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifyPasswordResetOtp(forgotIdentifier.trim(), currentOtp);
      setForgotResetToken(data?.resetToken || "");
      setForgotAccountInfo({
        username: data?.username || "",
        employeeName: data?.employeeName || "",
        employeeId: data?.employeeId || "",
      });
      setForgotStep("reset");
      const successMsg = "OTP verified! Create your new password below.";
      setForgotMessage(successMsg);
      showToast(successMsg, "Verified", "success");
    } catch (e2) {
      const msg = e2?.message || "Invalid OTP. Please check and try again.";
      setError(msg);
      showToast(msg, "Verification Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError("");
    setForgotMessage("");

    if (!forgotNewPassword) {
      const msg = "Enter a new password.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }
    if (forgotNewPassword.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }

    setIsLoading(true);
    try {
      await resetEmployeePassword(forgotResetToken, forgotNewPassword);
      const successMsg = "Password changed successfully! Returning to login...";
      setForgotMessage(successMsg);
      showToast(successMsg, "Password Updated", "success");
      window.setTimeout(() => {
        const savedId = forgotAccountInfo?.username || forgotIdentifier;
        resetForgotState();
        setMode("login");
        if (savedId) setUsername(savedId);
      }, 1400);
    } catch (e2) {
      const msg = e2?.message || "Could not reset password.";
      setError(msg);
      showToast(msg, "Reset Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError("");

    if (!reg.email.trim()) {
      const msg = "Email is required.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }
    if (!reg.password) {
      const msg = "Password is required.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }
    if (reg.password !== reg.confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      showToast(msg, "Validation Error");
      return;
    }

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

      showToast("Registered successfully! Redirecting to login...", "Success", "success");
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
      const msg = e2?.message || "Registration failed.";
      setError(msg);
      showToast(msg, "Registration Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async () => {
    setError("");
    if (!reg.employeeId.trim() || !reg.dateOfBirth) {
      const msg = "Enter Employee ID and Date of Birth to fetch details.";
      setError(msg);
      showToast(msg, "Lookup Required");
      return;
    }

    // Clear previous fetched data & passwords immediately before fetching new details
    setReg((r) => ({
      ...r,
      employeeName: "",
      dateOfJoining: "",
      className: "",
      classChoice: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    }));
    setIsRegEmailReadOnly(true);

    setIsLoading(true);
    try {
      const data = await lookupEmployee(reg.employeeId.trim(), reg.dateOfBirth);
      const rawEmail = data?.email;
      const fetchedEmail =
        rawEmail && typeof rawEmail === "string" && rawEmail.trim() !== "null"
          ? rawEmail.trim()
          : "";

      setReg((r) => ({
        ...r,
        employeeName: data?.employeeName || "",
        dateOfJoining: data?.dateOfJoining || "",
        className: data?.className || "",
        classChoice: data?.classChoice || data?.className || "",
        mobile: data?.mobile || "",
        email: fetchedEmail,
      }));
      setIsRegEmailReadOnly(Boolean(fetchedEmail));
      showToast("Employee details fetched successfully.", "Employee Found", "success");
    } catch (e2) {
      // Ensure all fields remain cleared on lookup failure
      setReg((r) => ({
        ...r,
        employeeName: "",
        dateOfJoining: "",
        className: "",
        classChoice: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      }));
      setIsRegEmailReadOnly(true);
      const msg = e2?.message || "Employee lookup failed.";
      setError(msg);
      showToast(msg, "Lookup Failed");
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

          <div className="flex min-h-0 flex-1 items-center px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:pt-2 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,560px)] lg:gap-10 lg:px-10 xl:gap-14 xl:px-16">
            <div className="hidden items-center justify-center lg:flex lg:self-stretch">
              <img
                src={Image}
                alt="Paradip Port Authority building"
                className="h-auto max-h-[calc(100vh-170px)] w-full max-w-[min(58vw,880px)] lg:max-w-[520px] object-contain"
              />
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <form
                className="flex max-h-full w-full max-w-[min(100%,560px)] flex-col gap-[clamp(12px,1.7vh,18px)] overflow-y-auto rounded-[20px] border border-slate-200 bg-white px-4 py-5 shadow-[0_4px_24px_rgba(30,58,138,0.08)] sm:rounded-[24px] sm:px-5 sm:py-6 md:px-6 lg:px-7 lg:ml-auto"
                onSubmit={handleRegister}
              >
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-2 shadow-sm">
                      <img src={Logo} alt="Paradip Port Authority logo" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-800">
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

                  <p className="m-0 text-[11px] leading-5 text-slate-700 sm:text-[13px]">
                    Fill in your employee details to create access for the quarters application portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Employee ID</label>
                    <input
                      type="text"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.employeeId}
                      onChange={(e) => setReg((r) => ({ ...r, employeeId: e.target.value }))}
                      placeholder="Employee ID"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">
                      Date of Birth
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.dateOfBirth}
                        onChange={(e) => setReg((r) => ({ ...r, dateOfBirth: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-[11px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Fetch
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">
                    Name of the Employee
                  </label>
                  <input
                    type="text"
                    className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                    value={reg.employeeName}
                    onChange={(e) => setReg((r) => ({ ...r, employeeName: e.target.value }))}
                    placeholder="Employee name"
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.dateOfJoining}
                      onChange={(e) => setReg((r) => ({ ...r, dateOfJoining: e.target.value }))}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Class Name</label>
                    <input
                      type="text"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.className}
                      onChange={(e) => setReg((r) => ({ ...r, className: e.target.value }))}
                      placeholder="Class name"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Choose a class</label>
                  <select
                    className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200"
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
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Mobile number</label>
                    <input
                      type="tel"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.mobile}
                      onChange={(e) => setReg((r) => ({ ...r, mobile: e.target.value }))}
                      placeholder="Mobile"
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Email (Username)</label>
                    <input
                      type="email"
                      autoComplete="email"
                      className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                      value={reg.email}
                      onChange={(e) => setReg((r) => ({ ...r, email: e.target.value }))}
                      placeholder="name@domain.com"
                      readOnly={isRegEmailReadOnly}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">Password</label>
                    <div className="relative">
                      <input
                        type={showRegPass ? "text" : "password"}
                        autoComplete="new-password"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.password}
                        onChange={(e) => setReg((r) => ({ ...r, password: e.target.value }))}
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass((p) => !p)}
                        className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-700 transition-colors hover:text-slate-600"
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
                    <label className="text-[11px] font-bold uppercase tracking-[2px] text-slate-900">
                      Re-enter password
                    </label>
                    <div className="relative">
                      <input
                        type={showRegConfirmPass ? "text" : "password"}
                        autoComplete="new-password"
                        className="ql-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pr-10 text-[clamp(12px,1vw,13px)] lg:text-[13px] text-blue-950 transition-all duration-200 placeholder:text-slate-300"
                        value={reg.confirmPassword}
                        onChange={(e) => setReg((r) => ({ ...r, confirmPassword: e.target.value }))}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPass((p) => !p)}
                        className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-700 transition-colors hover:text-slate-600"
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
              <div className="mt-1 text-[13px] text-slate-900">Redirecting back to Employee Login…</div>
            </div>
          </div>
        ) : null}
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
            transform: translate3d(50px, 0, 0);
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
          animation: loginCardEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
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
        @media (max-width: 640px) {
          .employee-login-title {
            font-size: 16px !important;
          }
          .employee-login-card {
            padding: 14px !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .employee-login-title {
            font-size: 22px;
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
            align-items: center;
            min-height: auto;
          }
          .employee-login-card {
            gap: 12px;
            padding-block: 20px;
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

        <div className="employee-login-stage flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 xl:grid xl:grid-cols-[minmax(0,1.45fr)_minmax(400px,500px)] xl:gap-10 xl:px-12 xl:py-8 2xl:grid-cols-[minmax(0,1.65fr)_minmax(420px,520px)]">
          <div className="hidden items-center justify-center xl:flex xl:self-stretch">
            <img
              src={Image}
              alt="Paradip Port Authority building"
              className="h-auto max-h-[calc(100vh-190px)] w-full max-w-[min(56vw,720px)] object-contain"
            />
          </div>

          <div className="employee-login-shell flex items-center justify-center w-full">
            {/* Main Interactive Card Container */}
            <div className="employee-login-card relative mt-3 sm:mt-5 xl:mt-6 flex w-full max-w-[min(100%,480px)] flex-col gap-[clamp(10px,1.5vh,16px)] rounded-[22px] border border-blue-950/70 bg-white px-5 py-6 shadow-[0_6px_28px_rgba(30,58,138,0.32)] sm:px-6">

              {/* MODE 1: LOGIN */}
              {mode === "login" && (
                <>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 shadow-sm">
                          <User className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <h1
                            className="employee-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            Employee Login
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

                    <p className="employee-login-copy m-0 text-[11px] text-slate-700 sm:text-[13px]">
                      Sign in to access the quarters application portal with your employee credentials.
                    </p>
                  </div>

                  <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-1.5">
                      <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                        Username
                      </label>
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
                          placeholder="Email or Employee ID"
                        />
                        <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          autoComplete="current-password"
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
                      className="employee-login-action mt-1 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Employee"}
                    </button>
                    <div className="flex flex-col sm:flex-row items-center justify-between text-[11.5px] sm:text-[12px] text-slate-700 py-1 gap-1">
                      <div>
                        <span>Forgot Username? </span>
                        <button
                          type="button"
                          className="font-bold text-blue-950 underline transition-colors hover:text-blue-700 cursor-pointer bg-transparent border-0 p-0"
                          onClick={() => {
                            setError("");
                            resetForgotUsernameState();
                            setMode("forgot-username");
                          }}
                        >
                          Find here
                        </button>
                      </div>
                      <div>
                        <span>Forgot Password? </span>
                        <button
                          type="button"
                          className="font-bold text-blue-950 underline transition-colors hover:text-blue-700 cursor-pointer bg-transparent border-0 p-0"
                          onClick={() => {
                            setError("");
                            resetForgotState();
                            if (username.trim()) {
                              setForgotIdentifier(username.trim());
                            }
                            setMode("forgot");
                          }}
                        >
                          Reset here
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950  transition-all duration-200 hover:bg-indigo-950 hover:text-white xl:text-[14px] hover:shadow-[0_4px_18px_rgba(30,58,138,0.28)] cursor-pointer"
                      onClick={() => {
                        setError("");
                        navigate("/EmployeeRegister");
                      }}
                    >
                      Create Account
                    </button>


                  </form>
                </>
              )}

              {/* MODE 2: FORGOT USERNAME FLOW */}
              {mode === "forgot-username" && (
                <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleForgotUsername}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 shadow-sm">
                          <UserCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <h1
                            className="employee-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            Forgot Username
                          </h1>
                          <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800 whitespace-nowrap">
                            Account Recovery
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

                    <p className="employee-login-copy m-0 text-[11px] text-slate-700 sm:text-[13px]">
                      Enter your Employee ID and Date of Birth to find your registered login username.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                        Employee ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          autoComplete="off"
                          name="forgot_user_empid"
                          id="forgot_user_empid"
                          autoFocus
                          className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pl-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                          value={forgotUserEmpId}
                          onChange={(e) => setForgotUserEmpId(e.target.value)}
                          placeholder="Enter your Employee ID"
                        />
                        <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="forgot_user_dob"
                        id="forgot_user_dob"
                        className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                        value={forgotUserDob}
                        onChange={(e) => setForgotUserDob(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {retrievedUsername && (
                    <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-4 shadow-sm space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Account Found</span>
                      </div>
                      
                      <div className="rounded-xl border border-emerald-200 bg-white p-3 shadow-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Your Registered Login Username:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[13.5px] sm:text-[14.5px] font-extrabold text-blue-950 select-all break-all">
                            {retrievedUsername.username}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUsername}
                            className="shrink-0 flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-950 hover:text-white transition-colors cursor-pointer"
                            title="Copy username"
                          >
                            {copiedUsername ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        {retrievedUsername.employeeName && (
                          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[11.5px] text-slate-600 flex items-center justify-between">
                            <span>Name: <strong className="text-slate-900">{retrievedUsername.employeeName}</strong></span>
                            {retrievedUsername.employeeId && (
                              <span className="text-slate-500">ID: {retrievedUsername.employeeId}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleUseUsernameForLogin}
                        className="w-full rounded-xl bg-blue-950 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-900 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Proceed to Login with this Username</span>
                      </button>
                    </div>
                  )}

                  {!retrievedUsername && (
                    <button
                      type="submit"
                      className="employee-login-action mt-2 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4" />
                          <span>Find My Username</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                    onClick={() => {
                      setError("");
                      resetForgotUsernameState();
                      setMode("login");
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Login</span>
                  </button>
                </form>
              )}

              {/* MODE 3: FORGOT PASSWORD FLOW (Rendered within the same card div!) */}
              {mode === "forgot" && (
                <>
                  {/* STEP 1: Enter email id or employee id */}
                  {forgotStep === "request" && (
                    <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleRequestOtp}>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 shadow-sm">
                              <Mail className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div className="min-w-0">
                              <h1
                                className="employee-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                                style={{ fontFamily: "Georgia, serif" }}
                              >
                                Forgot Password
                              </h1>
                              <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800 whitespace-nowrap">
                                Account Recovery
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

                        <p className="employee-login-copy m-0 text-[11px] text-slate-700 sm:text-[13px]">
                          Enter your registered Email ID or Employee ID to receive a verification OTP.
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-1">
                        <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                          Enter email id or employee id
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            autoComplete="off"
                            name="forgot_identifier"
                            id="forgot_identifier"
                            autoFocus
                            className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pl-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                            value={forgotIdentifier}
                            onChange={(e) => setForgotIdentifier(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRequestOtp(e)}
                            placeholder="Enter email id or employee id"
                          />
                          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {forgotMessage && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{forgotMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="employee-login-action mt-2 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send OTP</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => {
                          setError("");
                          resetForgotState();
                          setMode("login");
                        }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Enter OTP (Replaces previous div with 6 square boxes and security icon) */}
                  {forgotStep === "verify" && (
                    <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleVerifyOtp}>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 shadow-sm">
                              <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div className="min-w-0">
                              <h1
                                className="employee-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                                style={{ fontFamily: "Georgia, serif" }}
                              >
                                Enter OTP
                              </h1>
                              <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-amber-600 whitespace-nowrap">
                                Identity Verification
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

                        <p className="employee-login-copy m-0 text-[11px] text-slate-700 sm:text-[13px]">
                          Enter the 6-digit verification code sent to{" "}
                          <span className="font-semibold text-blue-950 break-all">{forgotIdentifier}</span>
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center justify-between">
                          <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                            Enter 6-Digit OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setForgotMessage("");
                              setForgotStep("request");
                            }}
                            className="text-[11px] font-semibold text-blue-900 hover:underline cursor-pointer"
                          >
                            Change ID/Email
                          </button>
                        </div>

                        {/* 6 Square Input Boxes */}
                        <div className="flex items-center justify-between gap-1.5 sm:gap-2 py-1">
                          {otpValues.map((val, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (otpInputRefs.current[idx] = el)}
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={1}
                              value={val}
                              onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              onPaste={handleOtpPaste}
                              className={`h-12 w-11 sm:h-14 sm:w-12 rounded-xl border-2 text-center text-[20px] sm:text-[22px] font-extrabold text-blue-950 transition-all duration-200 outline-none ${val ? "border-blue-900 bg-white shadow-xs" : "border-slate-200 bg-blue-50/70"
                                } focus:border-blue-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.15)]`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-900 pt-0.5">
                          <span>Didn&apos;t receive code?</span>
                          {resendCountdown > 0 ? (
                            <span className="text-slate-700 font-medium">Resend in {resendCountdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isLoading}
                              className="font-bold text-blue-900 hover:underline cursor-pointer disabled:opacity-50"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {forgotMessage && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{forgotMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="employee-login-action mt-2 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Verifying OTP...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4" />
                            <span>Verify OTP</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => {
                          setError("");
                          resetForgotState();
                          setMode("login");
                        }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                      </button>
                    </form>
                  )}

                  {/* STEP 3: Create New Password */}
                  {forgotStep === "reset" && (
                    <form className="employee-login-form flex flex-1 flex-col" onSubmit={handleResetPassword}>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-sm">
                              <KeyRound className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div className="min-w-0">
                              <h1
                                className="employee-login-title m-0 text-[16px] sm:text-[22px] lg:text-[24px] font-bold text-slate-900 whitespace-nowrap leading-tight"
                                style={{ fontFamily: "Georgia, serif" }}
                              >
                                Reset Password
                              </h1>
                              <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 whitespace-nowrap">
                                Secure New Password
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

                        <p className="employee-login-copy m-0 text-[11px] text-slate-700 sm:text-[13px]">
                          Create a new password of at least 6 characters for your employee account.
                        </p>
                      </div>

                      {/* Display retrieved account info so user sees their username */}
                      {forgotAccountInfo?.username && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-2.5 flex items-center justify-between text-blue-950">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              Your Account Username:
                            </span>
                            <span className="font-mono font-extrabold text-[13px] text-blue-950">
                              {forgotAccountInfo.username}
                            </span>
                            {forgotAccountInfo.employeeName && (
                              <span className="text-slate-600 block text-[11px]">
                                ({forgotAccountInfo.employeeName})
                              </span>
                            )}
                          </div>
                          <User className="h-5 w-5 text-blue-800 shrink-0" />
                        </div>
                      )}

                      <div className="flex flex-col gap-3 mt-1">
                        <div className="flex flex-col gap-1.5">
                          <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showForgotNewPass ? "text" : "password"}
                              autoComplete="new-password"
                              className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pl-10 pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                              value={forgotNewPassword}
                              onChange={(e) => setForgotNewPassword(e.target.value)}
                              placeholder="New password (min 6 chars)"
                            />
                            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                            <button
                              type="button"
                              onClick={() => setShowForgotNewPass((p) => !p)}
                              className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-700 transition-colors hover:text-slate-600 cursor-pointer"
                              aria-label={showForgotNewPass ? "Hide password" : "Show password"}
                            >
                              {showForgotNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="employee-login-label text-[11px] font-bold uppercase tracking-[2px] text-slate-700">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showForgotConfirmPass ? "text" : "password"}
                              autoComplete="new-password"
                              className="employee-login-field employee-input w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3.5 py-[clamp(10px,1.3vh,14px)] pl-10 pr-10 text-[clamp(12px,1vw,13px)] text-blue-950 transition-all duration-200 placeholder:text-slate-300 xl:text-[13px]"
                              value={forgotConfirmPassword}
                              onChange={(e) => setForgotConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                            />
                            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                            <button
                              type="button"
                              onClick={() => setShowForgotConfirmPass((p) => !p)}
                              className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center bg-transparent p-0.5 text-slate-700 transition-colors hover:text-slate-600 cursor-pointer"
                              aria-label={showForgotConfirmPass ? "Hide password" : "Show password"}
                            >
                              {showForgotConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {forgotMessage && (
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>{forgotMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="employee-login-action mt-2 w-full rounded-2xl border-0 bg-blue-950 py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Updating password...</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="h-4 w-4" />
                            <span>Change Password</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="employee-login-action w-full rounded-2xl border border-slate-200 bg-white py-[clamp(10px,1.5vh,14px)] text-[clamp(12px,1vw,14px)] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 xl:text-[14px] cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => {
                          setError("");
                          resetForgotState();
                          setMode("login");
                        }}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Login</span>
                      </button>
                    </form>
                  )}
                </>
              )}

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
