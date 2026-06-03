import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, Info, Save } from "lucide-react";
import AdminLayout from "./AdminUI/AdminLayout";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

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

function DatePickerCard({ label, selectedDate, onSelect }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate || new Date()));
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const calendarDays = getCalendarDays(visibleMonth);

  const changeMonth = (offset) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={pickerRef} className="relative z-20 min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <Info size={15} className="text-slate-400" />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white px-4 text-left shadow-[0_0_0_3px_rgba(232,119,34,0.08)] transition hover:border-[#e87722] hover:shadow-[0_0_0_4px_rgba(232,119,34,0.12)]"
        aria-expanded={isOpen}
      >
        <span className="flex min-w-0 items-center gap-3">
          <CalendarDays size={19} className="shrink-0 text-slate-500" />
          <span className="truncate text-sm font-medium text-slate-900">
            {selectedDate ? fullDateFormatter.format(selectedDate) : "Pick a date"}
          </span>
        </span>
        <ChevronDown size={17} className="shrink-0 text-slate-500" />
      </button>

      {isOpen ? (
      <div className="absolute left-0 right-0 top-[px] z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_38px_rgba(15,23,42,0.16)]">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
            aria-label={`Previous month for ${label}`}
          >
            <ChevronLeft size={18} />
          </button>

          <h3 className="text-base font-semibold text-slate-950">{monthFormatter.format(visibleMonth)}</h3>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#e87722]"
            aria-label={`Next month for ${label}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((weekday) => (
            <div key={weekday} className="py-1 text-sm font-medium text-slate-500">
              {weekday}
            </div>
          ))}

          {calendarDays.map((day) => {
            const isSelected = isSameDate(day, selectedDate);
            const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();

            return (
              <button
                type="button"
                key={day.toISOString()}
                onClick={() => {
                  onSelect(new Date(day));
                  setIsOpen(false);
                }}
                className={`relative mx-auto mt-2 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? "bg-[#ff694f] text-white shadow-[0_10px_18px_rgba(255,105,79,0.26)]"
                    : isOutsideMonth
                      ? "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
                      : "text-slate-950 hover:bg-orange-50 hover:text-[#e87722]"
                }`}
              >
                {isSelected ? (
                  <span className="absolute right-2 top-1 h-1 w-1 rounded-full bg-white/80" />
                ) : null}
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      ) : null}
    </div>
  );
}

export default function SetDateForApplication() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const formatPreviewDate = (date, fallback) => (date ? fullDateFormatter.format(date) : fallback);

  return (
    <AdminLayout
      title="Set Date for Application"
      subtitle="Control the application window for employee quarter requests."
    >
      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="lms-card-land overflow-visible rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-[#e87722]">
              <CalendarDays size={23} strokeWidth={1.9} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Application Open Period</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select From and To date for opening the Quater Application for employee
              </p>
            </div>
          </div>

          <div className="relative z-20 grid gap-5 lg:grid-cols-2">
            <DatePickerCard label="From Date" selectedDate={fromDate} onSelect={setFromDate} />
            <DatePickerCard label="To Date" selectedDate={toDate} onSelect={setToDate} />
          </div>

          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <Info size={18} className="mt-0.5 shrink-0 text-[#e87722]" />
              <p className="text-sm leading-6 text-slate-600">
                Employees will be able to submit quarter applications only during the selected
                date range. Keep both dates updated before publishing the application window.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setFromDate(null);
                setToDate(null);
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#e87722] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,119,34,0.24)] transition hover:bg-[#d76516] hover:shadow-[0_14px_30px_rgba(232,119,34,0.3)]"
            >
              <Save size={17} />
              Save Date Window
            </button>
          </div>
        </div>

        <aside className="lms-card-land rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-[#e87722] p-6 text-white shadow-[0_18px_46px_rgba(15,23,42,0.16)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">
                Current Window
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                {fromDate && toDate ? "Ready to Publish" : "Not Published"}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Clock size={22} />
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                From Date
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatPreviewDate(fromDate, "Select start date")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/15">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                To Date
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatPreviewDate(toDate, "Select end date")}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
            <p className="text-sm leading-6 text-white/78">
              Once saved, this date range will become the active application period shown to
              employees in the quarter application section.
            </p>
          </div>
        </aside>
      </section>
    </AdminLayout>
  );
}
