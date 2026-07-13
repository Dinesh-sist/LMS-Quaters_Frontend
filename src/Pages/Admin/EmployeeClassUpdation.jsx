import { useState, useCallback, useEffect } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  X,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import AgGridTable from "../../Components/Table";
import Popup from "../../Components/Popup";
import { getEmployeeClasses, updateEmployeeClass } from "../../api";

// ─── Class config ─────────────────────────────────────────────────────────────

const CLASS_OPTIONS = ["Sr.Class 1", "Jr.Class 1", "Class 2", "Class 3", "Class 4"];
const CLASS_RANK = { "Sr.Class 1": 1, "Jr.Class 1": 2, "Class 2": 3, "Class 3": 4, "Class 4": 5 };

// Dashboard-style gradient cards — one distinct palette per class
const CLASS_CARD = {
  "Sr.Class 1": {
    cardBg: "border-violet-300/70 bg-gradient-to-br from-violet-700 via-purple-500 to-fuchsia-400",
    hoverBg: "bg-gradient-to-br from-violet-800 via-purple-600 to-fuchsia-300",
    dotColor: "#a78bfa",
  },
  "Jr.Class 1": {
    cardBg: "border-indigo-300/70 bg-gradient-to-br from-indigo-700 via-blue-500 to-sky-400",
    hoverBg: "bg-gradient-to-br from-indigo-800 via-blue-600 to-sky-300",
    dotColor: "#818cf8",
  },
  "Class 2": {
    cardBg: "border-sky-300/70 bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-400",
    hoverBg: "bg-gradient-to-br from-blue-800 via-sky-600 to-cyan-200",
    dotColor: "#38bdf8",
  },
  "Class 3": {
    cardBg: "border-amber-300/70 bg-gradient-to-br from-amber-600 via-orange-400 to-amber-400",
    hoverBg: "bg-gradient-to-br from-amber-700 via-orange-500 to-yellow-300",
    dotColor: "#fbbf24",
  },
  "Class 4": {
    cardBg: "border-rose-300/70 bg-gradient-to-br from-red-700 via-rose-500 to-pink-400",
    hoverBg: "bg-gradient-to-br from-red-800 via-rose-600 to-pink-200",
    dotColor: "#fb7185",
  },
};

// Badge styles for table cells and modal
const CLASS_BADGE = {
  "Jr.Class 1": { bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" },
  "Sr.Class 1": { bg: "#fcfee9", color: "#d9b928", border: "#d9b928" },
  "Class 2": { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  "Class 3": { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
  "Class 4": { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
};

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeEmployeesResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.employees)) return payload.employees;
  if (Array.isArray(payload?.classes)) return payload.classes;
  return [];
}

// ─── Class Badge (table cell) ─────────────────────────────────────────────────

function ClassBadgeRenderer({ value }) {
  const style = CLASS_BADGE[value] || CLASS_BADGE["Class 4"];
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 6,
      fontSize: 11, fontWeight: 700, background: style.bg,
      color: style.color, border: `1px solid ${style.border}`,
      whiteSpace: "nowrap", letterSpacing: "0.02em",
    }}>
      {value}
    </span>
  );
}

// ─── Action cell renderer ─────────────────────────────────────────────────────

function makeActionRenderer(onPromote, onDemote, busyEmpId) {
  return function ActionRenderer({ data }) {
    if (!data) return null;
    const rank = CLASS_RANK[data.currentClass];
    const isBusy = busyEmpId === data.empId;
    const canPromote = rank > 1 && !isBusy;
    const canDemote = rank < 5 && !isBusy;

    const baseBtn = {
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
      border: "1px solid", cursor: "pointer", transition: "opacity 0.15s",
      whiteSpace: "nowrap",
    };

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: "100%" }}>
        <button
          style={{
            ...baseBtn,
            background: canPromote ? "#f0fdf4" : "#f8fafc",
            color: canPromote ? "#16a34a" : "#cbd5e1",
            borderColor: canPromote ? "#bbf7d0" : "#e2e8f0",
            cursor: canPromote ? "pointer" : "not-allowed",
          }}
          disabled={!canPromote}
          title={canPromote ? `Promote ${data.empName}` : "Already at highest class"}
          onClick={() => canPromote && onPromote(data)}
          onMouseEnter={(e) => canPromote && (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="16 12 12 8 8 12" /><line x1="12" y1="16" x2="12" y2="8" />
          </svg>
          Promote
        </button>

        <button
          style={{
            ...baseBtn,
            background: canDemote ? "#fff1f2" : "#f8fafc",
            color: canDemote ? "#dc2626" : "#cbd5e1",
            borderColor: canDemote ? "#fecaca" : "#e2e8f0",
            cursor: canDemote ? "pointer" : "not-allowed",
          }}
          disabled={!canDemote}
          title={canDemote ? `Demote ${data.empName}` : "Already at lowest class"}
          onClick={() => canDemote && onDemote(data)}
          onMouseEnter={(e) => canDemote && (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="8 12 12 16 16 12" /><line x1="12" y1="8" x2="12" y2="16" />
          </svg>
          Demote
        </button>
      </div>
    );
  };
}

// ─── Action Modal ─────────────────────────────────────────────────────────────

function ActionModal({ employee, mode, onClose, onConfirm, submitting }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");

  if (!employee) return null;

  const currentRank = CLASS_RANK[employee.currentClass];
  const isPromote = mode === "promote";
  const availableClasses = CLASS_OPTIONS.filter((cls) =>
    isPromote ? CLASS_RANK[cls] < currentRank : CLASS_RANK[cls] > currentRank
  );

  const handleConfirm = () => {
    if (!selectedClass) { setError(`Please select a class to ${mode} this employee.`); return; }
    onConfirm(employee.empId, selectedClass, isPromote);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 backdrop-blur-sm bg-slate-900/40" onClick={!submitting ? onClose : undefined} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-3xl bg-white shadow-[0_32px_64px_rgba(15,23,42,0.22)] border border-slate-200"
          style={{ animation: "ecsModalIn 0.18s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between gap-3 rounded-t-3xl px-6 py-4 border-b ${isPromote ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100"
            : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-100"
            }`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isPromote ? "bg-emerald-100" : "bg-rose-100"}`}>
                {isPromote ? <ArrowUpCircle size={20} className="text-emerald-600" /> : <ArrowDownCircle size={20} className="text-rose-600" />}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {isPromote ? "Promote Employee" : "Demote Employee"}
                </p>
                <h3 className="text-base font-bold text-slate-900">Class {isPromote ? "Upgrade" : "Downgrade"}</h3>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Employee Name", value: employee.empName },
                  { label: "Employee ID", value: employee.empId, mono: true },
                  { label: "Department", value: employee.department },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                    <p className={`mt-1 text-[13px] font-semibold text-slate-800 leading-snug ${mono ? "font-mono" : ""}`}>{value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Class</p>
                  <span className="mt-1 inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                    style={{
                      background: CLASS_BADGE[employee.currentClass]?.bg,
                      color: CLASS_BADGE[employee.currentClass]?.color,
                      border: `1px solid ${CLASS_BADGE[employee.currentClass]?.border}`,
                    }}>
                    {employee.currentClass}
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-3 text-[13px] text-slate-600 font-medium">
              {isPromote ? "Select a class to promote this employee to:" : "Select a class to demote this employee to:"}
            </p>

            <div className="flex flex-wrap gap-2 mb-1">
              {availableClasses.map((cls) => {
                const isSelected = selectedClass === cls;
                const badge = CLASS_BADGE[cls];
                return (
                  <button key={cls} type="button" disabled={submitting}
                    onClick={() => { setSelectedClass(cls); setError(""); }}
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={isSelected
                      ? { background: badge.bg, color: badge.color, borderColor: badge.border, boxShadow: `0 0 0 3px ${badge.bg}` }
                      : { background: "#fff", color: "#475569", borderColor: "#e2e8f0" }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: isSelected ? badge.color : "#cbd5e1" }} />
                    {cls}
                    {CLASS_RANK[cls] === 1 && <span className="text-[9px] font-bold uppercase tracking-wider ml-1" style={{ color: "#7c3aed" }}>Highest</span>}
                    {CLASS_RANK[cls] === 5 && <span className="text-[9px] font-bold uppercase tracking-wider ml-1 text-slate-400">Lowest</span>}
                  </button>
                );
              })}
            </div>

            {error && <p className="mt-2 text-[12px] font-semibold text-rose-600">{error}</p>}

            {selectedClass && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: CLASS_BADGE[employee.currentClass]?.bg, color: CLASS_BADGE[employee.currentClass]?.color, border: `1px solid ${CLASS_BADGE[employee.currentClass]?.border}` }}>
                  {employee.currentClass}
                </span>
                <span className="text-slate-400 font-bold mx-1">→</span>
                <span className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: CLASS_BADGE[selectedClass]?.bg, color: CLASS_BADGE[selectedClass]?.color, border: `1px solid ${CLASS_BADGE[selectedClass]?.border}` }}>
                  {selectedClass}
                </span>
                <span className="ml-auto text-[11px] font-semibold text-slate-400">
                  {isPromote ? "Promotion" : "Demotion"}
                </span>
              </div>
            )}
          </div>


          {/* Footer */}
          <div className="flex items-center justify-end gap-3 rounded-b-3xl border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button type="button" onClick={onClose} disabled={submitting}
              className="px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button type="button" onClick={handleConfirm} disabled={submitting}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[13px] font-bold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${isPromote ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                : "bg-rose-600 hover:bg-rose-700 shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                }`}>
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Saving…" : `Confirm ${isPromote ? "Promotion" : "Demotion"}`}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ecsModalIn {
          from { opacity:0; transform:scale(0.95) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeClassUpdation() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [modal, setModal] = useState({ open: false, employee: null, mode: null });
  const [submitting, setSubmitting] = useState(false);
  const [busyEmpId, setBusyEmpId] = useState(null);
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "info" });

  const fetchEmployees = useCallback(async () => {
    setLoading(true); setLoadError("");
    try {
      const res = await getEmployeeClasses();
      setEmployees(normalizeEmployeesResponse(res));
    } catch (err) {
      setLoadError(err?.message || "Failed to load employee classes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const tableRows = employees.filter((e) => e.currentClass === selectedClass);
  const classStats = CLASS_OPTIONS.map((cls) => ({
    label: cls,
    count: employees.filter((e) => e.currentClass === cls).length,
  }));

  const openPromote = useCallback((emp) => setModal({ open: true, employee: emp, mode: "promote" }), []);
  const openDemote = useCallback((emp) => setModal({ open: true, employee: emp, mode: "demote" }), []);
  const closeModal = () => { if (submitting) return; setModal({ open: false, employee: null, mode: null }); };

  const handleConfirm = async (empId, newClass, isPromote) => {
    const emp = employees.find((e) => e.empId === empId);
    setSubmitting(true); setBusyEmpId(empId);
    try {
      await updateEmployeeClass(empId, newClass);
      setEmployees((prev) => prev.map((e) => e.empId === empId ? { ...e, currentClass: newClass } : e));
      setModal({ open: false, employee: null, mode: null });
      setPopup({
        open: true,
        variant: isPromote ? "success" : "error",
        title: isPromote ? "Employee Promoted" : "Employee Demoted",
        message: `${emp?.empName} has been ${isPromote ? "promoted to" : "demoted to"} ${newClass}.`,
      });
    } catch (err) {
      setPopup({ open: true, variant: "error", title: "Update Failed", message: err?.message || "Could not update this employee's class. Please try again." });
    } finally {
      setSubmitting(false); setBusyEmpId(null);
    }
  };

  const ActionRenderer = useCallback(
    makeActionRenderer(openPromote, openDemote, busyEmpId),
    [openPromote, openDemote, busyEmpId]
  );

  const columns = [
    {
      key: "empId", header: "Employee ID", field: "empId", minWidth: 140,
      render: (value) => (
        <span style={{ padding: "2px 8px", background: "#ede9fe", color: "#6d28d9", borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
          {value}
        </span>
      ),
    },
    { key: "empName", header: "Employee Name", field: "empName", minWidth: 180 },
    { key: "department", header: "Department", field: "department", minWidth: 160 },
    { key: "category", header: "Quarter Type", field: "category", minWidth: 150 },
    { key: "areaType", header: "Area Type", field: "areaType", minWidth: 160 },
    { key: "quarterNo", header: "Quarter No", field: "quarterNo", minWidth: 140 },
    {
      key: "currentClass", header: "Current Class", field: "currentClass", minWidth: 150,
      render: (value) => <ClassBadgeRenderer value={value} />,
    },
    {
      key: "action", header: "Action", field: "action",
      sortable: false, filterable: false, width: 230,
      render: (_, row) => <ActionRenderer data={row} />,
    },
  ];

  return (
    <AdminLayout
      title="Employee Class Updation"
      subtitle="Promote or demote employees across classification tiers."
    >
      {/* ── Load error ── */}
      {loadError && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
          <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-[13px] font-bold text-rose-700">Couldn't load employees</p>
            <p className="text-[12px] text-rose-600 mt-0.5">{loadError}</p>
          </div>
          <button onClick={fetchEmployees}
            className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-[12px] font-semibold text-rose-700 hover:bg-rose-50 transition-colors shrink-0">
            Retry
          </button>
        </div>
      )}

      {/* ══ Class stat cards — same style as AdminDashboard ══ */}
      <div className="grid w-full grid-cols-2 gap-3 overflow-hidden lg:grid-cols-5">
        {classStats.map(({ label, count }, i) => {
          const card = CLASS_CARD[label];
          const isActive = selectedClass === label;

          return (
            <div
              key={label}
              onClick={() => setSelectedClass(label === selectedClass ? "" : label)}
              style={{ animationDelay: `${i * 80}ms` }}
              className={`
                lms-card-land group relative overflow-hidden rounded-2xl border
                p-3 xl:p-4 cursor-pointer select-none
                shadow-[0_8px_24px_rgba(15,23,42,0.10)]
                transition-all duration-300 ease-out
                hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.18)]
                ${card.cardBg}
                ${isActive ? "ring-2 ring-white/60 ring-offset-1" : ""}
              `}
            >
              {/* Hover colour sweep — same as dashboard */}
              <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${card.hoverBg}`} />
              {/* Top-right shine */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_40%)]" />
              {/* Active extra glow */}
              {isActive && (
                <div className="pointer-events-none absolute inset-0 bg-white/10 rounded-2xl" />
              )}

              <div className="relative flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  {/* Class label */}
                  <p className="line-clamp-1 text-[clamp(0.55rem,0.85vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/80 leading-tight">
                    {label}
                  </p>
                  {/* Count */}
                  <p className="mt-2 text-[clamp(1.5rem,2.5vw,2rem)] font-bold tracking-tight leading-none text-white">
                    {loading ? "–" : count}
                  </p>
                  <p className="mt-1 text-[clamp(0.6rem,0.8vw,0.7rem)] font-medium text-white/60">
                    employees
                  </p>
                </div>

                {/* Dot indicator — active = solid, inactive = ring only */}
                <div className={`
                  shrink-0 h-3 w-3 mt-1 rounded-full ring-2 ring-white/60
                  transition-all duration-300
                  ${isActive ? "bg-white scale-125" : "bg-white/30"}
                `} />
              </div>

              {/* Active underline bar */}
              {isActive && (
                <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-full bg-white/70" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Main card ── */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] overflow-hidden">

        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100">
              <ShieldCheck size={19} className="text-[#e87722]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Employee Classification Table</h2>
              <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                Select a class card above to view its employees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedClass && (
              <span className="rounded-lg px-3 py-1 text-[12px] font-bold"
                style={{
                  background: CLASS_BADGE[selectedClass]?.bg,
                  color: CLASS_BADGE[selectedClass]?.color,
                  border: `1px solid ${CLASS_BADGE[selectedClass]?.border}`,
                }}>
                {tableRows.length} employee{tableRows.length !== 1 ? "s" : ""} in {selectedClass}
              </span>
            )}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={loading}
              className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-[13px] font-semibold text-slate-700 outline-none transition-all duration-200 cursor-pointer hover:border-orange-300 focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(232,119,34,0.12)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundImage: SELECT_ARROW, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              <option value="">Select a Class</option>
              {CLASS_OPTIONS.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
        </div>

        {/* Table area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <Loader2 size={28} className="text-[#e87722] animate-spin mb-4" />
            <p className="text-[15px] font-bold text-slate-700 mb-1">Loading employees…</p>
            <p className="text-[13px] text-slate-400 font-medium max-w-xs">
              Fetching the latest classification data from the server.
            </p>
          </div>
        ) : !selectedClass ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 border border-orange-100 mb-4">
              <Users size={28} className="text-[#e87722]" />
            </div>
            <p className="text-[15px] font-bold text-slate-700 mb-1">No class selected</p>
            <p className="text-[13px] text-slate-400 font-medium max-w-xs">
              Click a class card above or use the dropdown to load the employee list.
            </p>
          </div>
        ) : (
          <div key={selectedClass} className="lms-data-transition p-5 lg:p-7">
            <AgGridTable
              columns={columns}
              rows={tableRows}
              rowKey={(row) => row.empId}
              searchable
              pageSize={10}
              showExport={false}
              showFilter={false}
              contentAutoWidth={false}
              contentAlign="center"
              emptyMessage="No employees found in this class."
              searchPlaceholder="Search name, ID, department…"
            />
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal.open && (
        <ActionModal
          employee={modal.employee}
          mode={modal.mode}
          onClose={closeModal}
          onConfirm={handleConfirm}
          submitting={submitting}
        />
      )}

      {/* ── Popup ── */}
      <Popup
        open={popup.open}
        title={popup.title}
        message={popup.message}
        variant={popup.variant}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
        autoClose={3500}
      />
    </AdminLayout>
  );
}


