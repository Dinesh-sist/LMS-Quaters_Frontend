import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, Info, Save } from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";
import Popup from "../../Components/Popup";
import { publishApplication, getLatestPublication, stopPublication, updatePublication } from "../../api";
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

function DatePickerCard({ label, selectedDate, onSelect, minDate = null, disabled = false }) {
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
        onClick={() => { setIsOpen((v) => !v); setShowMonthPanel(false); setShowYearPanel(false); }}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white px-4 text-left shadow-[0_0_0_3px_rgba(232,119,34,0.08)] transition-colors hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"
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
          {/* ── Header ── */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
            >
              <ChevronLeft size={17} />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => { setShowMonthPanel((v) => !v); setShowYearPanel(false); }}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition ${showMonthPanel
                  ? "border-orange-300 bg-orange-50 text-[#e87722]"
                  : "border-transparent text-slate-900 hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
                  }`}
              >
                {MONTHS_FULL[visibleMonth.getMonth()]}
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => { setShowYearPanel((v) => !v); setShowMonthPanel(false); setYearPageStart(Math.floor(visibleMonth.getFullYear() / 12) * 12); }}
                className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition ${showYearPanel
                  ? "border-orange-300 bg-orange-50 text-[#e87722]"
                  : "border-transparent text-slate-900 hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
                  }`}
              >
                {visibleMonth.getFullYear()}
                <ChevronDown size={12} className="text-slate-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          {/* ── Month panel ── */}
          {showMonthPanel && (
            <div className="mb-3 rounded-xl border border-orange-200 bg-orange-50 p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-900">
                Select month
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {MONTHS_SHORT.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => goToMonth(i)}
                    className={`rounded-lg border py-1.5 text-xs font-medium transition ${i === visibleMonth.getMonth()
                      ? "border-[#e87722] bg-[#e87722] text-white shadow-[0_4px_10px_rgba(232,119,34,0.3)]"
                      : "border-transparent text-slate-700 hover:border-orange-300 hover:bg-orange-100 hover:text-[#c2410c]"
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Year panel ── */}
          {showYearPanel && (
            <div className="mb-3 rounded-xl border border-orange-200 bg-orange-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-900">
                  Select year
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setYearPageStart((y) => y - 12)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-200 bg-white text-orange-700 transition hover:bg-orange-100"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setYearPageStart((y) => y + 12)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-200 bg-white text-orange-700 transition hover:bg-orange-100"
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
                    className={`rounded-lg border py-1.5 text-xs font-medium transition ${year === visibleMonth.getFullYear()
                      ? "border-[#e87722] bg-[#e87722] text-white shadow-[0_4px_10px_rgba(232,119,34,0.3)]"
                      : "border-transparent text-slate-700 hover:border-orange-300 hover:bg-orange-100 hover:text-[#c2410c]"
                      }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Day grid ── */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((wd) => (
              <div key={wd} className="py-1 text-xs font-medium text-slate-500">{wd}</div>
            ))}
            {calendarDays.map((day) => {
              const isSelected = isSameDate(day, selectedDate);

              const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();

              const normalizedDay = new Date(day);

              normalizedDay.setHours(0, 0, 0, 0);

              const normalizedMinDate = minDate
                ? new Date(minDate)
                : null;

              if (normalizedMinDate) {
                normalizedMinDate.setHours(0, 0, 0, 0);
              }
              const isDisabled =
                normalizedMinDate
                  ? normalizedDay < normalizedMinDate
                  : false;
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
                  className={`relative mx-auto mt-1.5 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${isDisabled
                    ? "cursor-not-allowed text-slate-200"
                    : isSelected
                      ? "bg-[#ff694f] text-white shadow-[0_6px_14px_rgba(255,105,79,0.3)]"
                      : isOutsideMonth
                        ? "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
                        : "text-slate-950 hover:bg-orange-50 hover:text-[#e87722]"
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

export default function SetDateForApplication() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const [currentWindow, setCurrentWindow] = useState(null);
  const [popup, setPopup] = useState({
    open: false,
    title: "",
    message: "",
    variant: "success",
  });
  const [isAltering, setIsAltering] = useState(false);
  const isPublished =
    currentWindow?.Current_State === "Published";
  const loadCurrentWindow = async () => {
    try {
      const data = await getLatestPublication();


      setCurrentWindow(data);
    } catch (err) {
      console.error("Failed to load publication:", err);
    }
  };
  const formatPreviewDate = (date, fallback) =>
    date ? fullDateFormatter.format(date) : fallback;

  const handleFromDate = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setDateError("From Date cannot be earlier than today's date.");
      return;
    }

    setFromDate(date);
    setDateError("");

    if (toDate && date >= toDate) {
      setDateError("From date must be earlier than To date.");
      setToDate(null);
    }
  };
  const handleToDate = (date) => {
    const compareDate = isAltering
      ? new Date(currentWindow?.From_Date)
      : fromDate;

    if (compareDate && date <= compareDate) {
      setDateError("To Date must be later than From Date.");
      return;
    }

    setToDate(date);
    setDateError("");
  };

  const formatDateForApi = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handlePublish = async () => {
    if (isAltering) {
      if (!toDate) {
        setDateError("Please select a To Date.");
        return;
      }
    } else {
      if (!fromDate || !toDate) {
        setDateError(
          "Please select both From and To dates before publishing."
        );
        return;
      }
    }

    try {

      if (isAltering) {
        await updatePublication({
          toDate: formatDateForApi(toDate),
        });

        setPopup({
          open: true,
          title: "Publication Updated",
          message: "Application window has been updated successfully.",
          variant: "success",
        });
      } else {
        await publishApplication({
          fromDate: formatDateForApi(fromDate),
          toDate: formatDateForApi(toDate),
        });

        setPopup({
          open: true,
          title: "Published Successfully",
          message: "Application window has been published.",
          variant: "success",
        });
      }

      await loadCurrentWindow();

      setFromDate(null);
      setToDate(null);
      setIsAltering(false);
      setDateError("");

    } catch (error) {
      console.error("Publish Error:", error);

      setPopup({
        open: true,
        title: isAltering ? "Update Failed" : "Publish Failed",
        message: error?.message || "Something went wrong.",
        variant: "error",
      });
    }
  };
  useEffect(() => {
    loadCurrentWindow();
  }, []);

  const handleStopPublication = async () => {
    try {
      await stopPublication();

      await loadCurrentWindow();

      setPopup({
        open: true,
        title: "Publication Stopped",
        message: "Application window has been closed.",
        variant: "success",
      });

    } catch (error) {
      setPopup({
        open: true,
        title: "Failed",
        message: error?.message || "Unable to stop publication.",
        variant: "error",
      });
    }
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleUpdatePublication = async () => {
    try {
      if (!toDate) {
        setDateError("Please select a To Date.");
        return;
      }

      await updatePublication({
        toDate: `${toDate.getFullYear()}-${String(
          toDate.getMonth() + 1
        ).padStart(2, "0")}-${String(toDate.getDate()).padStart(2, "0")}`,
      });

      await loadCurrentWindow();

      setIsAltering(false);
      setToDate(null);

      setPopup({
        open: true,
        title: "Publication Updated",
        message: "Publication end date updated successfully.",
        variant: "success",
      });
    } catch (error) {
      setPopup({
        open: true,
        title: "Update Failed",
        message: error?.message || "Failed to update publication.",
        variant: "error",
      });
    }
  };

  return (
    <AdminLayout
      title="Set Date for Application"
      subtitle="Control the application window for employee quarter requests."
    >
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">

        {/* ── Left card ── */}
        <div className="lms-card-land w-full overflow-visible rounded-3xl border border-slate-200 bg-white/95 p-4 sm:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-[#e87722]">
              <CalendarDays size={21} strokeWidth={1.9} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Application Open Period
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-6 text-slate-500">
                Select From and To date for opening the Quarter Application for employee
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DatePickerCard
              label="From Date"
              selectedDate={
                isAltering
                  ? new Date(currentWindow?.From_Date)
                  : fromDate
              } onSelect={handleFromDate}
              minDate={today}
              disabled={isPublished}
            />
            <DatePickerCard
              label="To Date"
              selectedDate={toDate}
              onSelect={handleToDate}
              minDate={
                isAltering
                  ? new Date(
                    new Date(currentWindow?.From_Date).setDate(
                      new Date(currentWindow?.From_Date).getDate() + 1
                    )
                  )
                  : fromDate
              }
              disabled={isPublished && !isAltering}
            />
          </div>

          {dateError && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <Info size={15} className="shrink-0 text-red-500" />
              <p className="text-xs font-medium text-red-600">{dateError}</p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-start gap-3">
              <Info size={17} className="mt-0.5 shrink-0 text-[#e87722]" />
              <p className="text-xs sm:text-sm leading-6 text-slate-600">
                Employees will be able to submit quarter applications only during the selected
                date range. Keep both dates updated before publishing the application window.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={
                isAltering
                  ? handleUpdatePublication
                  : handlePublish
              } disabled={isPublished && !isAltering}
              className={`inline-flex h-10 sm:h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white transition
                ${isPublished && !isAltering
                  ? "cursor-not-allowed bg-slate-400 shadow-none"
                  : "bg-[#e87722] shadow-[0_10px_24px_rgba(232,119,34,0.24)] hover:bg-[#d76516]"
                }`}
            >
              <Save size={17} />
              {
                isAltering
                  ? "Update Publication"
                  : isPublished
                    ? "Published"
                    : "Publish"
              }            </button>
          </div>
        </div>

        {/* ── Right aside — light theme ── */}
        <aside className={`lms-card-land rounded-3xl border border-slate-200  p-4 sm:p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] ${isPublished ? "ring-1 ring-green-300 bg-green-50" : "ring-1 ring-red-300 bg-red-50"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-900/60">
                Current Window
              </p>
              <h2 className="mt-3 text-xl sm:text-2xl font-semibold text-blue-900">
                {isPublished ? "Published" : "Not Published"}
              </h2>
            </div>
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 ring-1 ring-orange-200">
              <Clock size={20} className="text-orange-400" />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 grid gap-3">
            <div className="rounded-2xl bg-blue-900/5 p-4 ring-1 ring-blue-900/10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-900/50">
                From Date
              </p>
              <p className="mt-2 text-base sm:text-lg font-semibold text-blue-900">
                {isPublished
                  ? formatPreviewDate(new Date(currentWindow.From_Date))
                  : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-blue-900/5 p-4 ring-1 ring-blue-900/10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-900/50">
                To Date
              </p>
              <p className="mt-2 text-base sm:text-lg font-semibold text-blue-900">
                {isPublished
                  ? formatPreviewDate(new Date(currentWindow.To_Date))
                  : "-"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                if (!isAltering) {
                  setToDate(new Date(currentWindow.To_Date));
                  setIsAltering(true);

                  setPopup({
                    open: true,
                    title: "Alter Mode Enabled",
                    message: "You can now modify the publication end date.",
                    variant: "info",
                  });
                } else {
                  setFromDate(null);
                  setToDate(null);
                  setDateError("");
                  setIsAltering(false);

                  setPopup({
                    open: true,
                    title: "Alter Cancelled",
                    message: "Publication dates remain unchanged.",
                    variant: "info",
                  });
                }
              }}
              disabled={!isPublished}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition
                ${isPublished
                  ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  : "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
            >
              {isAltering ? "Cancel" : "Alter"}
            </button>

            <button
              type="button"
              onClick={handleStopPublication}
              disabled={!isPublished}
              className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition
            ${isPublished
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-slate-400 cursor-not-allowed"
                }`}
            >
              Stop Publication
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {isPublished ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-xs font-semibold text-green-600">
                  Window is currently published
                </p>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <p className="text-xs font-semibold text-red-600">
                  Window is not published
                </p>
              </>
            )}
          </div>
        </aside>

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