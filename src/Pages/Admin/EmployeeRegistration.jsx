import { useState } from "react";
import {
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";

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

const CATEGORY_OPTIONS = [
  { value: "Type-A", label: "Type-A" },
  { value: "Type-B", label: "Type-B" },
  { value: "Type-C", label: "Type-C" },
  { value: "Type-D", label: "Type-D" },
  { value: "Type-E", label: "Type-E" },
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
  category: "Type-B",
  department: "Administration & HR",
  mobile: "",
  email: "",
  areaType: "",
  quarterNo: "",
  debarredFromDate: "",
  debarredToDate: "",
};

export default function EmployeeRegistration() {
  // Registration form states
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Form field changes helper
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Register single employee handler
  const handleSingleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { employeeId, employeeName, dateOfBirth, dateOfJoining } = formData;

    // Basic Validation
    if (!employeeId.trim()) return setFormError("Employee ID is required.");
    if (!employeeName.trim()) return setFormError("Employee Name is required.");
    if (!dateOfBirth) return setFormError("Date of Birth is required.");
    if (!dateOfJoining) return setFormError("Date of Joining is required.");

    setFormSuccess(`Employee "${employeeName}" (ID: ${employeeId}) details saved locally.`);
    setFormData(EMPTY_FORM);
  };

  return (
    <AdminLayout
      title="Employee Registration"
      subtitle="Register a new employee with their official details in the system."
    >
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900 font-semibold">New Employee Registration Form</h2>
        </div>

        {formError && (
          <div className="mb-6 flex gap-2 items-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="mb-6 flex gap-2 items-center rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 font-semibold font-bold">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSingleSubmit} className="space-y-6">

          {/* SECTION: Personal Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              1. Personal Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange("employeeName", e.target.value)}
                  placeholder="Enter Full Name"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>
          </div>

          {/* SECTION: Employment details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              2. Official & Employment Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  placeholder="e.g. PPA-1050"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Grade Date
                </label>
                <input
                  type="date"
                  value={formData.gradDate}
                  onChange={(e) => handleInputChange("gradDate", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Class of Employee
                </label>
                <select
                  value={formData.classOfEmployee}
                  onChange={(e) => handleInputChange("classOfEmployee", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                >
                  {CLASS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Caste of Employee
                </label>
                <select
                  value={formData.casteOfEmployee}
                  onChange={(e) => handleInputChange("casteOfEmployee", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                >
                  {CASTE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION: Quarters & Debarment info */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              3. Quarters Allocation & Debarment Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Current Quarter Area Type
                </label>
                <input
                  type="text"
                  value={formData.areaType}
                  onChange={(e) => handleInputChange("areaType", e.target.value)}
                  placeholder="e.g. Type-B"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Current Quarter Number
                </label>
                <input
                  type="text"
                  value={formData.quarterNo}
                  onChange={(e) => handleInputChange("quarterNo", e.target.value)}
                  placeholder="e.g. B-12"
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Debarred From Date
                </label>
                <input
                  type="date"
                  value={formData.debarredFromDate}
                  onChange={(e) => handleInputChange("debarredFromDate", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Debarred To Date
                </label>
                <input
                  type="date"
                  value={formData.debarredToDate}
                  onChange={(e) => handleInputChange("debarredToDate", e.target.value)}
                  className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-[13px] text-slate-900 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setFormData(EMPTY_FORM)}
              className="min-h-[40px] rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
            >
              Clear Fields
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-2xl bg-orange-500 hover:bg-orange-600 px-6 text-[13px] font-bold text-white transition shadow-[0_2px_8px_rgba(249,115,22,0.25)] flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={16} />
              Register Employee
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
