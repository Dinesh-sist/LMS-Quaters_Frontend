import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Popup from "../Components/Popup";
import Image from "../assets/Image13.png";
import Logo from "../assets/Logo.png";
import { lookupEmployee, registerEmployee } from "../api";

const emptyRegistration = {
  employeeId: "",
  dateOfBirth: "",
  employeeName: "",
  dateOfJoining: "",
  className: "",
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "min-h-[36px] w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3 py-1 text-[12.5px] text-blue-950 outline-none transition-all duration-200 placeholder:text-slate-300 focus:border-blue-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)] disabled:cursor-not-allowed";

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const [reg, setReg] = useState(emptyRegistration);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "info" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailReadOnly, setIsEmailReadOnly] = useState(true);

  const showToast = (message, title = "Error", variant = "error") => {
    setPopup({ open: true, title, message, variant });
  };

  const updateReg = (key, value) => {
    if (key === "employeeId" || key === "dateOfBirth") {
      setReg((current) => ({
        ...current,
        [key]: value,
        employeeName: "",
        dateOfJoining: "",
        className: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      }));
      setIsEmailReadOnly(true);
    } else {
      let finalValue = value;
      if (key === "mobile") {
        finalValue = String(value || "").replace(/\D/g, "").slice(0, 10);
      }
      setReg((current) => ({ ...current, [key]: finalValue }));
    }
  };

  const handleLookup = async () => {
    if (!reg.employeeId.trim() || !reg.dateOfBirth) {
      showToast("Enter Employee ID and Date of Birth to fetch details.", "Lookup Failed");
      return;
    }

    // Clear previous fetched data & passwords immediately before fetching new details
    setReg((current) => ({
      ...current,
      employeeName: "",
      dateOfJoining: "",
      className: "",
      mobile: "",
      email: "",
      password: "",
      confirmPassword: "",
    }));
    setIsEmailReadOnly(true);

    setIsLoading(true);
    try {
      const data = await lookupEmployee(reg.employeeId.trim(), reg.dateOfBirth);
      const rawEmail = data?.email;
      const fetchedEmail =
        rawEmail && typeof rawEmail === "string" && rawEmail.trim() !== "null"
          ? rawEmail.trim()
          : "";

      setReg((current) => ({
        ...current,
        employeeName: data?.employeeName || "",
        dateOfJoining: data?.dateOfJoining || "",
        className: data?.className || "",
        mobile: data?.mobile || "",
        email: fetchedEmail,
      }));

      // If email exists in DB record, lock it; if null/empty, allow the user to type and edit it
      setIsEmailReadOnly(Boolean(fetchedEmail));
      showToast("Employee details fetched successfully.", "Employee Found", "success");
    } catch (lookupError) {
      // Ensure all fields remain cleared on lookup failure
      setReg((current) => ({
        ...current,
        employeeName: "",
        dateOfJoining: "",
        className: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      }));
      setIsEmailReadOnly(true);
      showToast(lookupError?.message || "Employee lookup failed.", "Lookup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!reg.email.trim()) return showToast("Email is required.", "Validation Error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reg.email.trim())) {
      return showToast("Please enter a valid email address.", "Validation Error");
    }
    if (!reg.password) return showToast("Password is required.", "Validation Error");
    if (reg.password !== reg.confirmPassword) return showToast("Passwords do not match.", "Validation Error");

    setIsLoading(true);
    try {
      await registerEmployee({
        employeeId: reg.employeeId.trim(),
        dateOfBirth: reg.dateOfBirth,
        employeeName: reg.employeeName.trim(),
        dateOfJoining: reg.dateOfJoining,
        className: reg.className.trim(),
        classChoice: reg.className.trim(),
        mobile: reg.mobile.trim(),
        email: reg.email.trim(),
        password: reg.password,
      });

      showToast("Registered successfully! Redirecting to login...", "Success", "success");
      window.setTimeout(() => {
        setReg(emptyRegistration);
        navigate("/QuartersApplyLogin", { replace: true });
      }, 1500);
    } catch (registerError) {
      showToast(registerError?.message || "Registration failed.", "Registration Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fcfefd]">
      <TopNavbar navTextColor="light" />

      <div className="flex flex-1 items-center justify-center px-3 py-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto grid w-full max-w-[1360px] items-center justify-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,560px)] lg:gap-10 xl:gap-14">

          {/* Left — illustration */} 
          <section className="hidden min-h-0 lg:flex lg:items-center lg:justify-center">
            <img
              src={Image}
              alt="Paradip Port Authority building"
              className="h-auto max-h-[calc(100vh-170px)] w-full max-w-[520px] object-contain"
            />
          </section>

          {/* Right — form panel */}
          <section className="flex max-h-[calc(100vh-120px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] border border-blue-950/30 bg-white shadow-[0_4px_24px_rgba(30,58,138,0.28)] lg:ml-auto">

            {/* Panel header */}
            <div className="shrink-0 border-b border-slate-200 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 p-1.5 shadow-sm">
                    <img src={Logo} alt="Paradip Port Authority logo" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="m-0 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-orange-500 truncate">
                      Paradip Port Authority
                    </p>
                    <h1
                      className="m-0 mt-0.5 text-[16px] sm:text-[20px] lg:text-[22px] font-bold leading-tight text-slate-900 whitespace-nowrap"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Create Account
                    </h1>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/QuartersApplyLogin")}
                  className="shrink-0 flex items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 sm:px-2.5 py-1.5 text-[11px] font-semibold text-blue-950 shadow-sm transition-all duration-200 hover:bg-blue-950 hover:text-white hover:shadow-md cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Back to </span>Login
                </button>
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                Fill in your official employee details to create access for the quarters application portal.
              </p>
            </div>

            {/* Form body — header & buttons fixed, only fields scroll */}
            <form onSubmit={handleRegister} className="flex min-h-0 flex-1 flex-col">

              {/* Scrollable fields area */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">

              {/* Fetch section */}
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3 sm:px-4 sm:py-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Field label="Employee ID">
                    <input
                      type="text"
                      className={inputClass}
                      value={reg.employeeId}
                      onChange={(event) => updateReg("employeeId", event.target.value)}
                      placeholder="Employee ID"
                    />
                  </Field>
                  <Field label="Date of Birth">
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className={`${inputClass} flex-1 min-w-0`}
                        value={reg.dateOfBirth}
                        onChange={(event) => updateReg("dateOfBirth", event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="h-[36px] shrink-0 rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-bold text-blue-950 shadow-sm transition-all duration-200 hover:bg-blue-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      >
                        {isLoading ? "..." : "Fetch"}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {/* Main fields — responsive grid: 1 col on mobile, 2 cols on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 sm:gap-y-3.5">
                <Field label="Name of the Employee" className="sm:col-span-2">
                  <input
                    type="text"
                    className={inputClass}
                    value={reg.employeeName}
                    onChange={(event) => updateReg("employeeName", event.target.value)}
                    placeholder="Employee name"
                    readOnly
                  />
                </Field>

                <Field label="Date of Joining">
                  <input
                    type="date"
                    className={inputClass}
                    value={reg.dateOfJoining}
                    onChange={(event) => updateReg("dateOfJoining", event.target.value)}
                    readOnly
                  />
                </Field>

                <Field label="Class Name">
                  <input
                    type="text"
                    className={inputClass}
                    value={reg.className}
                    onChange={(event) => updateReg("className", event.target.value)}
                    placeholder="Class name"
                    readOnly
                  />
                </Field>

                <Field label="Mobile Number">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    className={inputClass}
                    value={reg.mobile}
                    onChange={(event) => updateReg("mobile", event.target.value)}
                    placeholder="Mobile (10 digits)"
                    readOnly
                  />
                </Field>

                <Field label="Email (Username)">
                  <input
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    value={reg.email}
                    onChange={(event) => updateReg("email", event.target.value)}
                    placeholder="name@domain.com"
                    readOnly={isEmailReadOnly}
                  />
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputClass} pr-10`}
                      value={reg.password}
                      onChange={(event) => updateReg("password", event.target.value)}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>

                <Field label="Re-enter Password">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${inputClass} pr-10`}
                      value={reg.confirmPassword}
                      onChange={(event) => updateReg("confirmPassword", event.target.value)}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
              </div>

              </div>{/* end scrollable area */}

              {/* Fixed action bar at bottom */}
              <div className="shrink-0 border-t border-slate-100 px-4 py-3 sm:px-6 sm:py-4 lg:px-8 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => navigate("/QuartersApplyLogin")}
                  className="min-h-[40px] rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-[40px] rounded-xl sm:rounded-2xl border-0 bg-blue-950 px-7 text-[13px] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>

      <Footer sticky={false} />

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