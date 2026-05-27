import { useEffect, useState } from "react";
import TopHeader from "../../Components/TopHeader";
import Footer from "../../Components/Footer";
import Sidebar from "./EmployeeUI/EmployeeSideNav";
import { request } from "../../api";
import { getUser } from "../../auth";

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
  "Category A - Central Govt. Undertaking",
  "Category B - State Govt. Undertaking",
  "Category C - Private / Others",
];

const HODS = [
  "HOD - Civil Engineering",
  "HOD - Mechanical Engineering",
  "HOD - Electrical Engineering",
  "HOD - Finance & Accounts",
  "HOD - Human Resources",
  "HOD - Operations",
  "HOD - Security",
];

const HOD_DEPTS_FALLBACK = HODS.map((h) =>
  String(h)
    .replace(/^HOD\s*/i, "")
    .replace(/^[\s:–—-]+/g, "")
    .trim()
);

const norm = (val) =>
  String(val || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function allowedHodSetForCategory(category) {
  const c = norm(category);
  if (!c) return null;

  if (c.includes("contractors")) return null;
  if (c.includes("management trainees")) return null;
  if (c.includes("press") || c.includes("print") || c.includes("media") || c.includes("news agencies"))
    return null;

  const allow = (arr) => new Set(arr.map(norm));

  if (c.includes("union") && c.includes("federation")) return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("port users"))
    return allow([
      "Chief Engineer PPT (Engg.Dept)",
      "Dy.Conservator (Marine Dept)",
      "Traffic Manager PPT (Traffic Dept)",
    ]);
  if (c.includes("state") && c.includes("central") && c.includes("gov")) return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("school") || c.includes("college") || c.includes("educational"))
    return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("bank") || c.includes("tax") || c.includes("consultants") || c.includes("auditors"))
    return allow(["F.A & C.A.O PPT (Finance Dept)"]);
  if (c.includes("legal consultant")) return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("muck") && c.includes("cleaning")) return allow(["C.M.E PPT (Electrical & Mech Dept)"]);
  if (c.includes("railway") && c.includes("maintain"))
    return allow(["Chief Engineer PPT (Engg.Dept)", "Traffic Manager PPT (Traffic Dept)"]);
  if (c.includes("co op") || c.includes("cooperative") || c.includes("societies"))
    return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("ngo") || c.includes("welfare")) return allow(["Secretary PPT (Adm Dept)"]);
  if (c.includes("trade centres") || (c.includes("trade") && c.includes("centres")))
    return allow(["Secretary PPT (Adm Dept)"]);

  return null;
}

const inputCls = (focused, id) =>
  `w-full box-border rounded-[7px] px-3 py-[9px] text-[13.5px] text-slate-800 bg-white outline-none transition-all duration-200 font-[inherit]
  ${focused === id
    ? "border-[1.5px] border-orange-400 shadow-[0_0_0_3px_rgba(232,119,34,0.12)]"
    : "border-[1.5px] border-[#e2e8f0]"
  }`;

const selectCls = (focused, id) =>
  `${inputCls(focused, id)} appearance-none bg-no-repeat bg-[right_12px_center] pr-9 cursor-pointer`;

const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`;

export default function ApplyForQuarters() {
  const user = getUser();
  const [form, setForm] = useState({
    firmName: "",
    appliedFor: "fresh",
    category: "",
    priorityStatus: "",
    referenceCode: "",
    cat1: "", // union/federation for Union/Federation category
    cat1Conditions: {
      condition1a: false,
      condition1b: false,
      condition1c: false,
    },
    govtDeptConditions: {
      condition1a: false,
      condition1b: false,
      condition1c: false,
      condition1d: false,
    },
    eduInstituteType: "", // "0" Government, "1" Private
    quarters: Object.fromEntries(QUARTER_TYPES.map((q) => [q.key, ""])),
    hod: "",
    mobile: "",
    email: "",
    attachments: {
      formE: null,
      portLicenseCopy: null,
      cargoDetails: null,
      hodRecommendation: null,
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [hodDepts, setHodDepts] = useState([]);
  const [hodDeptsError, setHodDeptsError] = useState("");

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setQ = (key, val) =>
    setForm((f) => ({ ...f, quarters: { ...f.quarters, [key]: val } }));

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoriesError("");
        const data = await request("/api/allotment-categories");
        if (!cancelled) setCategories(Array.isArray(data?.items) ? data.items : []);
      } catch (err) {
        if (!cancelled) setCategoriesError(err?.message || "Failed to load categories");
      }
    }

    loadCategories();
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
        if (!cancelled) setHodDepts(depts);
      } catch (err) {
        if (!cancelled) setHodDeptsError(err?.message || "Failed to load HOD departments");
      }
    }

    loadHodDepts();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const allowedHodSet = allowedHodSetForCategory(form.category);

  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#e6eeff_0%,#f5f8ff_36%,#edf3ff_100%)]">
      <div className="h-full bg-[#f7faff] overflow-hidden flex flex-col">
        <TopHeader
          role="newuser"
          description="Outsider Services"
          welcomeName={user?.name || user?.username || "Employee"}
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f4f6fa]">
            <main className="flex-1 overflow-y-auto px-9 py-7">
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
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="flex-1 min-w-[240px]">
                        <select
                          value={form.category}
                          onChange={(e) => {
                        const nextCategory = e.target.value;
                        const catRow = categories.find((c) => c?.ALLOT_CAT === nextCategory);
                        const nextPriority =
                          catRow?.ALLOT_CAT_PRIORITY == null ? "" : String(catRow.ALLOT_CAT_PRIORITY);
                        const allowedNext = allowedHodSetForCategory(nextCategory);
                        setForm((f) => ({
                          ...f,
                          category: nextCategory,
                          priorityStatus: nextPriority,
                          hod:
                            allowedNext == null || !f.hod ? f.hod : allowedNext.has(norm(f.hod)) ? f.hod : "",
                          ...(nextCategory === "Union/Federation"
                            ? {}
                            : {
                                cat1: "",
                                cat1Conditions: {
                                      condition1a: false,
                                      condition1b: false,
                                      condition1c: false,
                                    },
                                  }),
                              ...(nextCategory === "State/Central Govt. Dept"
                                ? {}
                                : {
                                    govtDeptConditions: {
                                      condition1a: false,
                                      condition1b: false,
                                      condition1c: false,
                                      condition1d: false,
                                    },
                                  }),
                          ...(nextCategory === "School/College /Educational institutions"
                            ? {}
                            : {
                                eduInstituteType: "",
                              }),
                        }));
                      }}
                          className={selectCls(focused, "category")}
                          style={{ backgroundImage: SELECT_ARROW }}
                          onFocus={() => setFocused("category")}
                          onBlur={() => setFocused(null)}
                        >
                          <option value="">Choose a Category</option>
                          {(categories.length
                            ? categories
                            : CATEGORIES.map((c) => ({ ALLOT_CAT_ID: c, ALLOT_CAT: c }))
                          ).map((c) => (
                            <option key={c?.ALLOT_CAT_ID ?? c?.ALLOT_CAT} value={c?.ALLOT_CAT ?? ""}>
                              {c?.ALLOT_CAT ?? ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-[200px]">
                        <label className="block text-[10.5px] font-bold text-slate-500 tracking-[0.08em] mb-1.5">
                          PRIORITY STATUS
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={form.priorityStatus}
                          placeholder="Auto-filled"
                          className={inputCls(focused, "priorityStatus")}
                          onFocus={() => setFocused("priorityStatus")}
                          onBlur={() => setFocused(null)}
                        />
                      </div>
                    </div>
                    {categoriesError ? (
                      <div className="text-[12px] font-semibold text-rose-600">{categoriesError}</div>
                    ) : null}

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

                {form.category === "Union/Federation" ? (
                  <>
                    <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                      <label className="text-[13.5px] font-semibold text-slate-800 pt-0.5">Union/Federation:</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { value: "0", label: "Union" },
                          { value: "1", label: "Federation" },
                        ].map((opt) => (
                          <label key={opt.value} className="inline-flex items-center gap-2 text-[13.5px] text-slate-800">
                            <input
                              type="radio"
                              name="cat1"
                              value={opt.value}
                              checked={form.cat1 === opt.value}
                              onChange={() => set("cat1", opt.value)}
                              className="accent-[#e87722] w-[15px] h-[15px]"
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                      <label className="text-[13.5px] font-semibold text-slate-800 leading-[1.45]">Conditions:</label>
                      <div className="flex flex-col gap-3">
                        {[
                          { key: "condition1a", label: "1. Working in regular welfare employee" },
                          { key: "condition1b", label: "2. Register under Trade Union Act 1926" },
                          { key: "condition1c", label: "3. Secure 5 % of Vote" },
                        ].map((c) => (
                          <label key={c.key} className="inline-flex items-start gap-2 text-[13.5px] text-slate-800">
                            <input
                              type="checkbox"
                              checked={Boolean(form.cat1Conditions?.[c.key])}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  cat1Conditions: { ...f.cat1Conditions, [c.key]: e.target.checked },
                                }))
                              }
                              className="mt-[2px] accent-[#e87722] w-[15px] h-[15px]"
                            />
                            <span>{c.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}

                {form.category === "State/Central Govt. Dept" ? (
                  <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                    <label className="text-[13.5px] font-semibold text-slate-800 leading-[1.45]">Prerequisites:</label>
                    <div className="flex flex-col gap-3">
                      {[
                        {
                          key: "condition1a",
                          label: "1. Self Declaration -Not provided any quarters by their organisation",
                        },
                        { key: "condition1b", label: "2. Working within port limit" },
                        { key: "condition1c", label: "3. Recommended by HOD" },
                        {
                          key: "condition1d",
                          label:
                            "4. Understand that quarters will be allotted only in the name of the recommended authority/HOD",
                        },
                      ].map((c) => (
                        <label key={c.key} className="inline-flex items-start gap-2 text-[13.5px] text-slate-800">
                          <input
                            type="checkbox"
                            checked={Boolean(form.govtDeptConditions?.[c.key])}
                            onChange={(e) =>
                              setForm((f) => ({
                                ...f,
                                govtDeptConditions: {
                                  ...f.govtDeptConditions,
                                  [c.key]: e.target.checked,
                                },
                              }))
                            }
                            className="mt-[2px] accent-[#e87722] w-[15px] h-[15px]"
                          />
                          <span>{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}

                {form.category === "School/College /Educational institutions" ? (
                  <div className="grid items-start gap-5 mb-5" style={{ gridTemplateColumns: "200px 1fr" }}>
                    <label className="text-[13.5px] font-semibold text-slate-800 pt-0.5">Institution Type:</label>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: "0", label: "Government School/College" },
                        { value: "1", label: "Private School/College" },
                      ].map((opt) => (
                        <label key={opt.value} className="inline-flex items-center gap-2 text-[13.5px] text-slate-800">
                          <input
                            type="radio"
                            name="eduInstituteType"
                            value={opt.value}
                            checked={form.eduInstituteType === opt.value}
                            onChange={() => set("eduInstituteType", opt.value)}
                            className="accent-[#e87722] w-[15px] h-[15px]"
                          />
                          {opt.label}
                        </label>
                      ))}
                      <div className="text-[12px] font-semibold text-slate-500">
                        Select the institution type, then choose the relevant HOD department.
                      </div>
                    </div>
                  </div>
                ) : null}

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
                    disabled={!form.category}
                    className={`${selectCls(focused, "hod")} max-w-[340px] ${
                      !form.category ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundImage: SELECT_ARROW }}
                    onFocus={() => setFocused("hod")}
                    onBlur={() => setFocused(null)}
                  >
                    <option value="">Choose a HOD</option>
                    {(hodDepts.length ? hodDepts : HOD_DEPTS_FALLBACK).map((dept) => {
                      const disabledOpt = allowedHodSet ? !allowedHodSet.has(norm(dept)) : false;
                      return (
                        <option key={dept} value={dept} disabled={disabledOpt}>
                          {dept}
                        </option>
                      );
                    })}
                  </select>
                  {hodDeptsError ? (
                    <div className="text-[12px] font-semibold text-rose-600">{hodDeptsError}</div>
                  ) : null}
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

                {["1", "2", "3"].includes(String(form.priorityStatus || "")) ? (
                  <div className="mb-7">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4">
                      Attachments:
                    </div>

                    {String(form.priorityStatus) === "1" ? (
                      <div
                        className="grid items-center gap-5"
                        style={{ gridTemplateColumns: "200px 1fr" }}
                      >
                        <label className="text-[13.5px] font-semibold text-slate-800">
                          1. Attach Form E Obtain from Labour Commission
                        </label>
                        <input
                          type="file"
                          className={inputCls(focused, "attach_formE")}
                          onFocus={() => setFocused("attach_formE")}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setForm((f) => ({
                              ...f,
                              attachments: { ...f.attachments, formE: file },
                            }));
                          }}
                        />
                      </div>
                    ) : null}

                    {String(form.priorityStatus) === "2" ? (
                      <div className="flex flex-col gap-4">
                        <div
                          className="grid items-center gap-5"
                          style={{ gridTemplateColumns: "200px 1fr" }}
                        >
                          <label className="text-[13.5px] font-semibold text-slate-800">
                            1. Attach Licensed copy issued by port authority
                          </label>
                          <input
                            type="file"
                            className={inputCls(focused, "attach_portLicenseCopy")}
                            onFocus={() => setFocused("attach_portLicenseCopy")}
                            onBlur={() => setFocused(null)}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setForm((f) => ({
                                ...f,
                                attachments: { ...f.attachments, portLicenseCopy: file },
                              }));
                            }}
                          />
                        </div>

                        <div
                          className="grid items-center gap-5"
                          style={{ gridTemplateColumns: "200px 1fr" }}
                        >
                          <label className="text-[13.5px] font-semibold text-slate-800">
                            2. Attach Cargo related details
                          </label>
                          <input
                            type="file"
                            className={inputCls(focused, "attach_cargoDetails")}
                            onFocus={() => setFocused("attach_cargoDetails")}
                            onBlur={() => setFocused(null)}
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setForm((f) => ({
                                ...f,
                                attachments: { ...f.attachments, cargoDetails: file },
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {String(form.priorityStatus) === "3" ? (
                      <div
                        className="grid items-center gap-5"
                        style={{ gridTemplateColumns: "200px 1fr" }}
                      >
                        <label className="text-[13.5px] font-semibold text-slate-800">
                          1. Attach recommendation letter from the HOD
                        </label>
                        <input
                          type="file"
                          className={inputCls(focused, "attach_hodRecommendation")}
                          onFocus={() => setFocused("attach_hodRecommendation")}
                          onBlur={() => setFocused(null)}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setForm((f) => ({
                              ...f,
                              attachments: { ...f.attachments, hodRecommendation: file },
                            }));
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg border-0 cursor-pointer bg-[#1a2e5a] text-white text-sm font-bold tracking-[0.04em] transition-all duration-200 shadow-[0_4px_14px_rgba(26,46,90,0.25)] hover:bg-[#0f1f3d] active:scale-[0.99]"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
