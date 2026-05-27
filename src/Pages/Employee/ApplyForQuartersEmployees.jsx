import { useEffect, useState } from "react";
import TopHeader from "../../Components/TopHeader";
import Footer from "../../Components/Footer";
import Sidebar from "./EmployeeUI/EmployeeSideNav";
import { request } from "../../api";
import { getUser } from "../../auth";

const inputCls = (focused, id) =>
  `w-full box-border rounded-[7px] px-3 py-[9px] text-[13.5px] text-slate-800 bg-white outline-none transition-all duration-200 font-[inherit]
  ${focused === id
    ? "border-[1.5px] border-orange-400 shadow-[0_0_0_3px_rgba(232,119,34,0.12)]"
    : "border-[1.5px] border-[#e2e8f0]"
  }`;

const selectCls = (focused, id) =>
  `${inputCls(focused, id)} appearance-none bg-no-repeat bg-[right_12px_center] pr-9 cursor-pointer`;

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

export default function ApplyForQuartersEmployees() {
  const user = getUser();
  const [focused, setFocused] = useState(null);

  const [hodDepts, setHodDepts] = useState([]);
  const [hodDeptsError, setHodDeptsError] = useState("");
  const [quarters, setQuarters] = useState([]);
  const [quartersError, setQuartersError] = useState("");
  const [classId, setClassId] = useState(null);

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
    search: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredQuarters = quarters
    .filter((q) => Boolean(q?.IsAvailable))
    .filter((q) => {
      const s = emp.search.trim().toLowerCase();
      if (!s) return true;
      return (
        String(q?.QuarterNo || "").toLowerCase().includes(s) ||
        String(q?.QuarterType || "").toLowerCase().includes(s) ||
        String(q?.Location || "").toLowerCase().includes(s)
      );
    });

  const totalPages = Math.max(1, Math.ceil(filteredQuarters.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageItems = filteredQuarters.slice(pageStart, pageStart + pageSize);

  // Load employee profile once on mount
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
        }));
      } catch (err) {
        console.error("Employee profile error:", err);
      }
    }

    loadEmployeeProfile();
    return () => { cancelled = true; };
  }, []);

  // Load HOD departments
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
        if (!cancelled) setHodDepts(depts);
      } catch (err) {
        if (!cancelled) setHodDeptsError(err?.message || "Failed to load HOD departments");
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
        const data = await request("/api/estate-quarters/vacant?classId=" + classId, {
          auth: true,
        });
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) setQuarters(items);
      } catch (err) {
        if (!cancelled) setQuartersError(err?.message || "Failed to load quarters");
      }
    }

    loadQuarters();
    return () => { cancelled = true; };
  }, [classId]); // ✅ primitive dependency — React detects null → 1 change reliably

  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#e6eeff_0%,#f5f8ff_36%,#edf3ff_100%)]">
      <div className="h-full bg-[#f7faff] overflow-hidden flex flex-col">
        <TopHeader
          role="newuser"
          description="Employee Services"
          welcomeName={user?.name || user?.username || "Employee"}
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f4f6fa]">
            <main className="flex-1 overflow-y-auto px-9 py-7">
              <div className="mb-[22px]">
                <h1 className="text-2xl font-bold text-slate-900">
                  Application Form for Quarter Allotment for Employees
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Land Data Management System - Employee Application
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)] px-8 py-7">
              <div className="grid items-center gap-5 mb-4" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">Name of the Employee:</label>
                <div className="text-[13.5px] text-slate-800">{emp.employeeName || "-"}</div>
              </div>

              <div className="grid items-center gap-5 mb-4" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">Employee ID:</label>
                <div className="text-[13.5px] text-slate-800">{emp.employeeId || "-"}</div>
              </div>

              <div className="grid items-center gap-5 mb-4" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">Class of Employee:</label>
                <div className="text-[13.5px] text-slate-800">{emp.classOfEmployee || "-"}</div>
              </div>

              <div className="grid items-center gap-5 mb-5" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">Caste of Employee:</label>
                <div className="text-[13.5px] text-slate-800">{emp.casteOfEmployee || "-"}</div>
              </div>

              <div className="grid items-center gap-5 mb-5" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">Department :</label>
                <select
                  value={emp.department}
                  onChange={(e) => setEmp((s) => ({ ...s, department: e.target.value }))}
                  className={`${selectCls(focused, "emp_department")} max-w-[420px]`}
                  style={{ backgroundImage: SELECT_ARROW }}
                  onFocus={() => setFocused("emp_department")}
                  onBlur={() => setFocused(null)}
                >
                  <option value="">Choose a Department</option>
                  {hodDepts.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid items-center gap-5 mb-3" style={{ gridTemplateColumns: "260px 1fr" }}>
                <label className="text-[13.5px] font-semibold text-slate-800">
                  Reason for quarter exchange (Only for exchange) :
                </label>
                <div className="flex flex-col gap-3 max-w-[520px]">
                  <select
                    value={emp.reason}
                    onChange={(e) => setEmp((s) => ({ ...s, reason: e.target.value }))}
                    className={selectCls(focused, "emp_reason")}
                    style={{ backgroundImage: SELECT_ARROW }}
                    onFocus={() => setFocused("emp_reason")}
                    onBlur={() => setFocused(null)}
                  >
                    <option value="">Choose a Reason</option>
                    <option value="fresh">Fresh Allotment</option>
                    <option value="exchange">Exchange</option>
                    <option value="renewal">Renewal</option>
                  </select>

                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={emp.exchangeReason}
                      onChange={(e) => setEmp((s) => ({ ...s, exchangeReason: e.target.value }))}
                      className={`${inputCls(focused, "emp_exchangeReason")} flex-1`}
                      onFocus={() => setFocused("emp_exchangeReason")}
                      onBlur={() => setFocused(null)}
                      placeholder=""
                    />
                    <label className="text-[#1d4ed8] font-bold cursor-pointer whitespace-nowrap">
                      File Upload
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setEmp((s) => ({ ...s, attachment: e.target.files?.[0] || null }))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {hodDeptsError ? (
                <div className="text-[12px] font-semibold text-rose-600 mb-3">{hodDeptsError}</div>
              ) : null}

              <div className="border-t-[1.5px] border-dashed border-[#e2e8f0] my-6" />

              <div className="text-[18px] font-extrabold text-[#0284c7] mb-4">Choose from Vacant Quarters Listing</div>

              {quartersError ? (
                <div className="text-[12px] font-semibold text-rose-600 mb-3">{quartersError}</div>
              ) : null}

              <div className="flex items-center justify-end mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-slate-700">Search:</span>
                  <input
                    type="text"
                    value={emp.search}
                    onChange={(e) => {
                      const next = e.target.value;
                      setEmp((s) => ({ ...s, search: next }));
                      setPage(1);
                    }}
                    className={`${inputCls(focused, "emp_search")} w-[260px]`}
                    onFocus={() => setFocused("emp_search")}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-[#e2e8f0] rounded-lg">
                <table className="w-full text-[13px]">
                  <thead className="bg-slate-50">
                    <tr className="text-slate-700">
                      <th className="text-left font-bold py-3 px-4 w-[140px]">Choose Quarter</th>
                      <th className="text-left font-bold py-3 px-4 w-[100px]">Sl No</th>
                      <th className="text-left font-bold py-3 px-4">Quarter Type</th>
                      <th className="text-left font-bold py-3 px-4">Area Type</th>
                      <th className="text-left font-bold py-3 px-4">Quarter Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 px-4 text-center text-[13px] text-slate-400">
                          {classId ? "No vacant quarters available" : "Loading..."}
                        </td>
                      </tr>
                    ) : (
                      pageItems.map((q, idx) => (
                        <tr key={q?.Id ?? idx} className="border-t border-[#e2e8f0]">
                          <td className="py-3 px-4 bg-slate-50/60">
                            <input
                              type="radio"
                              name="chooseQuarter"
                              checked={String(emp.selectedQuarterId) === String(q?.Id)}
                              onChange={() =>
                                setEmp((s) => ({ ...s, selectedQuarterId: String(q?.Id || "") }))
                              }
                              className="accent-[#1d4ed8]"
                            />
                          </td>
                          <td className="py-3 px-4">{pageStart + idx + 1}</td>
                          <td className="py-3 px-4">{q?.QuarterType || "-"}</td>
                          <td className="py-3 px-4">{q?.Location || "-"}</td>
                          <td className="py-3 px-4">{q?.QuarterNo || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-[12px] font-semibold text-slate-600">
                  {filteredQuarters.length === 0
                    ? "0 results"
                    : `${pageStart + 1}–${Math.min(pageStart + pageSize, filteredQuarters.length)} of ${filteredQuarters.length}`}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-2 py-1.5 text-[12px] font-semibold text-slate-700"
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}/page
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={safePage === 1}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 disabled:opacity-50"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <div className="text-[12px] font-bold text-slate-700 px-1">
                    {safePage} / {totalPages}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    disabled={safePage === totalPages}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700 disabled:opacity-50"
                  >
                    Last
                  </button>
                </div>
              </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
