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
import { request } from "../../api";
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
    <div className="flex min-w-0 flex-col gap-1 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100/60">
      <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-snug">
        {label}
      </p>
      <p
        className={`min-w-0 text-[12px] sm:text-[13px] font-bold leading-normal break-words ${
          value ? "text-slate-900" : "text-slate-400"
        }`}
        title={value || placeholder}
      >
        {value || placeholder}
      </p>
    </div>
  );
}

function StatusPill({ value }) {
  const status = String(value || "").toLowerCase();
  const styles = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  if (!status) return <span className="text-[11px] font-semibold text-slate-400">-</span>;

  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-slate-100 text-slate-600"
        }`}
    >
      {label}
    </span>
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

function normalizeQuarterText(value = "") {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

function getRosterEligibility(caste, quarterType, rosterNo) {
  const casteNorm = normalizeQuarterText(caste);
  const quarterNorm = normalizeQuarterText(quarterType);
  const roster = Number(rosterNo);

  if (!Number.isInteger(roster) || roster < 1 || roster > 60) {
    return { allowed: false, message: "Invalid roster number." };
  }

  if (!casteNorm) {
    return { allowed: false, message: "Employee caste is required to validate roster eligibility." };
  }

  const aLike = new Set(["A TYPE", "B TYPE", "B TYPE IIIR"]);
  const cLike = new Set(["C TYPE", "C TYPE MODIFIED", "D TYPE"]);

  if (aLike.has(quarterNorm)) {
    if ([10, 20, 40, 50].includes(roster)) {
      return casteNorm === "SC"
        ? { allowed: true }
        : { allowed: false, message: "This roster is reserved for SC applicants." };
    }

    if ([30, 60].includes(roster)) {
      return casteNorm === "ST"
        ? { allowed: true }
        : { allowed: false, message: "This roster is reserved for ST applicants." };
    }

    return { allowed: true };
  }

  if (cLike.has(quarterNorm)) {
    if ([20, 40].includes(roster)) {
      return casteNorm === "SC"
        ? { allowed: true }
        : { allowed: false, message: "This roster is reserved for SC applicants." };
    }

    if (roster === 60) {
      return casteNorm === "ST"
        ? { allowed: true }
        : { allowed: false, message: "This roster is reserved for ST applicants." };
    }

    return { allowed: true };
  }

  










  return { allowed: true };
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ApplyForQuartersEmployees() {
  const user = getUser();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const [focused, setFocused] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [publishedTypes, setPublishedTypes] = useState([]); // quarter types in the active circular
  const [publication, setPublication] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [approvedQuarter, setApprovedQuarter] = useState(null);
  const [empClassName, setEmpClassName] = useState("");

  const [emp, setEmp] = useState({
    employeeName: user?.name || "",
    employeeId: user?.username || "",
    classOfEmployee: "",
    casteOfEmployee: "",
    category: "",
    dateOfBirth: "",
    dateOfJoining: "",
    gradDate: "",
    department: "",
    reason: "",
    exchangeReason: "",
    attachment: null,
    selectedQuarterId: "",
    selectedQuarterRowKey: "",
    debarredFromDate: "",
    debarredToDate: "",
    areaType: "",
    quarterNo: "",
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
        nextRosterNo: q?.NextRosterNo ?? q?.nextRosterNo ?? q?.next_roster_no ?? null,
      };
    })
    .filter((row) => row.quarterId != null);

  const eligibleVacantQuarterRows = vacantQuarterRows;

  const selectedQuarter = eligibleVacantQuarterRows.find(
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

  const renderQuarterChoice = (value, row) => {
    return (
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
    );
  };

  // ─── Table columns ──────────────────────────────────────────────────────────

  const quarterColumns = [
    {
      key: "chooseQuarter",
      header: "Choose Quarter",
      minWidth: 145,
      sortable: false,
      filterable: false,
      value: (row) => row?.rowKey,
      render: (value, row) => renderQuarterChoice(value, row),
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPublication();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadEmployeeProfile() {
      try {
        const data = await request("/api/employee/me", { auth: true });
        if (cancelled) return;
        const cls = data?.classOfEmployee || "";
        setEmpClassName(cls);
        setEmp((s) => ({
          ...s,
          employeeName: data?.employeeName || s.employeeName,
          employeeId: data?.employeeId || s.employeeId,
          classOfEmployee: data?.classOfEmployee || s.classOfEmployee,
          casteOfEmployee: data?.casteOfEmployee || s.casteOfEmployee,
          category: data?.category || s.category,
          dateOfBirth: data?.dateOfBirth || s.dateOfBirth,
          dateOfJoining: data?.dateOfJoining || s.dateOfJoining,
          gradDate: data?.gradDate || s.gradDate,
          department: data?.department || s.department,
          debarredFromDate: data?.debarredFromDate || s.debarredFromDate,
          debarredToDate: data?.debarredToDate || s.debarredToDate,
          areaType: data?.areaType || s.areaType,
          quarterNo: data?.quarterNo || s.quarterNo,
        }));
      } catch (err) {
        console.error("Employee profile error:", err);
      }
    }

    loadEmployeeProfile();
    return () => { cancelled = true; };
  }, []);

  const [rejectedApplication, setRejectedApplication] = useState(null);
  const [rejectedPopupOpen, setRejectedPopupOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadApplicationStatus() {
      try {
        const data = await request("/api/admin/check-approval", { auth: true });
        if (cancelled) return;

        const items = Array.isArray(data?.items) ? data.items : [];
        const approved = items.find((row) => String(row?.Status || "").toLowerCase() === "approved") || null;
        setApprovedQuarter(approved);

        // Check if there is a rejected application that hasn't been dismissed this session
        const rejected = items.find((row) => String(row?.Status || "").toLowerCase() === "rejected");
        if (rejected) {
          const dismissedKey = `dismissed_rejected_app_${rejected.Id || rejected.AppNo}`;
          if (!sessionStorage.getItem(dismissedKey)) {
            setRejectedApplication(rejected);
            setRejectedPopupOpen(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Application status load error:", err);
          setApprovedQuarter(null);
        }
      }
    }

    loadApplicationStatus();
    return () => {
      cancelled = true;
    };
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
    if (!empClassName) return;
    let cancelled = false;

    async function loadQuarters() {
      try {
        setQuartersError("");
        const data = await request(
          "/api/estate-quarters/vacant?className=" + encodeURIComponent(empClassName),
          { auth: true }
        );
        const items = Array.isArray(data?.items) ? data.items : [];
        const seen = new Set();
        const uniqueItems = items.filter((q) => {
          const key = `${q?.QuarterNo ?? ""}|${q?.QuarterType ?? ""}|${q?.Location ?? ""}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (!cancelled) {
          setQuarters(uniqueItems);
          setPublishedTypes(Array.isArray(data?.publishedTypes) ? data.publishedTypes : []);
        }
      } catch (err) {
        if (!cancelled)
          setQuartersError(err?.message || "Failed to load quarters");
      }
    }

    loadQuarters();
    return () => { cancelled = true; };
  }, [empClassName]);

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
    setSubmitError("");
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
    if (!selectedQuarter) {
      setSubmitError("Please select an available quarter.");
      return;
    }

    try {
      setSubmitting(true);

      // Step 1 — Submit the application as plain JSON
      const data = await request("/api/admin/checkapprovalsave", {
        method: "POST",
        body: {
          quarterId: parseInt(emp.selectedQuarterId),
          quarterNo: selectedQuarter.quarterNumber,
          quarterType: selectedQuarter.quarterType,
          location: selectedQuarter.areaType,
          reason: emp.reason,
          exchangeReason: emp.exchangeReason || "",
          department: emp.department,
        },
        auth: true,
      });

      // Step 2 — If the employee selected a file, upload it now
      if (emp.attachment && data?.id) {
        try {
          console.log("[Upload] Starting file upload for application id:", data.id);
          const fd = new FormData();
          fd.append("attachment", emp.attachment);
          const uploadResult = await request(`/api/admin/upload-attachment/${data.id}`, {
            method: "POST",
            body: fd,
            auth: true,
          });
          console.log("[Upload] Success:", uploadResult);
        } catch (uploadErr) {
          console.error("[Upload] FAILED:", uploadErr.message, uploadErr);
          setSubmitError(`Application submitted (${data.appNo}), but file upload failed: ${uploadErr.message}. You can retry the upload later.`);
          setSubmitting(false);
          return; // stop here so user sees the error
        }
      }

      showPopup({
        title: "Application Submitted Successfully",
        message: `Your quarter application has been submitted successfully! Application No: ${data.appNo}`,
        variant: "success",
      });

      resetApplication();
    } catch (err) {
      setSubmitError(err.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let isBanned = false;
  if (emp.debarredFromDate && emp.debarredToDate) {
    const from = new Date(emp.debarredFromDate);
    const to = new Date(emp.debarredToDate);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      if (today >= from && today <= to) {
        isBanned = true;
      }
    }
  }

  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] bg-[#EEF2FF] flex flex-col h-screen overflow-hidden">
      <div className="bg-[#EEF2FF] flex flex-col h-full overflow-hidden">
        <TopHeader
          role="newuser"
          description="Employee Services"
          welcomeName={user?.name || user?.username || "Employee"}
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
          onOpenMenu={() => setSidebarOpen(true)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <div className="hidden shrink-0 h-full lg:flex">
            <Sidebar />
          </div>

          {/* Mobile/tablet sidebar drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              <div className="relative h-full w-[260px] bg-white shadow-xl animate-in slide-in-from-left duration-200">
                <Sidebar forceExpanded onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#EEF2FF]">
            {isBanned && (
              <div className="absolute inset-0 z-30 flex flex-col items-center pt-24 bg-white/60 backdrop-blur-[6px]">
                <div className="rounded-2xl bg-white p-8 shadow-2xl border border-red-200 text-center max-w-lg">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-slate-800">Account Restricted</h2>
                  <p className="text-slate-600 text-sm">
                    You are currently debarred from accessing this portal.
                  </p>
                  <div className="mt-4 inline-flex flex-col rounded-lg bg-red-50 px-6 py-3 border border-red-100">
                    <span className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Debarment Period</span>
                    <span className="font-semibold text-red-700">
                      {formatPreviewDate(new Date(emp.debarredFromDate))} — {formatPreviewDate(new Date(emp.debarredToDate))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <main className="relative flex-1 overflow-y-auto bg-[#EEF2FF] px-4 sm:px-6 lg:px-8 py-5 sm:py-7">

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

                <h1 className="max-w-full text-[22px] font-bold leading-tight text-slate-900 sm:text-2xl lg:text-[26px]">
                  Application Form for Quarter Allotment for Employees
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Land Data Management System - Employee Application
                </p>
              </div>
              {/* ── End Page heading ── */}

              <div className="max-w-8xl mx-auto flex flex-col gap-6">

                {/* ── Profile card + form details ── */}
                <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4 lg:gap-6 shrink-0">

                  {/* Profile card */}
                  <div className="w-full md:w-56 lg:w-64 xl:w-72 shrink-0">
                    <div className="lms-data-transition lms-profile-card rounded-2xl shadow-lg px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                      <div className="flex flex-col items-center text-center gap-2.5">
                        <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 shrink-0 w-full">
                          {/* Avatar */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-xl sm:text-2xl lg:text-3xl xl:text-5xl font-bold text-[#1a2e5a] shrink-0">
                            {initials}
                          </div>

                          <div className="flex flex-col items-center gap-1 min-w-0 w-full px-1">
                            <h2
                              className={`font-bold leading-tight mt-1 text-slate-800 text-center ${nameSizeClass}`}
                              style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                            >
                              {displayName}
                            </h2>
                            <span className="text-[9px] md:text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 mt-0.5 rounded-full whitespace-nowrap">
                              Active
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-px bg-white/65 my-1.5 sm:my-2 lg:my-3" />

                        <div className="flex flex-col gap-2.5 text-left w-full min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <Hash size={13} className="text-slate-600 shrink-0" />
                            <span className="break-words min-w-0 font-medium">{emp.employeeId || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <BadgeCheck size={13} className="text-slate-600 shrink-0" />
                            <span className="break-words min-w-0 font-medium">{emp.classOfEmployee || "Class pending"}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-slate-700">
                            <Building2 size={13} className="text-slate-600 shrink-0 mt-0.5" />
                            <span className="break-words min-w-0 leading-relaxed font-medium">
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
                    <div className="lms-data-transition bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#e2e8f0] bg-slate-50/70">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-[#1a2e5a]" />
                          <h3 className="font-bold text-sm sm:text-base text-slate-900">
                            Employee Information
                          </h3>
                        </div>
                        <StatusPill value={approvedQuarter?.Status} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 p-3.5 sm:p-4 lg:p-5 bg-slate-50/30">
                        <InfoField
                          label="Name of the Employee"
                          value={emp.employeeName}
                        />
                        <InfoField label="Employee ID" value={emp.employeeId} />
                        <InfoField
                          label="Class of Employee"
                          value={emp.classOfEmployee}
                        />
                        <InfoField
                          label="Category"
                          value={emp.category}
                        />
                        <InfoField
                          label="Caste of Employee"
                          value={emp.casteOfEmployee}
                        />
                        <InfoField
                          label="Date of Birth"
                          value={emp.dateOfBirth}
                        />
                        <InfoField
                          label="Area Type"
                          value={emp.areaType}
                        />
                        <InfoField
                          label="Quarter No"
                          value={emp.quarterNo}
                        />

                      </div>
                      <div className="border-t border-slate-100 p-3.5 sm:p-4 lg:p-5">
                        <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-[#1a2e5a]" />
                          <p className="font-bold text-sm sm:text-base text-slate-900">
                            Current Approved Quarter
                          </p>
                        </div>
                        {approvedQuarter ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
                            <InfoField label="Application Number" value={approvedQuarter.AppNo} />
                            <InfoField label="Quarter Number" value={approvedQuarter.QtrRequested} />
                            <InfoField label="Quarter Type" value={approvedQuarter.QtrType} />
                            <InfoField label="Quarter Location" value={approvedQuarter.QtrLocation} />
                          </div>
                        ) : (
                          <p className="text-[12px] font-semibold text-slate-400">
                            No approved quarter is available yet.
                          </p>
                        )}
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
                                setEmp((s) => ({
                                  ...s,
                                  department: e.target.value,
                                }));
                              }}
                              className={selectCls(
                                focused,
                                "emp_department",
                                validationErrors.department
                              )}
                              style={{ backgroundImage: SELECT_ARROW }}
                              onFocus={() => setFocused("emp_department")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">Choose a Department</option>
                              {Array.from(new Set([...hodDepts, emp.department].filter(Boolean))).map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept}
                                </option>
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
                                  exchangeReason:
                                    reason === "exchange"
                                      ? s.exchangeReason
                                      : "",
                                  attachment:
                                    reason === "exchange" ? s.attachment : null,
                                }));
                              }}
                              className={selectCls(
                                focused,
                                "emp_reason",
                                validationErrors.reason
                              )}
                              style={{ backgroundImage: SELECT_ARROW }}
                              onFocus={() => setFocused("emp_reason")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">Choose a Reason</option>
                              <option value="fresh">Fresh Allotment</option>
                              <option value="exchange">Exchange</option>
                            </select>
                          </FieldShell>

                          {/* Exchange reason */}
                          <FieldShell
                            label="Exchange Reason"
                            required={isExchange}
                          >
                            <select
                              value={emp.exchangeReason}
                              onChange={(e) => {
                                clearValidationError("exchangeReason");
                                setEmp((s) => ({
                                  ...s,
                                  exchangeReason: e.target.value,
                                }));
                              }}
                              disabled={!isExchange}
                              className={selectCls(
                                focused,
                                "emp_exchangeReason",
                                validationErrors.exchangeReason,
                                !isExchange
                              )}
                              style={{ backgroundImage: SELECT_ARROW }}
                              onFocus={() => setFocused("emp_exchangeReason")}
                              onBlur={() => setFocused(null)}
                            >
                              <option value="">
                                {isExchange
                                  ? "Choose Exchange Reason"
                                  : "Available when Exchange is selected"}
                              </option>
                              <option value="Medical">Medical</option>
                              <option value="Broken">Broken</option>
                            </select>
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
                                  (isExchange
                                    ? "File Upload"
                                    : "Available when Exchange is selected")}
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

                  <div
                    className={`lms-data-transition bg-white rounded-2xl border shadow-[0_2px_12px_rgba(26,46,90,0.07)] overflow-hidden ${!isApplicationOpen
                      ? "blur-[2px] opacity-60 border-[#e2e8f0] pointer-events-none"
                      : validationErrors.selectedQuarter
                        ? "border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12)]"
                        : "border-[#e2e8f0]"
                      }`}
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

                    {/* ── Not-eligible notice ── */}
                    {isApplicationOpen &&
                      publishedTypes.length > 0 &&
                      eligibleVacantQuarterRows.length === 0 &&
                      !quartersError && (
                        <div className="mx-5 mb-4 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
                          <div className="flex items-start gap-4 px-5 py-5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[14px] font-bold text-amber-800">
                                Your eligible quarter type is not open for applications currently
                              </p>
                              <p className="mt-1 text-[12.5px] leading-relaxed text-amber-700">
                                The current circular has opened applications only for:{" "}
                                <span className="font-semibold">{publishedTypes.join(", ")}</span>.
                                Your grade is not eligible for these types. Please wait for the next circular.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="lms-quarter-grid bg-white pb-5 px-5 lg:pb-7 lg:px-7">
                      <AgGridTable
                        columns={quarterColumns}
                        rows={eligibleVacantQuarterRows}
                        rowKey={(row) => row?.rowKey}
                        searchable
                        pageSize={10}
                        showExport={false}
                        showFilter={false}
                        contentAutoWidth={false}
                        contentAlign="center"
                        emptyMessage={
                          empClassName
                            ? "No vacant quarters available"
                            : "Loading vacant quarters..."
                        }
                        searchPlaceholder="Search quarter type, area, quarter number..."
                      />
                    </div>
                  </div>
                </div>
                {/* ── End Vacant quarters table ── */}

                {/* ── Action buttons ── */}
                <div className="flex items-center justify-end gap-3">
                  {/* ── Error message ── */}
                  {submitError && (
                    <div className="flex items-center w-full gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
                      <span className="text-rose-500 text-[16px]">✕</span>
                      {submitError}
                    </div>
                  )}
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

      {/* Rejected Application Notification Modal */}
      {rejectedPopupOpen && rejectedApplication && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "520px",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #fee2e2",
            }}
          >
            {/* Header banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)",
                padding: "20px 24px",
                borderBottom: "1px solid #fecdd3",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#ffe4e6",
                    border: "1.5px solid #fca5a5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e11d48",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#9f1239" }}>
                    Application Status Update
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#be123c", fontWeight: 500 }}>
                    Land Data Management System
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sessionStorage.setItem(`dismissed_rejected_app_${rejectedApplication.Id || rejectedApplication.AppNo}`, "true");
                  setRejectedPopupOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9f1239",
                  fontSize: "20px",
                  lineHeight: 1,
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "22px 24px" }}>
              <div
                style={{
                  background: "#fff5f5",
                  border: "1px solid #fed7d7",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  marginBottom: "18px",
                }}
              >
                <p style={{ margin: 0, fontSize: "13.5px", color: "#9b2c2c", fontWeight: 600, lineHeight: 1.5 }}>
                  Your application for quarter allotment has been <span style={{ color: "#c53030", textDecoration: "underline" }}>Rejected</span> by the administration.
                </p>
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#742a2a", lineHeight: 1.4 }}>
                  The quarter has been skipped to the next priority waiting employee or allotment was cancelled.
                </p>
              </div>

              {/* Details card */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px 16px",
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Application No
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    {rejectedApplication.AppNo || "—"}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Status
                  </span>
                  <div style={{ marginTop: "2px" }}>
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide bg-rose-100 text-rose-700">
                      Rejected
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Requested Quarter
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    {rejectedApplication.QtrRequested || "—"} ({rejectedApplication.QtrType || "—"})
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Location
                  </span>
                  <p style={{ margin: "2px 0 0", fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
                    {rejectedApplication.QtrLocation || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                background: "#fafafa",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(`dismissed_rejected_app_${rejectedApplication.Id || rejectedApplication.AppNo}`, "true");
                  setRejectedPopupOpen(false);
                }}
                style={{
                  padding: "9px 18px",
                  borderRadius: "9px",
                  border: "1.5px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(`dismissed_rejected_app_${rejectedApplication.Id || rejectedApplication.AppNo}`, "true");
                  setRejectedPopupOpen(false);
                  navigate("/Quarters/Approval");
                }}
                style={{
                  padding: "9px 20px",
                  borderRadius: "9px",
                  border: "none",
                  background: "linear-gradient(135deg, #185FA5, #0f477f)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(24, 95, 165, 0.25)",
                }}
              >
                Check Approval Status
              </button>
            </div>
          </div>
        </div>
      )}

      <Popup
        open={popupState.open}
        title={popupState.title}
        message={popupState.message}
        variant={popupState.variant}
        onClose={() => setPopupState((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
} 
