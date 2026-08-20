import { useState } from "react";
import {
  UserPlus,
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import Popup from "../../Components/Popup";
import { lookupQuarterEmployee, registerEmployeeAdmin } from "../../api";

// Standard employee classes (matching backend DB values)
const CLASS_OPTIONS = [
  { value: "SR-CLASS-I", label: "Class I (Senior)" },
  { value: "JR-CLASS-I", label: "Class I (Junior)" },
  { value: "CLASS-II", label: "Class II" },
  { value: "CLASS-III", label: "Class III" },
  { value: "CLASS-IV", label: "Class IV" },
];

const CASTE_OPTIONS = [
  { value: "GENERAL", label: "GENERAL" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
];

const DEPARTMENTS = [
  "Marine",
  "Finance",
  "Traffic",
  "Civil Engineering",
  "Mechanical Engineering",
  "Medical & Health Services",
  "Administration & HR",
  "Electrical",
  "Materials Management",
  "Estate",
  "Security",
  "Others",
];

const EMPTY_FORM = {
  employeeId: "",
  employeeName: "",
  dateOfBirth: "",
  dateOfJoining: "",
  gradDate: "",
  classOfEmployee: "CLASS-III",
  casteOfEmployee: "GENERAL",
  department: "Administration & HR",
  mobile: "",
  email: "",
};

const normalizeClass = (cls) => {
  if (!cls) return "CLASS-III";
  const c = cls.toUpperCase().trim();
  if (c.includes("SR-CLASS-I") || c === "CLASS I (SENIOR)" || c === "SR. CLASS I" || c === "SENIOR CLASS I") return "SR-CLASS-I";
  if (c.includes("JR-CLASS-I") || c === "CLASS I (JUNIOR)" || c === "JR. CLASS I" || c === "JUNIOR CLASS I") return "JR-CLASS-I";
  if (c === "CLASS-II" || c === "CLASS II") return "CLASS-II";
  if (c === "CLASS-III" || c === "CLASS III") return "CLASS-III";
  if (c === "CLASS-IV" || c === "CLASS IV") return "CLASS-IV";
  return "CLASS-III";
};

const normalizeCaste = (caste) => {
  if (!caste) return "GENERAL";
  const c = caste.toUpperCase().trim();
  if (c === "SC") return "SC";
  if (c === "ST") return "ST";
  return "GENERAL";
};

const normalizeDepartment = (dept) => {
  if (!dept) return "Administration & HR";
  const d = dept.trim().toLowerCase();
  const matched = DEPARTMENTS.find(item => item.toLowerCase() === d);
  return matched || "Administration & HR";
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || "").trim());
};

export default function EmployeeRegistration() {
  // Registration form states
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);

  const showToast = (message, title = "Error", variant = "error") => {
    setPopup({ open: true, title, message, variant });
  };

  // Form field changes helper
  const handleInputChange = (field, value) => {
    if (field === "employeeId") {
      setIsPopulated(false);
    }
    if (field === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeIdBlur = async () => {
    const empId = formData.employeeId.trim();
    if (!empId) {
      setFormData(EMPTY_FORM);
      setIsPopulated(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await lookupQuarterEmployee(empId);
      if (res.exists) {
        setFormData(prev => ({
          ...prev,
          employeeName: res.name || "",
          dateOfBirth: res.dateOfBirth || "",
          dateOfJoining: res.dateOfJoining || "",
          gradDate: res.gradDate || "",
          classOfEmployee: normalizeClass(res.empClass),
          casteOfEmployee: normalizeCaste(res.caste),
          department: normalizeDepartment(res.department),
          mobile: res.mobile || "",
          email: res.email || "",
        }));
        setIsPopulated(true);
        showToast(`Details populated for employee: ${res.name || empId}`, "Employee Found", "success");
      } else {
        setIsPopulated(false);
        showToast("Employee ID not found in database. Please enter details manually.", "Notice", "info");
        setFormData(prev => ({ ...EMPTY_FORM, employeeId: prev.employeeId }));
      }
    } catch (err) {
      console.error("Error looking up employee:", err);
      setIsPopulated(false);
      showToast("Failed to lookup employee ID. You can still enter details manually.", "Lookup Notice", "info");
      setFormData(prev => ({ ...EMPTY_FORM, employeeId: prev.employeeId }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeIdKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEmployeeIdBlur();
    }
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();

    const {
      employeeId,
      employeeName,
      dateOfBirth,
      mobile,
      email,
      dateOfJoining,
      gradDate,
      classOfEmployee,
      casteOfEmployee,
      department
    } = formData;

    // Validation for all fields
    if (!employeeId.trim()) return showToast("Employee ID is required.", "Validation Error");
    if (!employeeName.trim()) return showToast("Employee Name is required.", "Validation Error");
    if (!dateOfBirth) return showToast("Date of Birth is required.", "Validation Error");
    if (!mobile.trim()) return showToast("Mobile Number is required.", "Validation Error");
    if (!/^\d{10}$/.test(mobile.trim())) {
      return showToast("Mobile Number must be a valid 10-digit number (numbers only).", "Validation Error");
    }
    if (!email.trim()) return showToast("Email Address is required.", "Validation Error");
    if (!isValidEmail(email)) {
      return showToast("Please enter a valid email address (e.g. name@example.com).", "Validation Error");
    }
    if (!dateOfJoining) return showToast("Date of Joining is required.", "Validation Error");
    if (!gradDate) return showToast("Grade Date is required.", "Validation Error");
    if (!classOfEmployee) return showToast("Class of Employee is required.", "Validation Error");
    if (!casteOfEmployee) return showToast("Caste of Employee is required.", "Validation Error");
    if (!department) return showToast("Department is required.", "Validation Error");

    setIsLoading(true);
    try {
      const res = await registerEmployeeAdmin(formData);
      showToast(res.message || `Employee "${employeeName}" registered/updated successfully.`, "Success", "success");
      setFormData(EMPTY_FORM);
      setIsPopulated(false);
    } catch (err) {
      console.error("Error registering employee:", err);
      showToast(err.message || "Failed to register/update employee details in the database.", "Registration Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Employee Registration"
      subtitle="Register a new employee with their official details in the system."
    >
      <Popup
        {...popup}
        onClose={() => setPopup({ ...popup, open: false })}
      />
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          < UserPlus size={18} className="text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900 font-semibold">New Employee Registration Form</h2>
        </div>

        <form onSubmit={handleSingleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-[95%] mx-auto">
            {/* SECTION 1: Personal Details */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">
                1. Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    onBlur={handleEmployeeIdBlur}
                    onKeyDown={handleEmployeeIdKeyDown}
                    disabled={isLoading}
                    placeholder={isLoading ? "Loading..." : "e.g. PPA-1050"}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => handleInputChange("employeeName", e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter Full Name"
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. 9876543210 (10 digits)"
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                  {formData.mobile && formData.mobile.length > 0 && formData.mobile.length < 10 && (
                    <p className="mt-1 text-[11px] text-amber-600">
                      {formData.mobile.length}/10 digits entered
                    </p>
                  )}
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email Address *
                    </label>
                    {formData.email && !isValidEmail(formData.email) && (
                      <span className="text-[11px] font-semibold text-rose-500">
                        Invalid email format
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. name@example.com"
                    className={`w-full min-h-[44px] rounded-xl border px-3.5 text-[13px] text-slate-900 outline-none transition-all disabled:opacity-50 ${formData.email && !isValidEmail(formData.email)
                        ? "border-rose-300 bg-rose-50/20 text-rose-900 shadow-[0_0_0_3px_rgba(244,63,94,0.1)] focus:border-rose-500 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.15)]"
                        : "border-orange-200 bg-white shadow-[0_0_0_3px_rgba(232,119,34,0.08)] hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)]"
                      }`}
                  />
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="mt-1 text-[11px] text-rose-500">
                      Please enter a valid email address (e.g. name@example.com)
                    </p>
                  )}
                </div>
              </div>
            </div>



            {/* SECTION 2: Official & Employment Details */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">
                2. Official & Employment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                </div>


                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Grade Date *
                  </label>
                  <input
                    type="date"
                    value={formData.gradDate}
                    onChange={(e) => handleInputChange("gradDate", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Class of Employee *
                  </label>
                  <select
                    value={formData.classOfEmployee}
                    onChange={(e) => handleInputChange("classOfEmployee", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  >
                    {CLASS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Caste *
                  </label>
                  <select
                    value={formData.casteOfEmployee}
                    onChange={(e) => handleInputChange("casteOfEmployee", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  >
                    {CASTE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[44px] rounded-xl border border-orange-200 bg-white px-3.5 text-[13px] text-slate-900 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] outline-none transition-all hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] focus:border-[#e87722] focus:shadow-[0_0_0_4px_rgba(232,119,34,0.16)] disabled:opacity-50"
                  >
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setFormData(EMPTY_FORM);
                setIsPopulated(false);
              }}
              disabled={isLoading}
              className="min-h-[38px] rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition hover:bg-red-700 hover:text-white cursor-pointer disabled:opacity-50"
            >
              Clear Fields
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[38px] rounded-xl bg-orange-500 hover:bg-orange-600 px-6 text-[13px] font-bold text-white transition shadow-[0_2px_8px_rgba(249,115,22,0.25)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserPlus size={16} />
              {isLoading ? "Saving..." : isPopulated ? "Update Employee" : "Register Employee"}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
