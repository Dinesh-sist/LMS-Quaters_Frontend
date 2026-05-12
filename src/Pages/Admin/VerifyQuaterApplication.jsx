import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart2, FileText, Clock, Users, CheckCircle, Eye } from "lucide-react";
import AgGridTable from "./AdminUI/Table";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockData = [
  { id: 1, appNo: 2591, empId: "E2310", empName: "SANGRAM K. SAMAL", class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 2, appNo: 2592, empId: "E2310", empName: "SANGRAM K. SAMAL", class: "SR-CLASS-I", gradDate: "2018-01-20", dateOfJoin: "1991-08-08", basic: 102060, dob: "1971-06-15", dept: "Chief Engineering" },
  { id: 3, appNo: 2592, empId: "E2312", empName: "PRODOSH K. MOHANTY", class: "SR-CLASS-I", gradDate: "2019-10-19", dateOfJoin: "1991-08-09", basic: 102060, dob: "1968-06-01", dept: "Chief Engineering" },
  { id: 4, appNo: 2601, empId: "E1945", empName: "RAJENDRA PRASAD NAYAK", class: "SR-CLASS-II", gradDate: "2020-03-15", dateOfJoin: "1995-04-10", basic: 89500, dob: "1969-11-22", dept: "Mechanical" },
  { id: 5, appNo: 2615, empId: "E2105", empName: "SURESH KUMAR MISHRA", class: "SR-CLASS-I", gradDate: "2017-06-30", dateOfJoin: "1990-01-15", basic: 115000, dob: "1965-03-08", dept: "Civil Engineering" },
  { id: 6, appNo: 2630, empId: "E1876", empName: "BIBHUTI BHUSAN DAS", class: "SR-CLASS-II", gradDate: "2021-09-10", dateOfJoin: "1998-07-20", basic: 78000, dob: "1972-09-14", dept: "Electrical" },
  { id: 7, appNo: 2645, empId: "E2450", empName: "PRADEEP KUMAR JENA", class: "SR-CLASS-I", gradDate: "2016-11-25", dateOfJoin: "1989-03-05", basic: 120000, dob: "1963-07-30", dept: "Chief Engineering" },
  { id: 8, appNo: 2660, empId: "E2311", empName: "MAMATA KUMARI PANDA", class: "SR-CLASS-II", gradDate: "2022-02-14", dateOfJoin: "2000-08-12", basic: 72000, dob: "1975-02-18", dept: "Finance" },
  { id: 9, appNo: 2675, empId: "E2198", empName: "ARUN KUMAR SAHOO", class: "SR-CLASS-I", gradDate: "2015-05-20", dateOfJoin: "1988-10-01", basic: 130000, dob: "1961-10-05", dept: "Civil Engineering" },
  { id: 10, appNo: 2578, empId: "E2279", empName: "PRODOSH K. MOHANTY", class: "SR-CLASS-I", gradDate: "2019-10-19", dateOfJoin: "1991-08-09", basic: 102060, dob: "1968-06-01", dept: "Chief Engineering" },
  { id: 11, appNo: 2588, empId: "E2220", empName: "BISWAJIT NANDA", class: "SR-CLASS-II", gradDate: "2021-04-05", dateOfJoin: "1997-06-14", basic: 84000, dob: "1970-08-22", dept: "Mechanical" },
  { id: 12, appNo: 2595, empId: "E2340", empName: "SUJATA MISHRA", class: "SR-CLASS-I", gradDate: "2016-08-30", dateOfJoin: "1990-11-01", basic: 118000, dob: "1964-12-10", dept: "Finance" },
  { id: 13, appNo: 2610, empId: "E2180", empName: "DEBASISH PATRA", class: "SR-CLASS-II", gradDate: "2023-01-18", dateOfJoin: "2001-03-25", basic: 68000, dob: "1977-05-30", dept: "Electrical" },
];

// ─── Top Header (matches reference) ──────────────────────────────────────────
function TopHeader({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: logo + title */}
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
          {/* Logo circle — matches reference's red circular emblem */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white text-xs font-bold shadow">
            PPA
          </div>
          <div>
            <div className="text-base font-bold text-slate-800 leading-tight">Paradip Port Authority</div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Quarter Management System</div>
          </div>
        </div>

        {/* Right: welcome + avatar */}
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

// ─── Side Nav (matches reference's slim sidebar) ───────────────────────────
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
    <aside
      className={`flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Section label */}
      <div className={`px-4 pt-5 pb-2 ${collapsed ? "hidden" : "block"}`}>
        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Admin Management</span>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-end px-3 py-2">
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M6 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
            />
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
                active
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <svg
                className={`h-5 w-5 shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

// ─── Stat Cards (compact, matching reference size) ────────────────────────────
const statCards = [
  { label: "Total Applications", value: mockData.length, color: "from-violet-600 to-indigo-600", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  { label: "Pending Review", value: "08", color: "from-blue-500 to-blue-600", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  { label: "Ready for Verification", value: "05", color: "from-rose-500 to-pink-600", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  { label: "Approved", value: "12", color: "from-amber-500 to-orange-500", icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> },
];

function StatCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} text-white px-5 py-4 shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold leading-none">{card.value}</p>
              <p className="mt-1.5 text-xs text-white/80 font-medium leading-tight">{card.label}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {card.icon}
              </svg>
            </div>
          </div>
          {/* decorative circles */}
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/10" />
          <div className="absolute -bottom-2 -right-1 h-9 w-9 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
const COLS = [
  { key: "appNo",      label: "APP NO",       width: 80 },
  { key: "empId",      label: "EMP ID",       width: 90 },
  { key: "empName",    label: "EMP NAME",     flex: true },
  { key: "class",      label: "CLASS",        width: 120 },
  { key: "gradDate",   label: "GRAD DATE",    width: 105 },
  { key: "dateOfJoin", label: "DATE OF JOIN", width: 115 },
  { key: "basic",      label: "BASIC (₹)",    width: 110 },
  { key: "dob",        label: "DATE OF BIRTH",width: 115 },
  { key: "dept",       label: "DEPT",         flex: true },
  { key: "action",     label: "ACTION",       width: 85 },
];

function classTag(val) {
  const color = val.includes("CLASS-I") && !val.includes("II")
    ? "bg-indigo-100 text-indigo-700"
    : "bg-teal-100 text-teal-700";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${color}`}>
      {val}
    </span>
  );
}

function Table({ rows }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-indigo-700 text-white">
            <th className="px-3 py-2.5 text-center font-semibold text-xs tracking-wide w-12">S.NO</th>
            {COLS.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2.5 text-center font-semibold text-xs tracking-wide whitespace-nowrap"
                style={col.flex ? {} : { width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
          {/* Filter row */}
          <tr className="bg-white border-b border-slate-100">
            <td />
            {COLS.map((col) => (
              <td key={col.key} className="px-2 py-1.5">
                {col.key !== "action" ? (
                  <div className="flex items-center gap-1">
                    <input
                      className="w-full text-xs border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                      placeholder=""
                    />
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
              <td className="px-3 py-2.5 text-center text-xs text-slate-500">{i + 1}</td>
              {COLS.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-center whitespace-nowrap">
                  {col.key === "action" ? (
                    <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  ) : col.key === "class" ? (
                    classTag(row[col.key])
                  ) : col.key === "empName" ? (
                    <span className="font-semibold text-slate-800 text-xs">{row[col.key]}</span>
                  ) : col.key === "basic" ? (
                    <span className="text-xs text-slate-700">{row[col.key].toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="text-xs text-slate-600">{row[col.key]}</span>
                  )}
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
export default function VerifyQuarterApplications() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = mockData.filter((r) =>
    [r.empName, r.empId, r.dept].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

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
            <h1 className="text-2xl font-bold text-slate-900">Verify Quarter Applications</h1>
            <p className="mt-0.5 text-sm text-slate-500">Land Data Management System — Committee Review</p>
          </div>

          {/* Stat Cards */}
          <StatCards />

          {/* Table card */}
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            {/* Table toolbar */}
            

            {/* Table */}
            <AgGridTable columns={COLS} rows={filtered} />

            {/* Pagination row */}
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
