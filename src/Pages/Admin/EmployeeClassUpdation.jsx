import { useState, useCallback } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import AgGridTable from "../../Components/Table";
import Popup from "../../Components/Popup";

// ─── Static mock data ────────────────────────────────────────────────────────

const SEED_EMPLOYEES = [
  // Class 1
  { empId: "EMP001", empName: "Arjun Krishnamurthy",    department: "Civil Engineering",       currentClass: "Class 1" },
  { empId: "EMP002", empName: "Priya Subramaniam",       department: "Electrical Engineering",  currentClass: "Class 1" },
  { empId: "EMP003", empName: "Ramesh Venkataraman",     department: "Administration",           currentClass: "Class 1" },
  { empId: "EMP004", empName: "Deepa Narayanan",         department: "Finance",                 currentClass: "Class 1" },
  { empId: "EMP005", empName: "Vijay Annamalai",         department: "Human Resources",         currentClass: "Class 1" },
  { empId: "EMP006", empName: "Kavitha Rajan",           department: "IT & Systems",            currentClass: "Class 1" },
  { empId: "EMP007", empName: "Suresh Iyer",             department: "Operations",              currentClass: "Class 1" },
  { empId: "EMP008", empName: "Meena Chandrasekaran",    department: "Legal",                   currentClass: "Class 1" },
  // Class 2
  { empId: "EMP101", empName: "Balaji Murugan",          department: "Civil Engineering",       currentClass: "Class 2" },
  { empId: "EMP102", empName: "Saranya Pillai",          department: "Electrical Engineering",  currentClass: "Class 2" },
  { empId: "EMP103", empName: "Gopal Sundarajan",        department: "Administration",           currentClass: "Class 2" },
  { empId: "EMP104", empName: "Anitha Selvam",           department: "Finance",                 currentClass: "Class 2" },
  { empId: "EMP105", empName: "Karthik Balasubramanian", department: "Human Resources",         currentClass: "Class 2" },
  { empId: "EMP106", empName: "Lakshmi Raghunathan",     department: "IT & Systems",            currentClass: "Class 2" },
  { empId: "EMP107", empName: "Senthil Kumar",           department: "Operations",              currentClass: "Class 2" },
  { empId: "EMP108", empName: "Padmavathi Natarajan",    department: "Legal",                   currentClass: "Class 2" },
  // Class 3
  { empId: "EMP201", empName: "Dinesh Prabakaran",       department: "Civil Engineering",       currentClass: "Class 3" },
  { empId: "EMP202", empName: "Revathi Sivasubramanian", department: "Electrical Engineering",  currentClass: "Class 3" },
  { empId: "EMP203", empName: "Mahesh Arunachalam",      department: "Administration",           currentClass: "Class 3" },
  { empId: "EMP204", empName: "Geetha Rajagopalan",      department: "Finance",                 currentClass: "Class 3" },
  { empId: "EMP205", empName: "Muthu Pandian",           department: "Human Resources",         currentClass: "Class 3" },
  { empId: "EMP206", empName: "Nirmala Venkatesan",      department: "IT & Systems",            currentClass: "Class 3" },
  { empId: "EMP207", empName: "Prakash Durai",           department: "Operations",              currentClass: "Class 3" },
  { empId: "EMP208", empName: "Suganya Mohan",           department: "Legal",                   currentClass: "Class 3" },
  // Class 4
  { empId: "EMP301", empName: "Kannan Thangavelu",       department: "Civil Engineering",       currentClass: "Class 4" },
  { empId: "EMP302", empName: "Selvi Arumugam",          department: "Electrical Engineering",  currentClass: "Class 4" },
  { empId: "EMP303", empName: "Ravi Shankar",            department: "Administration",           currentClass: "Class 4" },
  { empId: "EMP304", empName: "Vasantha Kumari",         department: "Finance",                 currentClass: "Class 4" },
  { empId: "EMP305", empName: "Mani Elumalai",           department: "Human Resources",         currentClass: "Class 4" },
  { empId: "EMP306", empName: "Chitra Gunasekaran",      department: "IT & Systems",            currentClass: "Class 4" },
  { empId: "EMP307", empName: "Periasamy Ramasamy",      department: "Operations",              currentClass: "Class 4" },
  { empId: "EMP308", empName: "Indirani Palanisamy",     department: "Legal",                   currentClass: "Class 4" },
];

const CLASS_OPTIONS = ["Class 1", "Class 2", "Class 3", "Class 4"];
// Class 1 = highest (rank 1), Class 4 = lowest (rank 4)
const CLASS_RANK = { "Class 1": 1, "Class 2": 2, "Class 3": 3, "Class 4": 4 };

const CLASS_BADGE = {
  "Class 1": { bg: "#ede9fe", color: "#6d28d9", border: "#c4b5fd" },
  "Class 2": { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
  "Class 3": { bg: "#ffedd5", color: "#c2410c", border: "#fed7aa" },
  "Class 4": { bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
};

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

// ─── Class badge cell renderer (for AgGrid) ──────────────────────────────────

function ClassBadgeRenderer({ value }) {
  const style = CLASS_BADGE[value] || CLASS_BADGE["Class 4"];
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}>
      {value}
    </span>
  );
}

// ─── Action cell renderer (for AgGrid) ───────────────────────────────────────
// We pass callbacks via a closure generated per render cycle.

function makeActionRenderer(onPromote, onDemote) {
  return function ActionRenderer({ data }) {
    if (!data) return null;
    const rank = CLASS_RANK[data.currentClass];
    const canPromote = rank > 1;
    const canDemote  = rank < 4;

    const baseBtn = {
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
      border: "1px solid", cursor: "pointer", transition: "opacity 0.15s",
      whiteSpace: "nowrap",
    };

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: "100%" }}>
        {/* Promote */}
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
            <circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/>
          </svg>
          Promote
        </button>

        {/* Demote */}
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
            <circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>
          </svg>
          Demote
        </button>
      </div>
    );
  };
}

// ─── Action Modal ─────────────────────────────────────────────────────────────

function ActionModal({ employee, mode, onClose, onConfirm }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [error, setError] = useState("");

  if (!employee) return null;

  const currentRank    = CLASS_RANK[employee.currentClass];
  const isPromote      = mode === "promote";
  const availableClasses = CLASS_OPTIONS.filter((cls) =>
    isPromote ? CLASS_RANK[cls] < currentRank : CLASS_RANK[cls] > currentRank
  );

  const handleConfirm = () => {
    if (!selectedClass) {
      setError(`Please select a class to ${mode} this employee.`);
      return;
    }
    onConfirm(employee.empId, selectedClass, isPromote);
    onClose();
  };

  return (
    <>
      {/* Blurred backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-slate-900/40"
        onClick={onClose}
      />

      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-3xl bg-white shadow-[0_32px_64px_rgba(15,23,42,0.22)] border border-slate-200"
          style={{ animation: "ecsModalIn 0.18s ease-out" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className={`flex items-center justify-between gap-3 rounded-t-3xl px-6 py-4 border-b ${
            isPromote
              ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100"
              : "bg-gradient-to-r from-rose-50 to-red-50 border-rose-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isPromote ? "bg-emerald-100" : "bg-rose-100"}`}>
                {isPromote
                  ? <ArrowUpCircle size={20} className="text-emerald-600" />
                  : <ArrowDownCircle size={20} className="text-rose-600" />
                }
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {isPromote ? "Promote Employee" : "Demote Employee"}
                </p>
                <h3 className="text-base font-bold text-slate-900">
                  Class {isPromote ? "Upgrade" : "Downgrade"}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-6">
            {/* Employee identity card */}
            <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee Name</p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-800 leading-snug">{employee.empName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-800 font-mono">{employee.empId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</p>
                  <p className="mt-1 text-[13px] font-semibold text-slate-800 leading-snug">{employee.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Class</p>
                  <span className="mt-1 inline-block rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                    style={{
                      background: CLASS_BADGE[employee.currentClass]?.bg,
                      color: CLASS_BADGE[employee.currentClass]?.color,
                      border: `1px solid ${CLASS_BADGE[employee.currentClass]?.border}`,
                    }}
                  >
                    {employee.currentClass}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction */}
            <p className="mb-3 text-[13px] text-slate-600 font-medium">
              {isPromote
                ? "Select a class to promote this employee to:"
                : "Select a class to demote this employee to:"}
            </p>

            {/* Target class pill selector */}
            <div className="flex flex-wrap gap-2 mb-1">
              {availableClasses.map((cls) => {
                const isSelected = selectedClass === cls;
                const badge = CLASS_BADGE[cls];
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => { setSelectedClass(cls); setError(""); }}
                    className="flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-semibold transition-all duration-150"
                    style={isSelected ? {
                      background: badge.bg,
                      color: badge.color,
                      borderColor: badge.border,
                      boxShadow: `0 0 0 3px ${badge.bg}`,
                    } : {
                      background: "#fff",
                      color: "#475569",
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: isSelected ? badge.color : "#cbd5e1" }} />
                    {cls}
                    {CLASS_RANK[cls] === 1 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider ml-1" style={{ color: "#7c3aed" }}>Highest</span>
                    )}
                    {CLASS_RANK[cls] === 4 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider ml-1 text-slate-400">Lowest</span>
                    )}
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-2 text-[12px] font-semibold text-rose-600">{error}</p>
            )}

            {/* Direction preview */}
            {selectedClass && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    background: CLASS_BADGE[employee.currentClass]?.bg,
                    color: CLASS_BADGE[employee.currentClass]?.color,
                    border: `1px solid ${CLASS_BADGE[employee.currentClass]?.border}`,
                  }}
                >
                  {employee.currentClass}
                </span>
                <span className="text-slate-400 font-bold mx-1">→</span>
                <span className="rounded-lg px-2.5 py-0.5 text-[11px] font-bold"
                  style={{
                    background: CLASS_BADGE[selectedClass]?.bg,
                    color: CLASS_BADGE[selectedClass]?.color,
                    border: `1px solid ${CLASS_BADGE[selectedClass]?.border}`,
                  }}
                >
                  {selectedClass}
                </span>
                <span className="ml-auto text-[11px] font-semibold text-slate-400">
                  {isPromote ? "Promotion" : "Demotion"}
                </span>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 rounded-b-3xl border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-6 py-2 rounded-xl text-[13px] font-bold text-white transition-all duration-150 ${
                isPromote
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                  : "bg-rose-600 hover:bg-rose-700 shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
              }`}
            >
              Confirm {isPromote ? "Promotion" : "Demotion"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ecsModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployeeClassUpdation() {
  const [employees, setEmployees]   = useState(SEED_EMPLOYEES);
  const [selectedClass, setSelectedClass] = useState("");
  const [modal, setModal]           = useState({ open: false, employee: null, mode: null });
  const [popup, setPopup]           = useState({ open: false, title: "", message: "", variant: "info" });

  // ── Filtered rows for the selected class ──────────────────────────────────
  const tableRows = employees.filter((e) => e.currentClass === selectedClass);

  // ── Stats per class ───────────────────────────────────────────────────────
  const classStats = CLASS_OPTIONS.map((cls) => ({
    label: cls,
    count: employees.filter((e) => e.currentClass === cls).length,
  }));

  // ── Modal open handlers (stable refs for the cell renderer closure) ───────
  const openPromote = useCallback((emp) =>
    setModal({ open: true, employee: emp, mode: "promote" }), []);
  const openDemote  = useCallback((emp) =>
    setModal({ open: true, employee: emp, mode: "demote"  }), []);
  const closeModal  = () => setModal({ open: false, employee: null, mode: null });

  // ── Confirm class change ──────────────────────────────────────────────────
  const handleConfirm = (empId, newClass, isPromote) => {
    const emp = employees.find((e) => e.empId === empId);
    setEmployees((prev) =>
      prev.map((e) => e.empId === empId ? { ...e, currentClass: newClass } : e)
    );
    setPopup({
      open: true,
      variant: isPromote ? "success" : "error",
      title: isPromote ? "Employee Promoted" : "Employee Demoted",
      message: `${emp?.empName} has been ${isPromote ? "promoted to" : "demoted to"} ${newClass}.`,
    });
  };

  // ── AgGrid column definitions ─────────────────────────────────────────────
  // The action renderer is re-created only when the callbacks change (they're
  // stable useCallbacks so this effectively never re-creates unnecessarily).
  const ActionRenderer = useCallback(
    makeActionRenderer(openPromote, openDemote),
    [openPromote, openDemote]
  );

  const columns = [
    {
      key: "empId",
      header: "Employee ID",
      field: "empId",
      render: (value) => (
        <span style={{
          padding: "2px 8px", background: "#ede9fe", color: "#6d28d9",
          borderRadius: 6, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
        }}>
          {value}
        </span>
      ),
    },
    { key: "empName",      header: "Employee Name", field: "empName"      },
    { key: "department",   header: "Department",    field: "department"    },
    {
      key: "currentClass",
      header: "Current Class",
      field: "currentClass",
      render: (value) => <ClassBadgeRenderer value={value} />,
    },
    {
      key: "action",
      header: "Action",
      field: "action",
      sortable: false,
      filterable: false,
      width: 230,
      render: (_, row) => <ActionRenderer data={row} />,
    },
  ];

  return (
    <AdminLayout
      title="Employee Class Updation"
      subtitle="Promote or demote employees across classification tiers."
    >
      {/* ── Class stat cards ── */}
      <div className="lms-page-transition grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        {classStats.map(({ label, count }, i) => {
          const badge  = CLASS_BADGE[label];
          const active = selectedClass === label;
          return (
            <div
              key={label}
              onClick={() => setSelectedClass(label)}
              className="lms-card-land cursor-pointer rounded-2xl border p-4 transition-all duration-150 select-none"
              style={{
                borderColor: active ? badge.color : badge.border,
                background: badge.bg,
                boxShadow: active ? `0 0 0 3px ${badge.color}28` : "none",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-3"
                style={{ color: badge.color }}
              >
                {label}
              </p>
              <p className="text-2xl font-bold" style={{ color: badge.color }}>{count}</p>
              <p className="mt-0.5 text-[11px] font-medium" style={{ color: badge.color, opacity: 0.7 }}>employees</p>
            </div>
          );
        })}
      </div>

      {/* ── Main card ── */}
      <div className="lms-data-transition rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] overflow-hidden">

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

          {/* Class selector dropdown */}
          <div className="flex items-center gap-3">
            {selectedClass && (
              <span className="rounded-lg px-3 py-1 text-[12px] font-bold"
                style={{
                  background: CLASS_BADGE[selectedClass]?.bg,
                  color: CLASS_BADGE[selectedClass]?.color,
                  border: `1px solid ${CLASS_BADGE[selectedClass]?.border}`,
                }}
              >
                {tableRows.length} employee{tableRows.length !== 1 ? "s" : ""} in {selectedClass}
              </span>
            )}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-[13px] font-semibold text-slate-700 outline-none transition-all duration-200 cursor-pointer hover:border-orange-300 focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(232,119,34,0.12)]"
              style={{
                backgroundImage: SELECT_ARROW,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="">Select a Class</option>
              {CLASS_OPTIONS.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Table area ── */}
        {!selectedClass ? (
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

      {/* ── Action Modal ── */}
      {modal.open && (
        <ActionModal
          employee={modal.employee}
          mode={modal.mode}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      )}

      {/* ── Popup (toast replacement) ── */}
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