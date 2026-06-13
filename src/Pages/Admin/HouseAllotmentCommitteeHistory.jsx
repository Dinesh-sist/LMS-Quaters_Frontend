import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Info } from "lucide-react";
import AgGridTable from "../../Components/Table";
import AdminLayout from "./AdminUI/AdminLayout";
import { API_BASE, getHouseAllotmentCommitteeHistory, saveHouseAllotmentCommitteeHistory } from "../../api";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDate(firstDate, secondDate) {
  if (!firstDate || !secondDate) return false;
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function getCalendarDays(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const mondayBasedDay = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - mondayBasedDay);

  return Array.from({ length: 35 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function DatePickerCard({ label, selectedDate, onSelect, disabled = false }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate || new Date()));
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthPanel, setShowMonthPanel] = useState(false);
  const [showYearPanel, setShowYearPanel] = useState(false);
  const [yearPageStart, setYearPageStart] = useState(() =>
    Math.floor((selectedDate || new Date()).getFullYear() / 12) * 12
  );
  const pickerRef = useRef(null);
  const calendarDays = getCalendarDays(visibleMonth);

  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) =>
    setVisibleMonth((cur) => new Date(cur.getFullYear(), cur.getMonth() + offset, 1));

  const goToMonth = (monthIndex) => {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), monthIndex, 1));
    setShowMonthPanel(false);
  };

  const goToYear = (year) => {
    setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1));
    setShowYearPanel(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowMonthPanel(false);
        setShowYearPanel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={pickerRef} style={{ position: "relative" }} className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <Info size={15} className="text-slate-400" />
      </div>

      <button
        disabled={disabled}
        type="button"
        onClick={() => {
          setIsOpen((v) => !v);
          setShowMonthPanel(false);
          setShowYearPanel(false);
        }}
        className={`flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-white px-4 text-left shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-colors hover:border-[#4f46e5] hover:shadow-[0_0_0_4px_rgba(99,102,241,0.12)]`}
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <CalendarDays size={19} className="shrink-0 text-slate-500" />
          <span className="truncate text-sm font-medium text-slate-900">
            {selectedDate ? fullDateFormatter.format(selectedDate) : "Pick a date"}
          </span>
        </span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            width: "100%",
            zIndex: 50,
          }}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_38px_rgba(15,23,42,0.16)]"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4f46e5]"
            >
              <ChevronLeft size={17} />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowMonthPanel((v) => !v);
                  setShowYearPanel(false);
                }}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition ${
                  showMonthPanel
                    ? "border-indigo-300 bg-indigo-50 text-[#4f46e5]"
                    : "border-transparent text-slate-900 hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4f46e5]"
                }`}
              >
                {MONTHS_FULL[visibleMonth.getMonth()]}
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowYearPanel((v) => !v);
                  setShowMonthPanel(false);
                  setYearPageStart(Math.floor(visibleMonth.getFullYear() / 12) * 12);
                }}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition ${
                  showYearPanel
                    ? "border-indigo-300 bg-indigo-50 text-[#4f46e5]"
                    : "border-transparent text-slate-900 hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4f46e5]"
                }`}
              >
                {visibleMonth.getFullYear()}
                <ChevronDown size={12} className="text-slate-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4f46e5]"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {showMonthPanel && (
            <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-900">
                Select month
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {MONTHS_SHORT.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => goToMonth(i)}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                      i === visibleMonth.getMonth()
                        ? "border-[#4f46e5] bg-[#4f46e5] text-white shadow-[0_4px_10px_rgba(79,70,229,0.3)]"
                        : "border-transparent text-slate-700 hover:border-indigo-300 hover:bg-indigo-100 hover:text-[#3730a3]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showYearPanel && (
            <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-900">
                  Select year
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setYearPageStart((y) => y - 12)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-indigo-200 bg-white text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setYearPageStart((y) => y + 12)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-indigo-200 bg-white text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 12 }, (_, i) => yearPageStart + i).map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => goToYear(year)}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                      year === visibleMonth.getFullYear()
                        ? "border-[#4f46e5] bg-[#4f46e5] text-white shadow-[0_4px_10px_rgba(79,70,229,0.3)]"
                        : "border-transparent text-slate-700 hover:border-indigo-300 hover:bg-indigo-100 hover:text-[#3730a3]"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((wd) => (
              <div key={wd} className="py-1 text-xs font-medium text-slate-500">{wd}</div>
            ))}
            {calendarDays.map((day) => {
              const isSelected = isSameDate(day, selectedDate);
              const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
              const normalizedDay = new Date(day);
              normalizedDay.setHours(0, 0, 0, 0);

              const isDisabled = false;
              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    onSelect(new Date(day));
                    setIsOpen(false);
                    setShowMonthPanel(false);
                    setShowYearPanel(false);
                  }}
                  className={`relative mx-auto mt-1.5 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    isDisabled
                      ? "cursor-not-allowed text-slate-200"
                      : isSelected
                        ? "bg-[#4f46e5] text-white shadow-[0_6px_14px_rgba(79,70,229,0.3)]"
                        : isOutsideMonth
                          ? "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
                          : "text-slate-950 hover:bg-indigo-50 hover:text-[#4f46e5]"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-1 h-1 w-1 rounded-full bg-white/80" />
                  )}
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function downloadFile(fileName) {
  if (!fileName) return;

  const normalised = String(fileName).replace(/\\/g, "/").replace(/^.*uploads\//, "");
  const baseName = normalised.split("/").pop() || normalised;
  const url = `${API_BASE}/uploads/${encodeURIComponent(baseName)}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("File not found");
      return res.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = baseName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    })
    .catch(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    });
}

const columns = [
  {
    key: "committeeHeld",
    header: "COMMITTEE HELD DATE",
    minWidth: 230,
    value: (row) => formatDate(row.committeeHeld),
    render: (value) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700">
        <svg
          className="h-4 w-4 shrink-0 text-[#185FA5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {value}
      </span>
    ),
  },
  {
    key: "downloadLink",
    header: "REMARKS",
    minWidth: 210,
    render: (value) =>
      value ? (
        <button
          type="button"
          onClick={() => downloadFile(value)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#EAF2FB] px-3 py-1.5 text-xs font-semibold text-[#185FA5] transition hover:bg-[#dcecfb]"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v10m0 0l-4-4m4 4l4-4m-7 8h6"
            />
          </svg>
          Download
        </button>
      ) : (
        <span className="text-sm text-slate-400">-</span>
      ),
  },
];

function PageSummaryBar({ rows }) {
  const latestMeeting = [...rows]
    .sort((a, b) => new Date(b.committeeHeld) - new Date(a.committeeHeld))[0];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span className="min-w-[180px] flex-1 text-sm font-semibold text-slate-700">
        History of House Allotment Committee
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F1FB] px-3 py-1 text-xs font-semibold text-[#0C447C]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#185FA5]" />
          {rows.length} Records
        </span>
        {latestMeeting ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Latest: {formatDate(latestMeeting.committeeHeld)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function HistoryOfHouseAllotmentCommittee() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [committeeHeld, setCommitteeHeld] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let isActive = true;

    getHouseAllotmentCommitteeHistory()
      .then((data) => {
        if (isActive) setRows(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((fetchError) => {
        if (isActive) setError(fetchError?.message || "Failed to load committee history.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!committeeHeld) {
      setUploadError("Committee held date is required.");
      return;
    }

    if (!file) {
      setUploadError("Please select a PDF or Word document.");
      return;
    }

    try {
      setUploading(true);
      const payload = new FormData();
      payload.append("committeeHeld", committeeHeld);
      payload.append("file", file);

      await saveHouseAllotmentCommitteeHistory(payload);

      setCommitteeHeld("");
      setFile(null);
      setUploadOpen(false);
      await getHouseAllotmentCommitteeHistory().then((data) => {
        setRows(Array.isArray(data?.items) ? data.items : []);
      });
    } catch (err) {
      setUploadError(err?.message || "Failed to upload committee record.");
    } finally {
      setUploading(false);
    }
  };

  const selectedCommitteeDate = committeeHeld ? new Date(`${committeeHeld}T00:00:00`) : null;

  return (
    <AdminLayout
      title="History Of House Allotment Committee"
      subtitle="Land Data Management System - Committee Records"
    >

        <PageSummaryBar rows={rows} />

        <div className="lms-data-transition space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <button
            type="button"
            onClick={() => setUploadOpen((v) => !v)}
            className="w-full flex justify-between gap-2 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-4 transition delay-150 duration-300 ease-in-out text-sm font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
          >
            <p>Upload the Application</p>
            <span className="text-lg leading-none">+</span>
          </button>

          {uploadOpen ? (
            <form className="mt-4 grid gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:grid-cols-[3fr_6fr_1fr]" onSubmit={handleUpload}>
              <div className="flex flex-col gap-1">
                <DatePickerCard
                  label="Committee Held Date"
                  selectedDate={selectedCommitteeDate}
                  onSelect={(date) => setCommitteeHeld(date.toISOString().slice(0, 10))}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Upload Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-[#E6F1FB] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#185FA5] hover:file:bg-[#dcecfb]"
                />
                <p className="text-xs text-slate-500">Only PDF, DOC, and DOCX files are allowed.</p>
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition ${
                    uploading ? "cursor-not-allowed bg-slate-400" : "bg-[#185FA5] hover:bg-[#0f477f]"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {uploadError ? (
                <div className="md:col-span-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {uploadError}
                </div>
              ) : null}
            </form>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="w-full overflow-x-auto rounded-xl">
          <AgGridTable
            columns={columns}
            rows={rows}
            searchable
            pageSize={8}
            showExport
            showFilter={false}
            contentAutoWidth={false}
            contentAlign="center"
            emptyMessage={loading ? "Loading committee records..." : "No committee records found."}
            searchPlaceholder="Search committee date..."
          />
        </div>
      </div>
    </AdminLayout>
  );
}
