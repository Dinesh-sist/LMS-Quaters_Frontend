import { useEffect, useState } from "react";
import { X, FileText, ChevronDown, Check, CalendarDays, Info } from "lucide-react";
import { getQuarterTypes } from "../../api";

const inputCls =
  "block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-[3px] focus:ring-blue-500/15 transition-all shadow-sm";

function FormField({ label, icon: Icon, children }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative group">
        {children}
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <Icon size={18} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}

function MultiSelectDropdown({ options, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const safeSelected = Array.isArray(selected) ? selected : [];

  const toggle = (opt) => {
    if (safeSelected.includes(opt)) onChange(safeSelected.filter((s) => s !== opt));
    else onChange([...safeSelected, opt]);
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
        Quarter Types
      </label>
      <div className="relative group">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-left transition-all shadow-sm flex items-center justify-between ${open ? "border-blue-500 ring-[3px] ring-blue-500/15" : "border-slate-200 hover:border-slate-300"}`}
        >
          <span className={`truncate ${safeSelected.length === 0 ? "text-slate-400" : "text-slate-800 font-medium"}`}>
            {safeSelected.length === 0 ? "Select Quarter Types" : safeSelected.join(", ")}
          </span>
          <ChevronDown size={18} className={`shrink-0 ml-2 text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-blue-500" : "group-hover:text-slate-500"}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] max-h-56 overflow-y-auto overflow-x-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200">
              {options.length === 0 && (
                <p className="px-4 py-3 text-sm text-slate-400 text-center">No types available</p>
              )}
              {options.map((opt) => {
                const active = safeSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border ${active ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                      {active && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                    <span className="font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, color = "blue" }) {
  const colors = {
    blue: "border-blue-100 bg-blue-50/30 text-blue-800",
    orange: "border-orange-100 bg-orange-50/30 text-orange-800",
    green: "border-emerald-100 bg-emerald-50/30 text-emerald-800",
    purple: "border-indigo-100 bg-indigo-50/30 text-indigo-800",
    slate: "border-slate-200 bg-slate-50/50 text-slate-700"
  };

  const safeColor = colors[color] ? colors[color] : colors.blue;

  return (
    <div className={`rounded-2xl border p-5 ${safeColor.split(" ")[0]} ${safeColor.split(" ")[1]}`}>
      <h3 className={`text-[11px] font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-2 ${safeColor.split(" ")[2]}`}>
        <span className={`h-1.5 w-1.5 rounded-full bg-current opacity-70`} />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function CircularModal({ open, onClose, onSave, initialData }) {
  const [qtypes, setQtypes] = useState([]);
  const [form, setForm] = useState({
    circularNo: "",
    circularDate: "",
    quarterTypes: [],
    appFromDate: "",
    appToDate: "",
    openingTime: "",
    verifyFromDate: "",
    verifyToDate: "",
    contactName: "",
    contactDesignation: "",
    contactNumber: "",
    contactArea: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    getQuarterTypes()
      .then((data) => setQtypes(data.types || []))
      .catch(() => setQtypes([]));
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    const required = ["circularNo", "circularDate", "appFromDate", "appToDate", "openingTime", "verifyFromDate", "verifyToDate", "contactName", "contactDesignation", "contactNumber", "contactArea"];
    for (const k of required) {
      if (!form[k]) { alert(`Please fill: ${k}`); return; }
    }
    if (form.quarterTypes.length === 0) { alert("Select at least one quarter type."); return; }
    setLoading(true);
    onSave(form);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}>
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-12px_rgba(15,23,42,0.3)] animate-in fade-in zoom-in-[0.98] duration-300"
      >
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xl px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
              <FileText size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Generate Circular</h2>
              <p className="text-[13px] font-medium text-slate-500 mt-0.5">Fill the required fields to build the official document</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/30 custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Document Details" color="orange">
              <div className="space-y-5">
                <FormField label="Circular No. (Last Digits)" icon={Info}>
                  <input className={inputCls} placeholder="e.g. 1928" value={form?.circularNo || ""} onChange={set("circularNo")} />
                </FormField>
                <FormField label="Circular Date">
                  <input className={inputCls} type="date" value={form?.circularDate || ""} onChange={set("circularDate")} />
                </FormField>
              </div>
            </Section>

            <Section title="Quarter Assignment" color="blue">
              <div className="space-y-5 h-full">
                <MultiSelectDropdown options={qtypes || []} selected={form?.quarterTypes || []} onChange={(v) => setForm((f) => ({ ...f, quarterTypes: v }))} />
                <p className="text-xs text-slate-500 leading-relaxed pl-1 pt-2">
                  Select all quarter types that apply to this specific circular publication. Options are loaded dynamically from the database.
                </p>
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Application Window" color="green">
              <div className="space-y-5">
                <FormField label="Application From Date">
                  <input className={inputCls} type="date" value={form?.appFromDate || ""} onChange={set("appFromDate")} />
                </FormField>
                <FormField label="Application To Date">
                  <input className={inputCls} type="date" value={form?.appToDate || ""} onChange={set("appToDate")} />
                </FormField>
                <FormField label="Opening Time" icon={Info}>
                  <input className={inputCls} type="text" placeholder="e.g. 10.00 AM" value={form?.openingTime || ""} onChange={set("openingTime")} />
                </FormField>
              </div>
            </Section>

            <Section title="Verification Visit Dates" color="purple">
              <div className="space-y-5">
                <FormField label="Verify From Date">
                  <input className={inputCls} type="date" value={form?.verifyFromDate || ""} onChange={set("verifyFromDate")} />
                </FormField>
                <FormField label="Verify To Date">
                  <input className={inputCls} type="date" value={form?.verifyToDate || ""} onChange={set("verifyToDate")} />
                </FormField>
                <div className="rounded-xl bg-indigo-50/50 p-4 border border-indigo-100/50 mt-2">
                  <p className="text-[12px] font-medium text-indigo-800/80 leading-relaxed">
                    These dates specify when applicants must verify the quarter conditions physically before applying.
                  </p>
                </div>
              </div>
            </Section>
          </div>

          <Section title="Estate Contact Personnel" color="slate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField label="Contact Person Name" icon={Info}>
                <input className={inputCls} placeholder="e.g. Sri Debi Prasad Dash" value={form?.contactName || ""} onChange={set("contactName")} />
              </FormField>
              <FormField label="Designation" icon={Info}>
                <input className={inputCls} placeholder="e.g. Site Supervisor (Civil)" value={form?.contactDesignation || ""} onChange={set("contactDesignation")} />
              </FormField>
              <FormField label="Contact Number" icon={Info}>
                <input className={inputCls} placeholder="e.g. 9776437561" value={form?.contactNumber || ""} onChange={set("contactNumber")} />
              </FormField>
              <FormField label="Area Assignment" icon={Info}>
                <input className={inputCls} placeholder="e.g. Madhuban area" value={form?.contactArea || ""} onChange={set("contactArea")} />
              </FormField>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="z-10 flex items-center justify-end gap-3 border-t border-slate-100 bg-white/80 backdrop-blur-xl px-6 py-5 sm:px-8">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-2.5 text-[14px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:ring-4 focus:ring-blue-600/20 transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Details & Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
