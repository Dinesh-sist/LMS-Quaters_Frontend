import { useEffect, useState } from "react";
import { X, FileText, ChevronDown, Check, Info } from "lucide-react";
import { 
  getQuarterTypes, 
  getAreaTypesByQuarterType, 
  getQuarterNumbersByQuarterTypeAndArea 
} from "../../api";

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


// Premium custom multi-select dropdown with scrolling, checkmarks & selection badges
function MultiSelectDropdown({ label, options, selected, onChange, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleToggle = (opt) => {
    if (safeSelected.includes(opt)) {
      onChange(safeSelected.filter((s) => s !== opt));
    } else {
      onChange([...safeSelected, opt]);
    }
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative group">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[14px] text-left transition-all shadow-sm flex items-center justify-between cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            open ? "border-blue-500 ring-[3px] ring-blue-500/15" : "border-slate-200 hover:border-slate-350"
          }`}
        >
          <span className={`truncate ${safeSelected.length === 0 ? "text-slate-400" : "text-slate-800 font-semibold"}`}>
            {safeSelected.length === 0 ? placeholder : safeSelected.join(", ")}
          </span>
          <ChevronDown 
            size={18} 
            className={`shrink-0 ml-2 text-slate-400 transition-transform duration-300 ${
              open ? "rotate-180 text-blue-500" : "group-hover:text-slate-500"
            }`} 
          />
        </button>

        {open && !disabled && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] max-h-48 overflow-y-auto overflow-x-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
              {options.length === 0 && (
                <p className="px-4 py-3 text-xs text-slate-400 text-center">No options available</p>
              )}
              {options.map((opt) => {
                const active = safeSelected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggle(opt)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13.5px] transition-colors cursor-pointer ${
                      active 
                        ? "bg-blue-50 text-blue-700 font-bold" 
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <span className="truncate">{opt}</span>
                    <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[6px] border transition ${
                      active ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
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

export default function CircularModal({ open, onClose, onSave, initialData }) {
  const [qtypes, setQtypes] = useState([]);
  const [areaTypes, setAreaTypes] = useState([]);
  const [quarterNumbers, setQuarterNumbers] = useState([]);
  
  const [form, setForm] = useState({
    circularNo: "",
    circularDate: "",
    quarterTypes: [],
    areaTypes: [],
    quarterNos: [],
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

  // Lock background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  

  // Load cascading dropdown options if editing / initial data exists
  useEffect(() => {
    if (open && initialData) {
      const parsedData = { ...initialData };
      if (!parsedData.quarterTypes && parsedData.quarterType) {
        parsedData.quarterTypes = [parsedData.quarterType];
      }
      if (!parsedData.areaTypes && parsedData.areaType) {
        parsedData.areaTypes = [parsedData.areaType];
      }
      if (!parsedData.quarterNos && parsedData.quarterNo) {
        parsedData.quarterNos = [parsedData.quarterNo];
      }
      if (!parsedData.quarterTypes) parsedData.quarterTypes = [];
      if (!parsedData.areaTypes) parsedData.areaTypes = [];
      if (!parsedData.quarterNos) parsedData.quarterNos = [];

      setForm(parsedData);

      if (parsedData.quarterTypes.length > 0) {
        getAreaTypesByQuarterType(parsedData.quarterTypes)
          .then((data) => setAreaTypes(data.areas || []))
          .catch(() => setAreaTypes([]));
      }
      
      if (parsedData.quarterTypes.length > 0 && parsedData.areaTypes.length > 0) {
        getQuarterNumbersByQuarterTypeAndArea(parsedData.quarterTypes, parsedData.areaTypes)
          .then((data) => setQuarterNumbers(data.numbers || []))
          .catch(() => setQuarterNumbers([]));
      }
    } else if (open) {
      setForm({
        circularNo: "",
        circularDate: "",
        quarterTypes: [],
        areaTypes: [],
        quarterNos: [],
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
      setAreaTypes([]);
      setQuarterNumbers([]);
    }
  }, [open, initialData]);

  // Load top-level quarter types from Estate_Quarters on modal open
  useEffect(() => {
    if (!open) return;
    getQuarterTypes()
      .then((data) => setQtypes(data.types || []))
      .catch(() => setQtypes([]));
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Dropdown change handlers
  const handleQuarterTypeChange = (vals) => {
    setForm((f) => ({ ...f, quarterTypes: vals, areaTypes: [], quarterNos: [] }));
    setAreaTypes([]);
    setQuarterNumbers([]);
    if (vals && vals.length > 0) {
      getAreaTypesByQuarterType(vals)
        .then((data) => setAreaTypes(data.areas || []))
        .catch(() => setAreaTypes([]));
    }
  };

  const handleAreaTypeChange = (vals) => {
    setForm((f) => ({ ...f, areaTypes: vals, quarterNos: [] }));
    setQuarterNumbers([]);
    if (vals && vals.length > 0 && form.quarterTypes.length > 0) {
      getQuarterNumbersByQuarterTypeAndArea(form.quarterTypes, vals)
        .then((data) => setQuarterNumbers(data.numbers || []))
        .catch(() => setQuarterNumbers([]));
    }
  };

  const handleSave = () => {
    const required = [
      "circularNo", 
      "circularDate", 
      "appFromDate", 
      "appToDate", 
      "openingTime", 
      "verifyFromDate", 
      "verifyToDate", 
      "contactName", 
      "contactDesignation", 
      "contactNumber", 
      "contactArea"
    ];
    
    for (const k of required) {
      if (!form[k]) { 
        alert(`Please select or fill required field: ${k.replace(/([A-Z])/g, ' $1')}`); 
        return; 
      }
    }

    if (!form.quarterTypes || form.quarterTypes.length === 0) {
      alert("Please select at least one Quarter Type.");
      return;
    }
    if (!form.areaTypes || form.areaTypes.length === 0) {
      alert("Please select at least one Area Type.");
      return;
    }
    if (!form.quarterNos || form.quarterNos.length === 0) {
      alert("Please select at least one Quarter Number.");
      return;
    }
    
    setLoading(true);
    // Maintain backward compatibility for individual fields
    onSave({
      ...form,
      quarterType: form.quarterTypes[0] || "",
      areaType: form.areaTypes[0] || "",
      quarterNo: form.quarterNos[0] || ""
    });
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}>
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
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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

            <Section title="Quarter Assignment (Cascading Selection)" color="blue">
              <div className="space-y-4">
                {/* 1. Quarter Types */}
                <MultiSelectDropdown
                  label="Quarter Types *"
                  options={qtypes}
                  selected={form.quarterTypes}
                  onChange={handleQuarterTypeChange}
                  placeholder="Select Quarter Types"
                />

                {/* 2. Area Types */}
                <MultiSelectDropdown
                  label="Area Types *"
                  options={areaTypes}
                  selected={form.areaTypes}
                  onChange={handleAreaTypeChange}
                  disabled={form.quarterTypes.length === 0}
                  placeholder="Select Area Types"
                />

                <pre>{JSON.stringify(areaTypes, null, 2)}</pre>

                {/* 3. Quarter Numbers */}
                <MultiSelectDropdown
                  label="Quarter Numbers *"
                  options={quarterNumbers}
                  selected={form.quarterNos}
                  onChange={(val) => setForm(f => ({ ...f, quarterNos: val }))}
                  disabled={form.areaTypes.length === 0}
                  placeholder="Select Quarter Numbers"
                />
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
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-2.5 text-[14px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:ring-4 focus:ring-blue-600/20 transition-all disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
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
