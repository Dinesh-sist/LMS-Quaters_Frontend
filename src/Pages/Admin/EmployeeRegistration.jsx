import { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
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

export default function EmployeeRegistration() {
  // Registration form states
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form field changes helper
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeIdBlur = async () => {
    const empId = formData.employeeId.trim();
    if (!empId) return;

    setIsLoading(true);
    setFormError("");
    setFormSuccess("");
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
        setFormSuccess(`Details populated for employee: ${res.name || empId}`);
      } else {
        setFormError("Employee ID not found in database. Please enter details manually.");
      }
    } catch (err) {
      console.error("Error looking up employee:", err);
      setFormError("Failed to lookup employee ID. You can still enter details manually.");
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

  // Register single employee handler
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

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
    if (!employeeId.trim()) return setFormError("Employee ID is required.");
    if (!employeeName.trim()) return setFormError("Employee Name is required.");
    if (!dateOfBirth) return setFormError("Date of Birth is required.");
    if (!mobile.trim()) return setFormError("Mobile Number is required.");
    if (!email.trim()) return setFormError("Email Address is required.");
    if (!dateOfJoining) return setFormError("Date of Joining is required.");
    if (!gradDate) return setFormError("Grade Date is required.");
    if (!classOfEmployee) return setFormError("Class of Employee is required.");
    if (!casteOfEmployee) return setFormError("Caste of Employee is required.");
    if (!department) return setFormError("Department is required.");


    


    setIsLoading(true);
    try {
      const res = await registerEmployeeAdmin(formData);
      setFormSuccess(res.message || `Employee "${employeeName}" registered/updated successfully.`);
      setFormData(EMPTY_FORM);
    } catch (err) {
      console.error("Error registering employee:", err);
      setFormError(err.message || "Failed to register/update employee details in the database.");
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <AdminLayout
      title="Employee Registration"
      subtitle="Register a new employee with their official details in the system."
    >
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900 font-semibold">New Employee Registration Form</h2>
        </div>

        {formError && (
          <div className="mb-4 flex gap-2 items-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 flex gap-2 items-center rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 font-semibold font-bold">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSingleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* SECTION 1: Personal Details */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">
                1. Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. 9876543210"
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. name@example.com"
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Official & Employment Details */}
            <div className="bg-slate-50/40 border border-slate-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3">
                2. Official & Employment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                  >
                    {CLASS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Caste of Employee *
                  </label>
                  <select
                    value={formData.casteOfEmployee}
                    onChange={(e) => handleInputChange("casteOfEmployee", e.target.value)}
                    disabled={isLoading}
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
                  >
                    {CASTE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                    className="w-full min-h-[38px] rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 disabled:opacity-50"
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
              onClick={() => setFormData(EMPTY_FORM)}
              disabled={isLoading}
              className="min-h-[38px] rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Clear Fields
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[38px] rounded-xl bg-orange-500 hover:bg-orange-600 px-6 text-[13px] font-bold text-white transition shadow-[0_2px_8px_rgba(249,115,22,0.25)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserPlus size={16} />
              {isLoading ? "Saving..." : "Register Employee"}
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
