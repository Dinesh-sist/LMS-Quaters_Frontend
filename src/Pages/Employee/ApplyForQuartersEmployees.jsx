import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  FileText,
  Hash,
  Home,
  Upload,
  User,
} from "lucide-react";
import TopHeader from "../../Components/TopHeader";
import Footer from "../../Components/Footer";
import Sidebar from "./EmployeeUI/EmployeeSideNav";
import AgGridTable from "../../Components/Table";
import Popup from "../../Components/Popup";
import { request, saveQuarterApplication } from "../../api";
import { getUser } from "../../auth";

// ─── Helpers ────────────────────────────────────────────────────────────────

const inputCls = (focused, id, hasError = false, disabled = false) =>
  `w-full box-border rounded-[7px] px-3 py-[9px] text-[13.5px] outline-none transition-all duration-200 font-[inherit]
  ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-800"}
  ${hasError
    ? "border-[1.5px] border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
    : focused === id
      ? "border-[1.5px] border-orange-400 shadow-[0_0_0_3px_rgba(232,119,34,0.12)]"
      : "border-[1.5px] border-[#e2e8f0]"
  }`;

const selectCls = (focused, id, hasError = false, disabled = false) =>
  `${inputCls(focused, id, hasError, disabled)} appearance-none bg-no-repeat bg-[right_12px_center] pr-9 ${disabled ? "" : "cursor-pointer"
  }`;

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

function getNameSizeClass(name = "") {
  const len = name.length;
  if (len <= 14) return "text-lg md:text-2xl 2xl:text-3xl";
  if (len <= 20) return "text-base md:text-xl 2xl:text-2xl";
  if (len <= 28) return "text-sm md:text-lg 2xl:text-xl";
  return "text-xs md:text-base 2xl:text-lg";
}

function InfoField({ label, value, placeholder = "-" }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-[10px] xl:text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`text-[11px] xl:text-[13px] font-semibold ${value ? "text-slate-900" : "text-slate-300"
          }`}
      >
        {value || placeholder}
      </p>
    </div>
  );
}

function RequiredMark() {
  return <span className="ml-1 align-top text-rose-500">*</span>;
}

function FieldShell({ label, required = false, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
        {required ? <RequiredMark /> : null}
      </p>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ApplyForQuartersEmployees() {
  const user = getUser();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [popupState, setPopupState] = useState({
    open: false,
    title: "",
    message: "",
    variant: "info",
  });

  const [hodDepts, setHodDepts] = useState([]);
  const [hodDeptsError, setHodDeptsError] = useState("");
  const [quarters, setQuarters] = useState([]);
  const [quartersError, setQuartersError] = useState("");
  const [classId, setClassId] = useState(null);
  const [publication, setPublication] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [emp, setEmp] = useState({
    employeeName: user?.name || "",
    employeeId: user?.username || "",
    classOfEmployee: "",
    casteOfEmployee: "",
    department: "",
    reason: "",
    exchangeReason: "",
    attachment: null,
    selectedQuarterId: "",
    selectedQuarterRowKey: "",
  });

  const isExchange = emp.reason === "exchange";

  // ─── Derived data ───────────────────────────────────────────────────────────
  const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formatPreviewDate = (date, fallback = "-") =>
    date ? fullDateFormatter.format(date) : fallback;

  const vacantQuarterRows = quarters
    .filter((q) => {
      const available =
        q?.IsAvailable ??
        q?.isAvailable ??
        q?.is_available ??
        q?.available ??
        q?.Available;
      return Boolean(available);
    })
    .map((q, index) => {
      const quarterId =
        q?.Id ??
        q?.id ??
        q?.ID ??
        q?.QuarterId ??
        q?.quarterId ??
        q?.QuarterID ??
        q?.quarter_id ??
        null;

      if (quarterId == null) {
        console.warn("[ApplyForQuarters] Could not resolve quarterId from quarter object:", q);
      }

      return {
        rowKey: `${quarterId ?? "unknown"}-${index}`,
        quarterId,
        quarterType: q?.QuarterType || q?.quarterType || q?.quarter_type || "-",
        areaType: q?.Location || q?.location || q?.AreaType || q?.Area || q?.area || "-",
        quarterNumber:
          q?.QuarterNo ||
          q?.quarterNo ||
          q?.quarter_no ||
          q?.QuarterNumber ||
          q?.quarterNumber ||
          q?.quarter_number ||
          "-",
      };
    })
    .filter((row) => row.quarterId != null);

  const selectedQuarter = vacantQuarterRows.find(
    (q) => String(q.rowKey) === String(emp.selectedQuarterRowKey)
  );

  const displayName =
    emp.employeeName || user?.name || user?.username || "Employee";
  const nameSizeClass = getNameSizeClass(displayName);
  const initials =
    String(displayName || "E")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase() || "E";

  // ─── Table columns ──────────────────────────────────────────────────────────

  const quarterColumns = [
    {
      key: "chooseQuarter",
      header: "Choose Quarter",
      minWidth: 145,
      sortable: false,
      filterable: false,
      value: (row) => row?.rowKey,
      render: (value, row) => (
        <input
          type="radio"
          name="chooseQuarter"
          value={String(value ?? "")}
          checked={String(emp.selectedQuarterRowKey) === String(value)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => {
            clearValidationError("selectedQuarter");
            setEmp((s) => ({
              ...s,
              selectedQuarterId: row?.quarterId,
              selectedQuarterRowKey: String(value ?? ""),
            }));
          }}
          className="accent-[#1d4ed8]"
        />
      ),
    },
    { key: "quarterType", header: "Quarter Type", minWidth: 180 },
    { key: "areaType", header: "Area Type", minWidth: 160 },
    { key: "quarterNumber", header: "Quarter Number", minWidth: 180 },
  ];

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const loadPublication = async () => {
    try {
      const data = await request("/api/admin/publication/latest", { auth: true });
      setPublication(data);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const fromDate = new Date(data.From_Date);
      const toDate = new Date(data.To_Date);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      const open =
        data.Current_State === "Published" &&
        today >= fromDate &&
        today <= toDate;

      setIsApplicationOpen(open);
    } catch (err) {
      console.error(err);
      setIsApplicationOpen(false);
    }
  };

  useEffect(() => {
    loadPublication();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadEmployeeProfile() {
      try {
        const data = await request("/api/employee/me", { auth: true });
        if (cancelled) return;
        setClassId(data?.classId ?? null);
        setEmp((s) => ({
          ...s,
          employeeName: data?.employeeName || s.employeeName,
          employeeId: data?.employeeId || s.employeeId,
          classOfEmployee: data?.classOfEmployee || s.classOfEmployee,
          casteOfEmployee: data?.casteOfEmployee || s.casteOfEmployee,
          department: data?.department || s.department,
        }));
      } catch (err) {
        console.error("Employee profile error:", err);
      }
    }

    loadEmployeeProfile();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadHodDepts() {
      try {
        setHodDeptsError("");
        const data = await request("/api/allotment-hods");
        const depts = Array.isArray(data?.items)
          ? data.items
            .map((r) => r?.ALLOT_HOD_DEPT)
            .filter((v) => typeof v === "string" && v.trim() !== "")
          : [];
        const uniqueDepts = [...new Set(depts)];
        if (!cancelled) setHodDepts(uniqueDepts);
      } catch (err) {
        if (!cancelled)
          setHodDeptsError(err?.message || "Failed to load HOD departments");
      }
    }

    loadHodDepts();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!classId) return;
    let cancelled = false;

    async function loadQuarters() {
      try {
        setQuartersError("");
        const data = await request(
          "/api/estate-quarters/vacant?classId=" + classId,
          { auth: true }
        );
        const items = Array.isArray(data?.items) ? data.items : [];
        const seen = new Set();
        const uniqueItems = items.filter((q) => {
          const id = q?.Id ?? q?.ID ?? q?.QuarterId ?? q?.QuarterID;
          if (id == null || seen.has(String(id))) return false;
          seen.add(String(id));
          return true;
        });
        if (!cancelled) setQuarters(uniqueItems);
      } catch (err) {
        if (!cancelled)
          setQuartersError(err?.message || "Failed to load quarters");
      }
    }

    loadQuarters();
    return () => { cancelled = true; };
  }, [classId]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const clearValidationError = (field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: false }));
  };

  const showPopup = ({ title, message, variant = "error" }) => {
    setPopupState({ open: false, title, message, variant });
    window.setTimeout(
      () => setPopupState({ open: true, title, message, variant }),
      0
    );
  };

  const resetApplication = () => {
    setEmp((s) => ({
      ...s,
      department: "",
      reason: "",
      exchangeReason: "",
      attachment: null,
      selectedQuarterId: "",
      selectedQuarterRowKey: "",
    }));
    setValidationErrors({});
  };

  const handleApply = async () => {
    if (!isApplicationOpen) {
      showPopup({
        title: "Application Closed",
        message: "Application portal is currently closed.",
        variant: "error",
      });
      return;
    }

    setSubmitError("");

    if (!emp.department) { setSubmitError("Please select a department."); return; }
    if (!emp.reason) { setSubmitError("Please select a reason."); return; }
    if (!emp.selectedQuarterId) { setSubmitError("Please select a quarter."); return; }

    try {
      setSubmitting(true);

      const data = await request("/api/admin/checkapprovalsave", {
        method: "POST",
        body: {
          quarterId: parseInt(emp.selectedQuarterId),
          reason: emp.reason,
          exchangeReason: emp.exchangeReason || "",
          department: emp.department,
        },
        auth: true,
      });

      navigate("/Quarters/Approval", {
        state: {
          successMessage: `Your quarter application has been submitted successfully! Application No: ${data.appNo}`,
        },
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[#EEF2FF]">
      <div className="h-full bg-[#EEF2FF] overflow-hidden flex flex-col">
        <TopHeader
          role="newuser"
          description="Employee Services"
          welcomeName={user?.name || user?.username || "Employee"}
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#EEF2FF]">
            <main className="flex-1 overflow-y-auto px-9 py-7">

              {/* ── Page heading ── */}
              <div className="mb-[22px]">
                {publication && (
                  <div className="mb-5 flex justify-center">
                    <div
                      className={`w-full max-w-4xl rounded-xl px-4 py-3 overflow-hidden
                        ${isApplicationOpen
                          ? "bg-green-50 border border-green-300 text-green-700"
                          : "bg-red-50 border border-red-300 text-red-700"
                        }`}
                    >
                      <marquee>
                        {isApplicationOpen
                          ? `📢 Application Portal is Open from ${formatPreviewDate(
                            new Date(publication.From_Date)
                          )} to ${formatPreviewDate(
                            new Date(publication.To_Date)
                          )}. Please submit your application within this period.`
                          : `📢 Application Portal Closed. Please wait for committee approval and verify your application status.`}
                      </marquee>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl font-bold text-slate-900">
                  Application Form for Quarter Allotment for Employees
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Land Data Management System - Employee Application
                </p>
              </div>
              {/* ── End Page heading ── */}

              <div className="max-w-8xl mx-auto flex flex-col gap-6">

                {/* ── Profile card + form details ── */}
                <div className="flex flex-col xl:flex-row xl:items-start gap-6">

                  {/* Profile card */}
                  <div className="xl:w-64 shrink-0">
                    <div className="lms-data-transition lms-profile-card rounded-2xl shadow-lg px-6 py-6">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex w-full flex-row items-center gap-3 md:flex-col md:gap-0">
                          {/* Avatar */}
                          <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-xl md:text-3xl lg:text-5xl font-bold text-[#1a2e5a] shrink-0">
                            {initials}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col items-start gap-1 md:flex-none md:items-center">
                            <h2
                              className={`font-bold leading-tight md:mt-2 text-slate-800 w-full md:text-center ${nameSizeClass}`}
                              style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                            >
                              {displayName}
                            </h2>
                            <span className="text-[9px] md:text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 mt-0.5 md:mt-2 md:px-3 rounded-full whitespace-nowrap">
                              Active
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-px bg-white/65 my-1 md:my-3" />

                        <div className="flex flex-col gap-3 text-left w-full min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <Hash size={13} className="text-slate-600 shrink-0" />
                            <span className="break-words min-w-0">{emp.employeeId || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <BadgeCheck size={13} className="text-slate-600 shrink-0" />
                            <span className="break-words min-w-0">{emp.classOfEmployee || "Class pending"}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-slate-700">
                            <Building2 size={13} className="text-slate-600 shrink-0 mt-0.5" />
                            <span className="break-words min-w-0 leading-relaxed">
                              {emp.department || "Department not selected"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Profile card */}

                  {/* Right column: Employee info + Application details */}
                  <div className="flex-1 flex flex-col gap-5 min-w-0">

                    {/* Employee information card */}
                    <div className="lms-data-transition bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)]">
                      <div className="flex items-center justify-between px-6 py-3 border-b border-[#e2e8f0]">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#1a2e5a]" />
                          <h3 className="font-semibold text-md text-slate-900">
                            Employee Information
                          </h3>
                        </div>
                      </div>
                      <div className="px-4 py-4 xl:px-6 xl:py-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-5 sm:gap-x-6">
                        <InfoField label="Name of the Employee" value={emp.employeeName} />
                        <InfoField label="Employee ID" value={emp.employeeId} />
                        <InfoField label="Class of Employee" value={emp.classOfEmployee} />
                        <InfoField label="Caste of Employee" value={emp.casteOfEmployee} />
                      </div>
                    </div>
                    {/* End Employee information card */}

                    {/* Application details card wrapper (with closed overlay) */}
                    <div className={`relative rounded-2xl ${!isApplicationOpen ? "border-[2px] border-red-400" : ""}`}>
                      {!isApplicationOpen && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <div className="bg-white/95 px-6 py-3 rounded-xl shadow-lg border border-red-300">
                            <p className="font-bold text-red-600">
                              🚫 Application is closed right now
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Application details card */}
                      <div
                        className={`lms-data-transition bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)] ${!isApplicationOpen ? "blur-[2px] opacity-60" : ""}`}
                      >
                        <div className="flex items-center justify-between px-6 py-3 border-b border-[#e2e8f0]">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-[#1a2e5a]" />
                            <h3 className="font-semibold text-md text-slate-900">
                              Application Details
                            </h3>
                          </div>
                        </div>

                        <div className="px-4 py-4 xl:px-6 xl:py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                          {/* Department */}
                          <FieldShell label="Department" required>
                            <select
                              value={emp.department}
                              onChange={(e) => {
                                clearValidationError("department");
                                setEmp((s) => ({ ...s, department: e.target.value }));
                              }}
                              className={selectCls(focused, "emp_department", validationErrors.department)}
                              style={{ backgroundImage: SELECT_ARROW }}
                              onFocus={() => setFocused("emp_department")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">Choose a Department</option>
                              {hodDepts.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </FieldShell>

                          {/* Reason */}
                          <FieldShell label="Application Reason" required>
                            <select
                              value={emp.reason}
                              onChange={(e) => {
                                const reason = e.target.value;
                                clearValidationError("reason");
                                if (reason !== "exchange") {
                                  clearValidationError("exchangeReason");
                                  clearValidationError("attachment");
                                }
                                setEmp((s) => ({
                                  ...s,
                                  reason,
                                  exchangeReason: reason === "exchange" ? s.exchangeReason : "",
                                  attachment: reason === "exchange" ? s.attachment : null,
                                }));
                              }}
                              className={selectCls(focused, "emp_reason", validationErrors.reason)}
                              style={{ backgroundImage: SELECT_ARROW }}
                              onFocus={() => setFocused("emp_reason")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">Choose a Reason</option>
                              <option value="fresh">Fresh Allotment</option>
                              <option value="exchange">Exchange</option>
                              <option value="renewal">Renewal</option>
                            </select>
                          </FieldShell>

                          {/* Exchange reason */}
                          <FieldShell label="Exchange Reason" required={isExchange}>
                            <input
                              type="text"
                              value={emp.exchangeReason}
                              onChange={(e) => {
                                clearValidationError("exchangeReason");
                                setEmp((s) => ({ ...s, exchangeReason: e.target.value }));
                              }}
                              disabled={!isExchange}
                              className={inputCls(focused, "emp_exchangeReason", validationErrors.exchangeReason, !isExchange)}
                              onFocus={() => setFocused("emp_exchangeReason")}
                              onBlur={() => setFocused(null)}
                              placeholder={isExchange ? "Enter exchange reason" : "Available when Exchange is selected"}
                            />
                          </FieldShell>

                          {/* Attachment */}
                          <FieldShell label="Attachment" required={isExchange}>
                            <label
                              className={`h-10 rounded-[7px] border-[1.5px] px-3 text-[13px] font-semibold flex items-center justify-between gap-3 transition-all duration-200 ${validationErrors.attachment
                                ? "border-rose-500 bg-white text-rose-600 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
                                : isExchange
                                  ? "border-[#e2e8f0] bg-white text-[#1d4ed8] cursor-pointer"
                                  : "border-[#e2e8f0] bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                              <span className="truncate">
                                {emp.attachment?.name ||
                                  (isExchange ? "File Upload" : "Available when Exchange is selected")}
                              </span>
                              <Upload size={15} className="shrink-0" />
                              <input
                                type="file"
                                disabled={!isExchange}
                                className="hidden"
                                onChange={(e) => {
                                  clearValidationError("attachment");
                                  setEmp((s) => ({ ...s, attachment: e.target.files?.[0] || null }));
                                }}
                              />
                            </label>
                          </FieldShell>
                        </div>
                        {/* End grid */}

                        {hodDeptsError && (
                          <div className="px-6 pb-4 text-[12px] font-semibold text-rose-600">
                            {hodDeptsError}
                          </div>
                        )}
                      </div>
                      {/* End Application details card */}
                    </div>
                    {/* End relative wrapper */}

                  </div>
                  {/* End Right column */}

                </div>
                {/* ── End Profile card + form details ── */}

                {/* ── Vacant quarters table ── */}
                <div className={`relative rounded-2xl ${!isApplicationOpen ? "border-[2px] border-red-500" : ""}`}>
                  {!isApplicationOpen && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <div className="bg-white/95 px-6 py-3 rounded-lg shadow-lg border border-red-300">
                        <p className="font-bold text-red-600">
                          🚫 Application is closed right now
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className={`lms-data-transition bg-white rounded-2xl border
                      ${!isApplicationOpen ? "blur-[2px] opacity-60 border-[#e2e8f0]" : validationErrors.selectedQuarter ? "border-rose-500" : "border-[#e2e8f0]"}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home size={16} className="text-[#1a2e5a]" />
                        <h3 className="font-bold text-lg text-slate-900">
                          Choose from Vacant Quarters Listing
                          <RequiredMark />
                        </h3>
                      </div>
                      <div className="text-[12px] font-semibold text-slate-500">
                        {selectedQuarter
                          ? `Selected: ${selectedQuarter.quarterNumber}`
                          : "Select one available quarter"}
                      </div>
                    </div>

                    {quartersError && (
                      <div className="px-6 pb-3 text-[12px] font-semibold text-rose-600">
                        {quartersError}
                      </div>
                    )}

                    <div className="lms-quarter-grid bg-white pb-5 px-5 lg:pb-7 lg:px-7">
                      <AgGridTable
                        columns={quarterColumns}
                        rows={vacantQuarterRows}
                        rowKey={(row) => row?.rowKey}
                        searchable
                        pageSize={10}
                        showExport={false}
                        showFilter={false}
                        contentAutoWidth={false}
                        contentAlign="center"
                        emptyMessage={
                          classId
                            ? "No vacant quarters available"
                            : "Loading vacant quarters..."
                        }
                        searchPlaceholder="Search quarter type, area, quarter number..."
                      />
                    </div>
                  </div>
                  {/* End quarters inner card */}
                </div>
                {/* ── End Vacant quarters table ── */}

                {/* ── Action buttons ── */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetApplication}
                    className="px-6 py-2.5 rounded-lg border border-[#e2e8f0] bg-white hover:bg-slate-50 text-slate-700 text-[13.5px] font-semibold transition-all duration-200"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!isApplicationOpen || submitting}
                    className="px-10 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-bold shadow-[0_2px_8px_rgba(232,119,34,0.25)] transition-all duration-200 flex items-center gap-2"
                  >
                    {submitting ? "Submitting..." : "Apply"}
                  </button>
                </div>
                {/* ── End Action buttons ── */}

              </div>
              {/* End max-w-8xl wrapper */}

            </main>
          </div>
          {/* End flex-1 flex flex-col */}

        </div>
        {/* End flex-1 flex overflow-hidden */}

        <Footer />
      </div>
      {/* End h-full bg wrapper */}

      <Popup
        open={popupState.open}
        title={popupState.title}
        message={popupState.message}
        variant={popupState.variant}
        onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
      />
    </div>
    // End root div
  );
} 