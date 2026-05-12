import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AgGridTable from "./AdminUI/Table";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockData = [
  {
    id: 1, appNo: 2591, empId: "E2310", empName: "SANGRAM K. SAMAL",
    class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08",
    basic: 102060, dob: "1971-06-15", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-12", currentQtyType: "TYPE-A",
    reqQtr: "A-04", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "Yes", proofFile: "proof_001.pdf", reqDate: "2024-03-10",
    rosterNo: "RST-101", result: "Pending",
  },
  {
    id: 2, appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL",
    class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08",
    basic: 102060, dob: "1971-06-15", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-12", currentQtyType: "TYPE-A",
    reqQtr: "A-04", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "No", proofFile: "proof_002.pdf", reqDate: "2024-03-11",
    rosterNo: "RST-102", result: "Approved",
  },
  {
    id: 3, appNo: 2578, empId: "E2279", empName: "PRODOSH K. MOHANTY",
    class: "SR-CLASS-I", gradDate: "2019-10-19", dateOfJoin: "1991-08-09",
    basic: 102060, dob: "1968-06-01", dept: "Chief Engineering",
    casteId: "OBC", currentQtr: "C-05", currentQtyType: "TYPE-B",
    reqQtr: "B-08", reqQtrLocation: "Colony-2", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_003.pdf", reqDate: "2024-03-12",
    rosterNo: "RST-103", result: "Rejected",
  },
  {
    id: 4, appNo: 2601, empId: "E1945", empName: "RAJENDRA PRASAD NAYAK",
    class: "SR-CLASS-II", gradDate: "2020-03-15", dateOfJoin: "1995-04-10",
    basic: 89500, dob: "1969-11-22", dept: "Mechanical",
    casteId: "SC", currentQtr: "D-11", currentQtyType: "TYPE-C",
    reqQtr: "C-02", reqQtrLocation: "Colony-3", reqQtrType: "TYPE-A",
    exchange: "No", proofFile: "proof_004.pdf", reqDate: "2024-03-13",
    rosterNo: "RST-104", result: "Pending",
  },
  {
    id: 5, appNo: 2615, empId: "E2105", empName: "SURESH KUMAR MISHRA",
    class: "SR-CLASS-I", gradDate: "2017-06-30", dateOfJoin: "1990-01-15",
    basic: 115000, dob: "1965-03-08", dept: "Civil Engineering",
    casteId: "GEN", currentQtr: "A-03", currentQtyType: "TYPE-A",
    reqQtr: "A-07", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-B",
    exchange: "Yes", proofFile: "proof_005.pdf", reqDate: "2024-03-14",
    rosterNo: "RST-105", result: "Approved",
  },
  {
    id: 6, appNo: 2630, empId: "E1876", empName: "BIBHUTI BHUSAN DAS",
    class: "SR-CLASS-II", gradDate: "2021-09-10", dateOfJoin: "1998-07-20",
    basic: 78000, dob: "1972-09-14", dept: "Electrical",
    casteId: "ST", currentQtr: "E-07", currentQtyType: "TYPE-B",
    reqQtr: "D-03", reqQtrLocation: "Colony-4", reqQtrType: "TYPE-C",
    exchange: "No", proofFile: "proof_006.pdf", reqDate: "2024-03-15",
    rosterNo: "RST-106", result: "Pending",
  },
  {
    id: 7, appNo: 2645, empId: "E2450", empName: "PRADEEP KUMAR JENA",
    class: "SR-CLASS-I", gradDate: "2016-11-25", dateOfJoin: "1989-03-05",
    basic: 120000, dob: "1963-07-30", dept: "Chief Engineering",
    casteId: "GEN", currentQtr: "B-09", currentQtyType: "TYPE-A",
    reqQtr: "A-01", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_007.pdf", reqDate: "2024-03-16",
    rosterNo: "RST-107", result: "Approved",
  },
  {
    id: 8, appNo: 2660, empId: "E2311", empName: "MAMATA KUMARI PANDA",
    class: "SR-CLASS-II", gradDate: "2022-02-14", dateOfJoin: "2000-08-12",
    basic: 72000, dob: "1975-02-18", dept: "Finance",
    casteId: "OBC", currentQtr: "F-02", currentQtyType: "TYPE-C",
    reqQtr: "E-05", reqQtrLocation: "Colony-5", reqQtrType: "TYPE-B",
    exchange: "No", proofFile: "proof_008.pdf", reqDate: "2024-03-17",
    rosterNo: "RST-108", result: "Rejected",
  },
  {
    id: 9, appNo: 2675, empId: "E2198", empName: "ARUN KUMAR SAHOO",
    class: "SR-CLASS-I", gradDate: "2015-05-20", dateOfJoin: "1988-10-01",
    basic: 130000, dob: "1961-10-05", dept: "Civil Engineering",
    casteId: "GEN", currentQtr: "A-06", currentQtyType: "TYPE-A",
    reqQtr: "A-09", reqQtrLocation: "Colony-1", reqQtrType: "TYPE-A",
    exchange: "Yes", proofFile: "proof_009.pdf", reqDate: "2024-03-18",
    rosterNo: "RST-109", result: "Approved",
  },
  {
    id: 10, appNo: 2688, empId: "E2012", empName: "SUSHANT KUMAR PATI",
    class: "SR-CLASS-II", gradDate: "2023-01-05", dateOfJoin: "2002-06-15",
    basic: 65000, dob: "1978-04-22", dept: "HR",
    casteId: "SC", currentQtr: "G-01", currentQtyType: "TYPE-C",
    reqQtr: "F-04", reqQtrLocation: "Colony-6", reqQtrType: "TYPE-C",
    exchange: "No", proofFile: "proof_010.pdf", reqDate: "2024-03-19",
    rosterNo: "RST-110", result: "Pending",
  },
];

// ─── Shared: Top Header ───────────────────────────────────────────────────────
function TopHeader({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold shadow">
            PPA
          </div>
          <div>
            <div className="text-base font-bold text-slate-800 leading-tight">Paradip Port Authority</div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Quarter Management System</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden sm:block">Welcome <span className="font-bold text-slate-800">Admin</span></span>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm shadow">
            A
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Shared: Side Nav ─────────────────────────────────────────────────────────
const navItems = [
  {
    label: "Verify Quarter Applications",
    to: "/admin/verify",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    label: "Status of Applications",
    to: "/admin/status",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17v-6m4 6V7m4 10V4M5 19h14a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z" />,
  },
  {
    label: "History of Allotment Committee",
    to: "/admin/history",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
];

function SideNav({ collapsed, onToggle }) {
  const location = useLocation();
  return (
    <aside className={`flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className={`px-4 pt-5 pb-2 ${collapsed ? "hidden" : "block"}`}>
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Admin Management</span>
      </div>
      <div className="flex items-center justify-end px-3 py-2">
        <button onClick={onToggle} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M6 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
        </button>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active ? "bg-indigo-50 text-indigo-700 border border-indigo-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg className={`h-5 w-5 shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────
const approved = mockData.filter((r) => r.result === "Approved").length;
const pending  = mockData.filter((r) => r.result === "Pending").length;
const rejected = mockData.filter((r) => r.result === "Rejected").length;

const statCards = [
  {
    label: "Total Applications", value: mockData.length,
    color: "from-violet-600 to-indigo-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  },
  {
    label: "Approved", value: approved,
    color: "from-emerald-500 to-green-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Pending", value: pending,
    color: "from-amber-400 to-orange-500",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    label: "Rejected", value: rejected,
    color: "from-rose-500 to-pink-600",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => (
        <div key={card.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} text-white px-5 py-4 shadow-md`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold leading-none">{card.value}</p>
              <p className="mt-1.5 text-xs text-white/80 font-medium leading-tight">{card.label}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{card.icon}</svg>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 -right-1 h-9 w-9 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// ─── Cell Renderers ───────────────────────────────────────────────────────────
function ResultBadge({ value }) {
  const styles = {
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected:  "bg-rose-100 text-rose-700",
    Pending:   "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${styles[value] || "bg-slate-100 text-slate-600"}`}>
      {value}
    </span>
  );
}

function ClassBadge({ value }) {
  const color = value.includes("CLASS-I") && !value.includes("II")
    ? "bg-indigo-100 text-indigo-700"
    : "bg-teal-100 text-teal-700";
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${color}`}>{value}</span>;
}

function ProofBtn({ value }) {
  return (
    <button
      onClick={() => alert(`Opening: ${value}`)}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2 py-0.5 rounded-lg transition-colors whitespace-nowrap"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      {value}
    </button>
  );
}

// ─── Table columns definition ─────────────────────────────────────────────────
const COLS = [
  { key: "appNo",          label: "APP NO" },
  { key: "empId",          label: "EMP ID" },
  { key: "empName",        label: "EMP NAME" },
  { key: "class",          label: "CLASS" },
  { key: "gradDate",       label: "GRAD DATE" },
  { key: "dateOfJoin",     label: "DATE OF JOIN" },
  { key: "basic",          label: "BASIC (₹)" },
  { key: "dob",            label: "DATE OF BIRTH" },
  { key: "dept",           label: "DEPT" },
  { key: "casteId",        label: "CASTE" },
  { key: "currentQtr",     label: "CURR QTR" },
  { key: "currentQtyType", label: "CURR TYPE" },
  { key: "reqQtr",         label: "REQ QTR" },
  { key: "reqQtrLocation", label: "REQ LOCATION" },
  { key: "reqQtrType",     label: "REQ TYPE" },
  { key: "exchange",       label: "EXCHANGE" },
  { key: "proofFile",      label: "PROOF FILE" },
  { key: "reqDate",        label: "REQ DATE" },
  { key: "rosterNo",       label: "ROSTER NO" },
  { key: "result",         label: "RESULT" },
];

function renderCell(col, row) {
  const val = row[col.key];
  switch (col.key) {
    case "result":    return <ResultBadge value={val} />;
    case "class":     return <ClassBadge value={val} />;
    case "proofFile": return <ProofBtn value={val} />;
    case "empName":   return <span className="font-semibold text-slate-800 text-xs">{val}</span>;
    case "basic":     return <span className="text-xs text-slate-700">{val.toLocaleString("en-IN")}</span>;
    case "exchange":  return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${val === "Yes" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"}`}>
        {val}
      </span>
    );
    default: return <span className="text-xs text-slate-600 whitespace-nowrap">{val}</span>;
  }
}

// ─── Table component ──────────────────────────────────────────────────────────
function Table({ rows }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse" style={{ minWidth: 2000 }}>
        <thead>
          <tr className="bg-indigo-700 text-white">
            <th className="px-3 py-2.5 text-center font-semibold text-xs tracking-wide w-10 sticky left-0 bg-indigo-700 z-10">S.NO</th>
            {COLS.map((col) => (
              <th key={col.key} className="px-3 py-2.5 text-center font-semibold text-xs tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
          {/* Filter row */}
          <tr className="bg-white border-b border-slate-100">
            <td className="sticky left-0 bg-white z-10" />
            {COLS.map((col) => (
              <td key={col.key} className="px-2 py-1.5">
                {col.key !== "result" && col.key !== "proofFile" ? (
                  <div className="flex items-center gap-1">
                    <input className="w-full text-xs border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                    <svg className="h-3 w-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 10h10M10 16h4" />
                    </svg>
                  </div>
                ) : null}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-slate-100 transition-colors hover:bg-indigo-50/40 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
            >
              <td className="px-3 py-2.5 text-center text-xs text-slate-500 sticky left-0 bg-inherit z-10">{i + 1}</td>
              {COLS.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-center">
                  {renderCell(col, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StatusOfApplications() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [filterResult, setFilterResult] = useState("All");

  const filtered = mockData.filter((r) => {
    const matchResult = filterResult === "All" || r.result === filterResult;
    const q = search.trim().toLowerCase();
    if (!q) return matchResult;
    return matchResult && [r.empName, r.empId, r.dept, r.rosterNo]
      .some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 font-sans">
      {/* Top Header */}
      <TopHeader onOpenMenu={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex h-full">
          <SideNav collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="w-64 bg-white shadow-xl">
              <SideNav collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
            <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-indigo-50/60 px-7 py-6">
          {/* Page heading */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">Status of Applications</h1>
            <p className="mt-0.5 text-sm text-slate-500">Land Data Management System — Application Tracker</p>
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Table card */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Toolbar */}
            

            {/* Table */}
                  <AgGridTable columns={COLS} rows={filtered} renderCell={renderCell} />
            {/* Pagination */}
            
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">© 2026 Paradip Port Authority</span>
        <span className="text-xs text-slate-400">Quarter Management System</span>
      </footer>
    </div>
  );
}
