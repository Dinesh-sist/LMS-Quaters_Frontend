import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Hash,
  Home,
  Info,
  Save,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import Popup from "../../Components/Popup";
import { lookupQuarterEmployee, getQuarterCategories, getQuarterAreas, getQuarterNumbers, getQuarterCurrentStatus, updateQuarterStatus } from "../../api";

const STATUS_OPTIONS = [
  { value: "VACANT", dot: "bg-green-500" },
  { value: "OCCUPIED", dot: "bg-[#e87722]" },
  { value: "UNDER MAINTENANCE", dot: "bg-amber-500" },
  { value: "BEYOND REPAIR", dot: "bg-red-500" },
];

function SelectField({ label, icon, placeholder, value, onChange, options, renderOption, highlightValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={fieldRef} className="relative min-w-0">
      <p className="mb-2 text-sm font-semibold text-slate-900">{label}</p>

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white px-4 text-left shadow-[0_0_0_3px_rgba(232,119,34,0.08)] transition-colors hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-slate-500">{icon}</span>
          <span className={`truncate text-sm font-medium ${value ? "text-slate-900" : "text-slate-400"}`}>
            {value || placeholder}
          </span>
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "100%", zIndex: 50 }}
          className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_38px_rgba(15,23,42,0.16)]"
        >
          {options.map((option) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const isSelected = optionValue === value;
            const isCurrent =
              highlightValue &&
              optionValue.toLowerCase() === highlightValue.toLowerCase();
            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isSelected
                    ? "bg-orange-50 text-[#e87722]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  {renderOption ? renderOption(option) : optionValue}
                </span>
                {isCurrent && (
                  <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InputField({ label, icon, placeholder, value, onChange, onBlur, type = "text", disabled = false }) {
  return (
    <div className={`relative min-w-0 ${disabled ? "opacity-75" : ""}`}>
      <p className="mb-2 text-sm font-semibold text-slate-900">{label}</p>
      <div className={`flex h-14 w-full items-center gap-3 rounded-2xl border bg-white px-4 transition-colors ${disabled ? "border-slate-200 cursor-not-allowed" : "border-orange-200 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] focus-within:border-[#e87722] focus-within:shadow-[0_0_0_4px_rgba(232,119,34,0.12)] hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"}`}>
        <span className={`shrink-0 ${disabled ? "text-slate-400" : "text-slate-500"}`}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent text-sm font-medium placeholder:text-slate-400 focus:outline-none ${disabled ? "text-slate-500 cursor-not-allowed" : "text-slate-900"}`}
        />
      </div>
    </div>
  );
}

function ComboField({ label, icon, placeholder, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={fieldRef} className="relative min-w-0">
      <p className="mb-2 text-sm font-semibold text-slate-900">{label}</p>
      <div
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={`flex h-14 w-full cursor-text items-center gap-3 rounded-2xl border bg-white px-4 shadow-[0_0_0_3px_rgba(232,119,34,0.08)] transition-colors ${isOpen
          ? "border-[#e87722] shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"
          : "border-orange-200 hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"
          }`}
      >
        <span className="shrink-0 text-slate-500">{icon}</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        <ChevronDown
          size={17}
          onClick={(e) => { e.stopPropagation(); setIsOpen((v) => !v); }}
          className={`shrink-0 cursor-pointer text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div
          style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: "100%", zIndex: 50 }}
          className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_38px_rgba(15,23,42,0.16)]"
        >
          {filtered.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setIsOpen(false); }}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${option === value
                ? "bg-orange-50 text-[#e87722]"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UpdateStatusofQuarters() {
  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [area, setArea] = useState("");
  const [quarterNumber, setQuarterNumber] = useState("");
  const [status, setStatus] = useState("");
  const [dbStatus, setDbStatus] = useState(""); // the value currently stored in DB (disabled in dropdown)
  const [formError, setFormError] = useState("");
  
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeClass, setEmployeeClass] = useState("");
  const [occupantType, setOccupantType] = useState("");
  const [employeeCurrentQuarter, setEmployeeCurrentQuarter] = useState(null);
  const [allotmentId, setAllotmentId] = useState("");
  const [allotmentDate, setAllotmentDate] = useState("");
  const [isNonEmployeeOccupant, setIsNonEmployeeOccupant] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "success" });
  const [isSaving, setIsSaving] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [quarterNumberOptions, setQuarterNumberOptions] = useState([]);
  // Auto-fetch state
  const [fetchState, setFetchState] = useState("idle"); // idle | loading | found | not-found

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getQuarterCategories();
        setCategoryOptions(res.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await getQuarterAreas(category);
        setAreaOptions(res.areas || []);
      } catch (err) {
        console.error("Failed to fetch areas", err);
      }
    }
    fetchAreas();
  }, [category]);

  useEffect(() => {
    async function fetchQuarterNumbers() {
      if (!area.trim()) {
        setQuarterNumberOptions([]);
        return;
      }
      try {
        const res = await getQuarterNumbers(area.trim());
        setQuarterNumberOptions(res.numbers || []);
      } catch (err) {
        console.error("Failed to fetch quarter numbers", err);
      }
    }
    fetchQuarterNumbers();
    // Reset quarter number when area changes to avoid invalid combinations
    setQuarterNumber("");
  }, [area]);

  // Auto-fetch current status whenever area + quarterNumber are both filled
  useEffect(() => {
    if (!area.trim() || !quarterNumber.trim()) {
      setStatus("");
      setDbStatus("");
      setFetchState("idle");
      return;
    }

    setFetchState("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await getQuarterCurrentStatus(area.trim(), quarterNumber.trim());
        const rawStatus = res.status || "";
        // Normalise to match STATUS_OPTIONS values (capitalise properly)
        const matched = STATUS_OPTIONS.find(
          (opt) => opt.value.toLowerCase() === rawStatus.toLowerCase()
        );
        const normalised = matched ? matched.value : rawStatus;
        setStatus(normalised); 
        setDbStatus(normalised); 
        setFetchState("found");

        if (normalised.toUpperCase() === "OCCUPIED") {
          setEmployeeId(res.employeeId || "");
          setEmployeeName(res.employeeName || "");
          setEmployeeClass(res.employeeClass || "");
          setOccupantType(res.employeeId ? (res.employeeClass ? "Employee" : "Outsider") : "");
          setAllotmentId(res.allotmentId || "");
          setAllotmentDate(res.allotmentDate || "");
          setIsNonEmployeeOccupant(Boolean(res.employeeId && !res.employeeClass));
        } else {
          setEmployeeId("");
          setEmployeeName("");
          setEmployeeClass("");
          setOccupantType("");
          setAllotmentId("");
          setAllotmentDate("");
          setIsNonEmployeeOccupant(false);
        }
      } catch (err) {
        if (err?.status === 404) {
          setStatus("");
          setDbStatus("");
          setFetchState("not-found");
        } else {
          console.error("Failed to fetch current quarter status", err);
          setFetchState("idle");
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [area, quarterNumber]);

  const handleEmployeeIdBlur = async () => {
    if (occupantType === "Employee" && employeeId.trim() && dbStatus.toUpperCase() !== "OCCUPIED") {
      try {
        const res = await lookupQuarterEmployee(employeeId.trim());
        if (res.exists) {
          setEmployeeName(res.name || "");
          setEmployeeClass(res.empClass || "");
          
          const uQtr = res.userDetailsQuarter;
          const eQtr = res.estateQuarter;
          
          let mismatch = false;
          if (uQtr && eQtr) {
            const normalize = (s) => (s || "").toString().trim().toUpperCase();
            if (normalize(uQtr.category) !== normalize(eQtr.category) ||
                normalize(uQtr.areaType) !== normalize(eQtr.areaType) ||
                normalize(uQtr.quarterNo) !== normalize(eQtr.quarterNo)) {
              mismatch = true;
            }
          }
          
          if (mismatch) {
            setPopup({
              open: true,
              title: "Quarter Data Mismatch",
              message: "Quarter details don't match between UserDetails and Estate_Quarters for this employee.",
              variant: "error",
            });
            setEmployeeCurrentQuarter(null);
          } else {
            const qtr = eQtr || (uQtr?.category ? uQtr : null);
            setEmployeeCurrentQuarter(qtr);
          }
        } else {
          setEmployeeName("");
          setEmployeeClass("");
          setEmployeeCurrentQuarter(null);
          setPopup({
            open: true,
            title: "Employee Not Found",
            message: "This employee is not available in User Details.",
            variant: "error",
          });
        }
      } catch (err) {
        console.error("Lookup failed:", err);
      }
    }
  };

  // Form is only complete when a NEW status (different from DB) is selected
  const showOccupantDetails = status ? status.toUpperCase() === "OCCUPIED" : dbStatus.toUpperCase() === "OCCUPIED";
  const isOccupiedSelected = status.toUpperCase() === "OCCUPIED";
  const areOccupiedFieldsFilled = occupantType && employeeId && employeeName && (occupantType === "Outsider" || employeeClass) && allotmentId && allotmentDate;
  const isFormComplete = area && quarterNumber && status && status !== dbStatus && (!isOccupiedSelected || areOccupiedFieldsFilled);

  const handleSave = async () => {
    if (!isFormComplete) {
      setFormError("Please fill in all fields before saving.");
      return;
    }
    setFormError("");

    if (dbStatus.toUpperCase() === "OCCUPIED" && status.toUpperCase() !== "OCCUPIED") {
      setShowConfirmModal(true);
      return;
    }

    await executeSave();
  };

  const executeSave = async () => {
    try {
      setIsSaving(true);
      setShowConfirmModal(false);
      await updateQuarterStatus({ 
        area, 
        quarterNumber, 
        status,
        employeeId,
        employeeName,
        employeeClass,
        allotmentId,
        allotmentDate
      });

      setPopup({
        open: true,
        title: "Status Updated",
        message: `Quarter ${quarterNumber} has been marked as ${status}.`,
        variant: "success",
      });

      setArea("");
      setQuarterNumber("");
      setStatus("");
      setEmployeeId("");
      setEmployeeName("");
      setEmployeeClass("");
      setOccupantType("");
      setAllotmentId("");
      setAllotmentDate("");
    } catch (error) {
      setPopup({
        open: true,
        title: "Update Failed",
        message: error?.message || "Something went wrong.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Update Status of Quarters"
      subtitle="Mark a quarter as vacant, occupied, under maintenance, or beyond repair."
    >
      <section className="grid gap-5">
        {/* ── Card ── */}
        <div className="lms-card-land w-full overflow-visible rounded-3xl border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* ── LEFT HALF: Quarter Details ── */}
            <div>
              <div className="mb-6 flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-[#e87722] sm:h-12 sm:w-12">
                  <Home size={21} strokeWidth={1.9} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    Quarter Details
                  </h2>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500 sm:text-sm">
                    Select the quarter and choose the status that reflects its current condition.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <ComboField
                  label="Quarter Category"
                  icon={<Home size={19} />}
                  placeholder="Select Category"
                  value={category}
                  onChange={(val) => {
                    setCategory(val);
                    setArea("");
                    setQuarterNumber("");
                  }}
                  options={categoryOptions}
                />
                <ComboField
                  label="Quarter Area"
                  icon={<Home size={19} />}
                  placeholder="Select or type area"
                  value={area}
                  onChange={setArea}
                  options={areaOptions}
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <ComboField
                  label="Quarter Number"
                  icon={<Hash size={19} />}
                  placeholder="Select or type quarter number"
                  value={quarterNumber}
                  onChange={setQuarterNumber}
                  options={quarterNumberOptions}
                />
                <div className="relative min-w-0">
                  <p className="mb-2 text-sm font-semibold text-slate-900">Status</p>
                  {/* Auto-fetch badge */}
                  {fetchState === "loading" && (
                    <div className="flex h-14 w-full items-center gap-3 rounded-2xl border border-orange-200 bg-white px-4 shadow-[0_0_0_3px_rgba(232,119,34,0.08)]">
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#e87722] border-t-transparent" />
                      <span className="text-sm font-medium text-slate-400">Fetching current status…</span>
                    </div>
                  )}
                  {fetchState === "not-found" && (
                    <div className="flex h-14 w-full items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4">
                      <Info size={17} className="shrink-0 text-red-400" />
                      <span className="text-sm font-medium text-red-500">Quarter not found in database</span>
                    </div>
                  )}
                  {(fetchState === "idle" || fetchState === "found") && (
                    <SelectField
                      label=""
                      icon={<Info size={19} />}
                      placeholder={fetchState === "idle" ? "Fill area & number first" : "Select Status"}
                      value={status}
                      onChange={setStatus}
                      options={STATUS_OPTIONS}
                      highlightValue={dbStatus}
                      renderOption={(option) => (
                        <>
                          <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                          {option.value}
                        </>
                      )}
                    />
                  )}
                </div>
              </div>

              {formError && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <Info size={15} className="shrink-0 text-red-500" />
                  <p className="text-xs font-medium text-red-600">{formError}</p>
                </div>
              )}

              {employeeCurrentQuarter && occupantType === "Employee" && (
                <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                  <p className="mb-2 text-sm font-semibold text-blue-900">Current Allotment Details</p>
                  <div className="grid grid-cols-3 gap-4 text-sm font-medium text-slate-700">
                    <div>
                      <span className="block text-xs text-slate-500">Category</span>
                      {employeeCurrentQuarter.category || "N/A"}
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Area Type</span>
                      {employeeCurrentQuarter.areaType || "N/A"}
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Quarter Number</span>
                      {employeeCurrentQuarter.quarterNo || "N/A"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT HALF: Occupant Details ── */}
            <div className="flex flex-col gap-5 border-t border-slate-200 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="mb-1 flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 sm:h-12 sm:w-12">
                  <User size={21} strokeWidth={1.9} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    Occupant Details
                  </h2>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500 sm:text-sm">
                    Enter the details of the occupant to whom this quarter is allotted (if applicable).
                  </p>
                </div>
              </div>

              {showOccupantDetails ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {dbStatus.toUpperCase() === "OCCUPIED" ? (
                      <InputField
                        label="Occupant Type"
                        icon={<User size={19} />}
                        placeholder=""
                        value={occupantType || "Unknown"}
                        onChange={() => {}}
                        disabled={true}
                      />
                    ) : (
                      <SelectField
                        label="Occupant Type"
                        icon={<User size={19} />}
                        placeholder="Select Occupant Type"
                        value={occupantType}
                        onChange={(val) => {
                          setOccupantType(val);
                          if (val === "Outsider") setEmployeeClass("");
                        }}
                        options={[
                          { value: "Employee", label: "Employee" },
                          { value: "Outsider", label: "Outsider" }
                        ]}
                        renderOption={(option) => option.label}
                      />
                    )}
                    <InputField
                      label={occupantType === "Employee" ? "Employee ID" : (occupantType === "Outsider" ? "Outsider ID" : "Occupant ID")}
                      icon={<Hash size={19} />}
                      placeholder={occupantType === "Employee" ? "Enter Employee ID" : (occupantType === "Outsider" ? "Enter Outsider ID" : "Enter Occupant ID")}
                      value={employeeId}
                      onChange={setEmployeeId}
                      onBlur={handleEmployeeIdBlur}
                      disabled={isNonEmployeeOccupant || (dbStatus.toUpperCase() === "OCCUPIED")}
                    />
                  </div>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    {occupantType !== "Outsider" && (
                      <InputField
                        label={occupantType === "Employee" ? "Employee Class" : "Occupant Class"}
                        icon={<Info size={19} />}
                        placeholder={occupantType === "Employee" ? "Enter Employee Class" : "Enter Occupant Class"}
                        value={employeeClass}
                        onChange={setEmployeeClass}
                      />
                    )}
                  </div>
                  <div className="mt-5">
                    <InputField
                      label={occupantType === "Employee" ? "Employee Name" : (occupantType === "Outsider" ? "Outsider Name" : "Occupant Name")}
                      icon={<User size={19} />}
                      placeholder={occupantType === "Employee" ? "Enter Employee Name" : (occupantType === "Outsider" ? "Enter Outsider Name" : "Enter Occupant Name")}
                      value={employeeName}
                      onChange={setEmployeeName}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 mt-5">
                    <InputField
                      label="Allotment ID (Order)"
                      icon={<FileText size={19} />}
                      placeholder="Enter Allotment ID"
                      value={allotmentId}
                      onChange={setAllotmentId}
                    />
                    <InputField
                      label="Allotment Date"
                      type="date"
                      icon={<Calendar size={19} />}
                      placeholder="Select Date"
                      value={allotmentDate}
                      onChange={setAllotmentDate}
                    />
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 px-5 text-center">
                  <div className="mb-3 rounded-full bg-slate-200 p-3 text-slate-400">
                    <User size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">No Occupant Details Required</h3>
                  <p className="mt-1 max-w-[240px] text-xs text-slate-500">
                    Occupant details and allotment information are only needed when a quarter is marked as OCCUPIED.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Bottom Section ── */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex items-start gap-3">
                <Info size={17} className="mt-0.5 shrink-0 text-[#e87722]" />
                <p className="text-xs leading-6 text-slate-600 sm:text-sm">
                  Updating the status here changes what employees see when browsing available
                  quarters. Double-check the quarter number before saving.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isFormComplete}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#e87722] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,119,34,0.24)] transition hover:bg-[#d76516] disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:w-auto"
              >
                <Save size={17} />
                {isSaving ? "Saving..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md scale-100 overflow-hidden rounded-[24px] bg-white p-6 shadow-2xl opacity-100 transition-all">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Clear Occupant Data?</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Changing the status from <strong>OCCUPIED</strong> to <strong>{status}</strong> will permanently clear the current occupant's details from this quarter.
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSave}
                className="w-full rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 sm:w-auto"
              >
                Yes, clear data
              </button>
            </div>
          </div>
        </div>
      )}

      <Popup
        open={popup.open}
        title={popup.title}
        message={popup.message}
        variant={popup.variant}
        onClose={() => setPopup((prev) => ({ ...prev, open: false }))}
      />
    </AdminLayout>
  );
}


