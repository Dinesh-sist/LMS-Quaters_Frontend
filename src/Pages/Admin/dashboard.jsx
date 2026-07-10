import { useEffect, useState } from "react";
import AdminLayout from "./AdminUI/AdminLayout";
import { Files, HouseHeart, HousePlus, Users } from "lucide-react";
import { request } from "../../api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Number of Quarters",
    cardBg: "border-amber-300/70 bg-gradient-to-br from-amber-600 via-orange-400 to-amber-400",
    hoverBg: "bg-gradient-to-br from-amber-700 via-orange-500 to-yellow-300",
    icon: <HouseHeart size={18} strokeWidth={1.8} />,
  },
  {
    key: "occupied",
    label: "Number of Occupied Quarters",
    cardBg: "border-sky-300/70 bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-400",
    hoverBg: "bg-gradient-to-br from-blue-800 via-sky-600 to-cyan-200",
    icon: <Users size={18} strokeWidth={1.8} />,
  },
  {
    key: "vacant",
    label: "Number of Vacant Quarters",
    cardBg: "border-emerald-300/70 bg-gradient-to-br from-teal-700 via-emerald-500 to-lime-400",
    hoverBg: "bg-gradient-to-br from-teal-800 via-emerald-600 to-lime-200",
    icon: <HousePlus size={18} strokeWidth={1.8} />,
  },
  {
    key: "beyondRepair",
    label: "Number of Quarters Beyond Repair",
    cardBg: "border-rose-300/70 bg-gradient-to-br from-red-700 via-rose-500 to-pink-400",
    hoverBg: "bg-gradient-to-br from-red-800 via-rose-600 to-pink-200",
    icon: <Files size={18} strokeWidth={1.8} />,
  },
];

const TOOLTIP = {
  backgroundColor: "rgba(15, 23, 42, 0.88)",
  titleColor: "#f1f5f9",
  bodyColor: "#cbd5e1",
  padding: 10,
  cornerRadius: 6,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
};

// ── Quarter Type chart: horizontal bars, 1 row per type ──
// BAR_HEIGHT_PX = pixels allocated per row (label + bar + gap)
// The chart height is calculated dynamically based on actual row count
const BAR_HEIGHT_PX = 44; // px per bar row — feels spacious, not cramped
const BAR_MIN_HEIGHT = 300;

function makeQuarterTypeOpts() {
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    animation: { x: { duration: 1400, easing: "easeOutQuart", from: 0 } },
    layout: { padding: { top: 8, bottom: 8, left: 4, right: 16 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...TOOLTIP,
        callbacks: { label: (c) => `  ${c.parsed.x} employees` },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#64748b", font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: "#1e293b",
          font: { size: 11, weight: "500" },
          showLabelBackdrop: true,
          backdropColor: "rgba(241,245,249,0.85)",
          backdropPadding: { x: 6, y: 3 },
          // Ensure long labels don't get cut
          maxRotation: 0,
          autoSkip: false,
        },
      },
    },
  };
}


const employeeClassOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1400, easing: "easeOutQuart" },
  plugins: {
    legend: { display: false },
    tooltip: { ...TOOLTIP, callbacks: { label: (c) => `  ${c.parsed.y} employees` } },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#1e293b", font: { size: 10, weight: "500" }, maxRotation: 0 },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#64748b", font: { size: 10 } },
    },
  },
};


const pieOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1400, easing: "easeOutQuart", animateRotate: true, animateScale: true },
  plugins: {
    legend: {
      display: true,
      position: "right",
      labels: {
        color: "#1e293b",
        font: { size: 11, weight: "500" },
        padding: 14,
        usePointStyle: true,
        pointStyleWidth: 9,
      },
    },
    tooltip: {
      ...TOOLTIP,
      callbacks: { label: (c) => `  ${c.label}: ${c.parsed} applications` },
    },
  },
};

function Card({ title, action, children, className = "" }) {
  return (
    <div
      className={`
        w-full min-w-0 rounded-2xl border border-slate-200
        bg-white/95 p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]
        ${className}
      `}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="truncate text-sm font-semibold text-slate-800">{title}</h2>
        {action && <span className="shrink-0 text-xs text-slate-400">{action}</span>}
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    total: "—", occupied: "—", vacant: "—", beyondRepair: "—",
  });

  const [typeChart, setTypeChart] = useState({
    labels: [],
    datasets: [{
      label: "Employees",
      data: [],
      backgroundColor: "#378ADD",
      borderRadius: 4,
      borderSkipped: false,
      categoryPercentage: 0.7,  // leaves breathing room between bars
      barPercentage: 0.8,
    }],
  });

  const [classChart, setClassChart] = useState({
    labels: [],
    datasets: [{
      label: "Employees",
      data: [],
      backgroundColor: ["#7F77DD", "#534AB7", "#1D9E75", "#EF9F27", "#D85A30"],
      borderRadius: 4,
      borderSkipped: false,
      barThickness: 32,
    }],
  });

  const [pieChart, setPieChart] = useState({
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [{
      data: [],
      backgroundColor: ["#EF9F27", "#1D9E75", "#E24B4A"],
      borderColor: ["#fff", "#fff", "#fff"],
      borderWidth: 3,
      hoverOffset: 8,
    }],
  });

  useEffect(() => {
    const fmt = (n) => Number(n || 0).toLocaleString("en-IN");

    request("/api/dashboard/estate-quarters/total-count", { auth: true })
      .then((d) => setCounts((p) => ({ ...p, total: fmt(d.total) })))
      .catch(console.error);

    request("/api/dashboard/estate-quarters/status-counts", { auth: true })
      .then((d) => setCounts((p) => ({
        ...p,
        occupied: fmt(d.occupied),
        vacant: fmt(d.vacant),
        beyondRepair: fmt(d.beyondRepair),
      })))
      .catch(console.error);

    request("/api/dashboard/estate-quarters/employees-by-type", { auth: true })
      .then((d) => {
        if (!Array.isArray(d)) return;
        setTypeChart((p) => ({
          ...p,
          labels: d.map((i) => i.type),
          datasets: [{ ...p.datasets[0], data: d.map((i) => i.count) }],
        }));
      })
      .catch(console.error);

    request("/api/dashboard/employees/count-by-class", { auth: true })
      .then((d) => {
        if (!Array.isArray(d)) return;
        setClassChart((p) => ({
          ...p,
          labels: d.map((i) => i.className),
          datasets: [{ ...p.datasets[0], data: d.map((i) => i.count) }],
        }));
      })
      .catch(console.error);

    request("/api/dashboard/applications/status-counts", { auth: true })
      .then((d) => {
        if (!d) return;
        setPieChart((p) => ({
          ...p,
          datasets: [{ ...p.datasets[0], data: [d.pending || 0, d.approved || 0, d.rejected || 0] }],
        }));
      })
      .catch(console.error);
  }, []);

  // ── Dynamic height: 44px per bar row, min 300px ──
  // This ensures 10 rows get 440px, 5 rows get 300px, etc.
  const typeChartHeight = Math.max(
    BAR_MIN_HEIGHT,
    typeChart.labels.length * BAR_HEIGHT_PX + 60  // +60 for x-axis + padding
  );

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="A quick overview of quarter management activity, requests, and notices."
    >

      {/* ══ Stat Cards ══
          `w-full` + `overflow-hidden` on the grid prevents any card from
          exceeding the available content-area width.
      */}
      <div className="grid w-full grid-cols-2 gap-3 overflow-hidden lg:grid-cols-4">
        {STAT_CARDS.map((card, i) => (
          <div
            key={card.key}
            style={{ animationDelay: `${i * 80}ms` }}
            className={`
              lms-card-land group relative overflow-hidden rounded-2xl border
              p-3 xl:p-4
              shadow-[0_8px_24px_rgba(15,23,42,0.10)]
              transition-all duration-300 ease-out
              hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.18)]
              ${card.cardBg}
            `}
          >
            <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${card.hoverBg}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_40%)]" />

            <div className="relative flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[clamp(0.55rem,0.85vw,0.68rem)] font-semibold uppercase tracking-[0.14em] text-white/80 leading-tight">
                  {card.label}
                </p>
                <p className="mt-2 text-[clamp(1.3rem,2vw,1.85rem)] font-bold tracking-tight leading-none text-white">
                  {counts[card.key]}
                </p>
              </div>
              <div className="shrink-0 rounded-xl bg-white/20 p-2 ring-1 ring-white/30 text-white">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══ Charts ══ */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">

        {/* LEFT — Quarter Type horizontal bar
            Height is DYNAMIC: 44px × number of rows so every bar has room.
            No more cramped or clipped labels.
        */}
        <Card title="Employees by Quarter Type">
          <div
            className="w-full min-w-0"
            style={{ height: `${typeChartHeight}px` }}
          >
            <Bar data={typeChart} options={makeQuarterTypeOpts()} />
          </div>
        </Card>

        {/* RIGHT — two stacked */}
        <div className="flex min-w-0 flex-col gap-4">

          <Card title="Employees by Class">
            <div className="w-full min-w-0" style={{ height: "clamp(150px, 17vh, 220px)" }}>
              <Bar data={classChart} options={employeeClassOpts} />
            </div>
          </Card>

          <Card title="Applications by Status" className="flex-1">
            <div className="w-full min-w-0" style={{ height: "clamp(160px, 19vh, 240px)" }}>
              <Pie data={pieChart} options={pieOpts} />
            </div>
          </Card>

        </div>
      </div>

    </AdminLayout>
  );
}

