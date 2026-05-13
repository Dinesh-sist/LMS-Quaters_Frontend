import { useState } from "react";
import TopHeader from "../../Components/TopHeader";
import Sidebar from "./EmployeeUI/EmployeeSideNav";

const QUARTER_TYPES = [
  { key: "a_type", label: "A TYPE" },
  { key: "b_type_iiir", label: "B TYPE IIIR" },
  { key: "c_type", label: "C TYPE" },
  { key: "d_type", label: "D TYPE" },
  { key: "e_type", label: "E TYPE" },
  { key: "c_type_modified", label: "C TYPE (MODIFIED)" },
  { key: "one_room", label: "1 ROOM" },
  { key: "b_type", label: "B TYPE" },
];

const CATEGORIES = [
  "Category A – Central Govt. Undertaking",
  "Category B – State Govt. Undertaking",
  "Category C – Private / Others",
];

const HODS = [
  "HOD – Civil Engineering",
  "HOD – Mechanical Engineering",
  "HOD – Electrical Engineering",
  "HOD – Finance & Accounts",
  "HOD – Human Resources",
  "HOD – Operations",
  "HOD – Security",
];

const inputCls = (focused, id) =>
  `w-full box-border rounded-[7px] px-3 py-[9px] text-[13.5px] text-slate-800 bg-white outline-none transition-all duration-200 font-[inherit]
  ${
    focused === id
      ? "border-[1.5px] border-orange-400 shadow-[0_0_0_3px_rgba(232,119,34,0.12)]"
      : "border-[1.5px] border-[#e2e8f0]"
  }`;

const selectCls = (focused, id) =>
  `${inputCls(focused, id)} appearance-none bg-no-repeat bg-[right_12px_center] pr-9 cursor-pointer`;

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

export default function ApplyForQuarters() {
  const [form, setForm] = useState({
    firmName: "",
    appliedFor: "fresh",
    category: "",
    referenceCode: "",
    quarters: Object.fromEntries(QUARTER_TYPES.map((q) => [q.key, ""])),
    hod: "",
    mobile: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setQ = (key, val) =>
    setForm((f) => ({ ...f, quarters: { ...f.quarters, [key]: val } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#e6eeff_0%,#f5f8ff_36%,#edf3ff_100%)]">
      <div className="h-full bg-[#f7faff] overflow-hidden flex flex-col">
        <TopHeader
          role="newuser"
          description="Outsider Services"
          welcomeName="Applicant"
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <main className="flex-1 overflow-y-auto px-9 py-7 bg-[#f4f6fa]">
            <div className="mb-[22px]">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-[-0.02em] mb-1.5">
                Application Form for Quarter Allotment to Outsiders
              </h2>
              <div className="h-[3px] w-[52px] rounded-sm bg-[#e87722]" />
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-lg px-[18px] py-3 mb-5 text-emerald-800 text-[13px] font-semibold flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                </svg>
                Application submitted successfully!
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)] px-8 py-7">
              <form onSubmit={handleSubmit}>
                <div className="grid items-center gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800">Name of the Firm:</label>
                  <input
                    type="text"
                    value={form.firmName}
                    onChange={(e) => set("firmName", e.target.value)}
                    className={inputCls(focused, "firmName")}
                    onFocus={() => setFocused("firmName")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800 pt-0.5">Applied for:</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: "fresh", label: "Fresh Allotment" },
                      { value: "renewal", label: "Renewal" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 cursor-pointer text-[13.5px] text-slate-800 ${
                          form.appliedFor === opt.value ? "font-semibold" : "font-normal"
                        }`}
                      >
                        <input
                          type="radio"
                          name="appliedFor"
                          value={opt.value}
                          checked={form.appliedFor === opt.value}
                          onChange={() => set("appliedFor", opt.value)}
                          className="accent-[#e87722] w-[15px] h-[15px]"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800 pt-0.5">Category:</label>
                  <div className="flex flex-col gap-2.5">
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={`${selectCls(focused, "category")} max-w-[340px]`}
                      style={{ backgroundImage: SELECT_ARROW }}
                      onFocus={() => setFocused("category")}
                      onBlur={() => setFocused(null)}
                    >
                      <option value="">Choose a Category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {form.appliedFor === "renewal" && (
                      <input
                        type="text"
                        placeholder="Reference code"
                        value={form.referenceCode}
                        onChange={(e) => set("referenceCode", e.target.value)}
                        className={`${inputCls(focused, "ref")} max-w-[200px]`}
                        onFocus={() => setFocused("ref")}
                        onBlur={() => setFocused(null)}
                      />
                    )}
                  </div>
                </div>

                <div className="border-t-[1.5px] border-dashed border-[#e2e8f0] my-5" />
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">
                  Prerequisites for applying:
                </div>

                <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800 leading-[1.45]">
                    Number of Quarters for Allotment/Renewal:
                  </label>
                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    {QUARTER_TYPES.map((qt) => (
                      <div key={qt.key}>
                        <label className="block text-[10.5px] font-bold text-slate-500 tracking-[0.08em] mb-1.5">
                          {qt.label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={form.quarters[qt.key]}
                          onChange={(e) => setQ(qt.key, e.target.value)}
                          className={inputCls(focused, qt.key)}
                          onFocus={() => setFocused(qt.key)}
                          onBlur={() => setFocused(null)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid items-center gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800">Department HOD:</label>
                  <select
                    value={form.hod}
                    onChange={(e) => set("hod", e.target.value)}
                    className={`${selectCls(focused, "hod")} max-w-[340px]`}
                    style={{ backgroundImage: SELECT_ARROW }}
                    onFocus={() => setFocused("hod")}
                    onBlur={() => setFocused(null)}
                  >
                    <option value="">Choose a HOD</option>
                    {HODS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid items-center gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800">Mobile Number:</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) => set("mobile", e.target.value)}
                    className={`${inputCls(focused, "mobile")} max-w-[220px]`}
                    onFocus={() => setFocused("mobile")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className="grid items-center gap-5 mb-7" style={{ gridTemplateColumns: "200px 1fr" }}>
                  <label className="text-[13.5px] font-semibold text-slate-800">Email Address:</label>
                  <input
                    type="email"
                    placeholder="applicant@example.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls(focused, "email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg border-0 cursor-pointer bg-[#1a2e5a] text-white text-sm font-bold tracking-[0.04em] transition-all duration-200 shadow-[0_4px_14px_rgba(26,46,90,0.25)] hover:bg-[#0f1f3d] active:scale-[0.99]"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
