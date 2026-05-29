import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";
import Image from "../assets/Image13.png";
import Logo from "../assets/Logo.png";
import { getEmployeeClasses, lookupEmployee, registerEmployee } from "../api";

const emptyRegistration = {
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
};

function normalizeClassOptions(classOptions) {
  const items = Array.isArray(classOptions) ? classOptions : [];

  const options = items
    .map((item) => ({
      priority: item?.Class_PRIORITY,
      className: item?.class_name,
      classValue: item?.Class,
    }))
    .filter((item) => {
      const className = typeof item.className === "string" ? item.className.trim() : "";
      const classValue = typeof item.classValue === "string" ? item.classValue.trim() : "";
      if (!className && !classValue) return false;
      if (className && className.toLowerCase() === "none") return false;
      if (classValue && classValue.toLowerCase() === "none") return false;
      return true;
    })
    .map((item) => {
      const className = typeof item.className === "string" ? item.className.trim() : "";
      const classValue = typeof item.classValue === "string" ? item.classValue.trim() : "";
      const priority = Number(item.priority);
      const value = classValue || className;

      if (className.toUpperCase() === "CLASS-I" || classValue.toUpperCase().includes("CLASS-I")) {
        if (priority === 1) return { value, label: `${value} (Senior)` };
        if (priority === 2) return { value, label: `${value} (Junior)` };
      }

      return { value, label: value };
    });

  return options.length
    ? options
    : [
        { value: "Class I", label: "Class I" },
        { value: "Class II", label: "Class II" },
        { value: "Class III", label: "Class III" },
        { value: "Class IV", label: "Class IV" },
      ];
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "min-h-[40px] w-full rounded-xl border-2 border-slate-200 bg-blue-50 px-3 text-[13px] text-blue-950 outline-none transition-all duration-200 placeholder:text-slate-300 focus:border-blue-900 focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)] disabled:cursor-not-allowed";

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const [reg, setReg] = useState(emptyRegistration);
  const [classOptions, setClassOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const normalizedClassOptions = useMemo(() => normalizeClassOptions(classOptions), [classOptions]);

  useEffect(() => {
    let isActive = true;

    getEmployeeClasses()
      .then((data) => {
        if (isActive) setClassOptions(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        if (isActive) setClassOptions([]);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const updateReg = (key, value) => {
    setReg((current) => ({ ...current, [key]: value }));
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
      setReg((current) => ({
        ...current,
        employeeName: data?.employeeName || current.employeeName,
        dateOfJoining: data?.dateOfJoining || current.dateOfJoining,
        className: data?.className || current.className,
        classChoice: data?.classChoice || current.classChoice,
      }));
    } catch (lookupError) {
      setError(lookupError?.message || "Employee lookup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
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
      window.setTimeout(() => {
        setSuccessOpen(false);
        setReg(emptyRegistration);
        navigate("/QuartersApplyLogin", { replace: true });
      }, 1200);
    } catch (registerError) {
      setError(registerError?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <TopNavbar navTextColor="light" />

      <div className="flex min-h-0 flex-1 items-stretch px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1440px] min-h-0 items-stretch gap-6 lg:grid-cols-[1fr_2fr]">

          {/* Left — illustration */} 
          <section className="hidden min-h-0 lg:flex lg:items-center lg:justify-center">
            <img
              src={Image}
              alt="Paradip Port Authority building"
              className="h-auto max-h-full w-full object-contain"
            />
          </section>

          {/* Right — form panel */}
          <section className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-blue-950/30 bg-white shadow-[0_4px_24px_rgba(30,58,138,0.28)]">

            {/* Panel header */}
            <div className="shrink-0 border-b border-slate-200 px-5 py-3 lg:px-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 p-2 shadow-sm">
                    <img src={Logo} alt="Paradip Port Authority logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="m-0 text-[10px] font-bold uppercase tracking-[0.24em] text-orange-500">
                      Paradip Port Authority
                    </p>
                    <h1
                      className="m-0 mt-0.5 text-[20px] font-bold leading-tight text-slate-900 lg:text-[24px]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      Employee Registration
                    </h1>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/QuartersApplyLogin")}
                  className="shrink-0 min-h-[36px] rounded-2xl border border-slate-200 bg-white px-4 text-[12px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50"
                >
                  Back to Login
                </button>
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                Fill in your official employee details to create access for the quarters application portal.
              </p>
            </div>

            {/* Form body — header & buttons fixed, only fields scroll */}
            <form onSubmit={handleRegister} className="flex min-h-0 flex-1 flex-col">

              {/* Scrollable fields area */}
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 lg:px-8">

              {/* Fetch section */}
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                <div className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-[1fr_80px] gap-2">
                      <input
                        type="date"
                        className={inputClass}
                        value={reg.dateOfBirth}
                        onChange={(event) => updateReg("dateOfBirth", event.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleLookup}
                        disabled={isLoading}
                        className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-2 text-[12px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Fetch
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {/* Main fields — 2-col grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <Field label="Name of the Employee" className="col-span-2">
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

                <Field label="Choose a Class" className="col-span-2">
                  <select
                    className={`${inputClass} appearance-auto`}
                    value={reg.classChoice}
                    onChange={(event) => updateReg("classChoice", event.target.value)}
                  >
                    <option value="">Choose a class</option>
                    {normalizedClassOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Mobile Number">
                  <input
                    type="tel"
                    className={inputClass}
                    value={reg.mobile}
                    onChange={(event) => updateReg("mobile", event.target.value)}
                    placeholder="Mobile"
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

              {error ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[12px] text-red-700">
                  {error}
                </div>
              ) : null}

              </div>{/* end scrollable area */}

              {/* Fixed action bar at bottom */}
              <div className="shrink-0 border-t border-slate-100 px-6 py-4 lg:px-8 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/QuartersApplyLogin")}
                  className="min-h-[40px] rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-blue-950 transition-all duration-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-h-[40px] rounded-2xl border-0 bg-blue-950 px-7 text-[13px] font-bold text-white shadow-[0_4px_18px_rgba(30,58,138,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Registering..." : "Submit Registration"}
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>

      <Footer sticky={false} />

      {successOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="text-[15px] font-bold text-slate-900">Successfully registered</div>
            <div className="mt-1 text-[13px] text-slate-500">Redirecting back to Employee Login...</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}