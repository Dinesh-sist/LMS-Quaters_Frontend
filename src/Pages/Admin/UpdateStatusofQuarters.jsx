import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronDown,
  Hash,
  Home,
  Info,
  MapPin,
  Save,
} from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import Popup from "../../Components/Popup";
// import { updateQuarterStatus } from "../../api"; // wire up when the endpoint is ready

const QUARTER_TYPES = [
  "Type D",
  "Type C",
  "Type C Modified",
  "Type B",
  "Type B IIR",
  "Type A",
  "1 Room",
];

const STATUS_OPTIONS = [
  { value: "Vacant", dot: "bg-green-500" },
  { value: "Occupied", dot: "bg-[#e87722]" },
  { value: "Under Maintenance", dot: "bg-amber-500" },
  { value: "Beyond Repair", dot: "bg-red-500" },
];

function SelectField({ label, icon, placeholder, value, onChange, options, renderOption }) {
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
            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  isSelected
                    ? "bg-orange-50 text-[#e87722]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {renderOption ? renderOption(option) : optionValue}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function UpdateStatusofQuarters() {
  const [quarterType, setQuarterType] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [quarterNumber, setQuarterNumber] = useState("");
  const [status, setStatus] = useState("");
  const [formError, setFormError] = useState("");
  const [popup, setPopup] = useState({ open: false, title: "", message: "", variant: "success" });

  // Placeholder data — swap for real location/area/number lookups when available
  const locationOptions = ["Sector 1", "Sector 2", "Sector 3", "CDA Colony", "Buxi Bazar"];
  const areaOptions = ["Block A", "Block B", "Block C", "Block D"];
  const quarterNumberOptions = ["101", "102", "103", "104", "105"];

  const isFormComplete = quarterType && location && area && quarterNumber && status;

  const handleSave = async () => {
    if (!isFormComplete) {
      setFormError("Please fill in all fields before saving.");
      return;
    }
    setFormError("");

    try {
      // await updateQuarterStatus({ quarterType, location, area, quarterNumber, status });

      setPopup({
        open: true,
        title: "Status Updated",
        message: `Quarter ${quarterNumber} has been marked as ${status}.`,
        variant: "success",
      });

      setQuarterType("");
      setLocation("");
      setArea("");
      setQuarterNumber("");
      setStatus("");
    } catch (error) {
      setPopup({
        open: true,
        title: "Update Failed",
        message: error?.message || "Something went wrong.",
        variant: "error",
      });
    }
  };

  return (
    <AdminLayout
      title="Update Status of Quarters"
      subtitle="Mark a quarter as vacant, occupied, under maintenance, or beyond repair."
    >
      <section className="grid gap-5">
        {/* ── Card ── */}
        <div className="lms-card-land w-full max-w-3xl overflow-visible rounded-3xl border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-[#e87722]">
              <Home size={21} strokeWidth={1.9} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Quarter Details
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-6 text-slate-500">
                Select the quarter and choose the status that reflects its current condition.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Quarter Type"
              icon={<Building2 size={19} />}
              placeholder="Select quarter type"
              value={quarterType}
              onChange={setQuarterType}
              options={QUARTER_TYPES}
            />
            <SelectField
              label="Quarter Location"
              icon={<MapPin size={19} />}
              placeholder="Select location"
              value={location}
              onChange={setLocation}
              options={locationOptions}
            />
            <SelectField
              label="Quarter Area"
              icon={<Home size={19} />}
              placeholder="Select area"
              value={area}
              onChange={setArea}
              options={areaOptions}
            />
            <SelectField
              label="Quarter Number"
              icon={<Hash size={19} />}
              placeholder="Select quarter number"
              value={quarterNumber}
              onChange={setQuarterNumber}
              options={quarterNumberOptions}
            />
          </div>

          <div className="mt-4">
            <SelectField
              label="Status"
              icon={<Info size={19} />}
              placeholder="Select status"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              renderOption={(option) => (
                <>
                  <span className={`h-2 w-2 rounded-full ${option.dot}`} />
                  {option.value}
                </>
              )}
            />
          </div>

          {formError && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <Info size={15} className="shrink-0 text-red-500" />
              <p className="text-xs font-medium text-red-600">{formError}</p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-start gap-3">
              <Info size={17} className="mt-0.5 shrink-0 text-[#e87722]" />
              <p className="text-xs sm:text-sm leading-6 text-slate-600">
                Updating the status here changes what employees see when browsing available
                quarters. Double-check the quarter number before saving.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-10 sm:h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#e87722] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,119,34,0.24)] transition hover:bg-[#d76516]"
            >
              <Save size={17} />
              Save Status
            </button>
          </div>
        </div>
      </section>

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