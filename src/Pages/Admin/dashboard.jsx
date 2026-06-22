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

const stats = [
  {
    label: "Total Number of Quarters",
    value: "1,714",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-amber-300/70 bg-gradient-to-br from-amber-600 via-orange-400 to-amber-400",
    hoverBg: "bg-gradient-to-br from-amber-700 via-orange-500 to-yellow-300",
    valueColor: "text-white",
    icon: <HouseHeart size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of Occupied Quarters",
    value: "17",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-sky-300/70 bg-gradient-to-br from-blue-700 via-sky-500 to-cyan-400",
    hoverBg: "bg-gradient-to-br from-blue-800 via-sky-600 to-cyan-200",
    valueColor: "text-white",
    icon: <Users size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of Vacant Quarters",
    value: "14",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-emerald-300/70 bg-gradient-to-br from-teal-700 via-emerald-500 to-lime-400",
    hoverBg: "bg-gradient-to-br from-teal-800 via-emerald-600 to-lime-200",
    valueColor: "text-white",
    icon: <HousePlus size={20} strokeWidth={1.8} />,
  },
  {
    label: "Number of quaters beyond repair",
    value: "8",
    accent: "bg-white/25 text-white ring-1 ring-white/35",
    cardBg: "border-rose-300/70 bg-gradient-to-br from-red-700 via-rose-500 to-pink-400",
    hoverBg: "bg-gradient-to-br from-red-800 via-rose-600 to-pink-200",
    valueColor: "text-white",
    icon: <Files size={20} strokeWidth={1.8} />,
  },
];

function SectionCard({ title, action, delay = 0, children }) {
  return (
    <section
      className="lms-card-land rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {action ? <span className="text-xs font-medium text-slate-400">{action}</span> : null}
      </div>
      {children}
    </section>
  );
}

// Shared dark tooltip style
const TOOLTIP_STYLE = {
  backgroundColor: "rgba(15, 23, 42, 0.88)",
  titleColor: "#f1f5f9",
  bodyColor: "#cbd5e1",
  padding: 10,
  cornerRadius: 6,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
};

const quarterTypeChartOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  animations: {
    x: {
      duration: 1600,
      easing: "easeOutQuart",
      from: 0,
    },
  },
  layout: { padding: { top: 4, bottom: 4 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...TOOLTIP_STYLE,
      callbacks: { label: (ctx) => `  ${ctx.parsed.x} employees` },
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
        backdropColor: "rgba(241,245,249,0.85)",
        backdropPadding: { x: 6, y: 3 },
        showLabelBackdrop: true,
      },
    },
  },
};

const employeeClassChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animations: {
    y: {
      duration: 1600,
      easing: "easeOutQuart",
      from: (ctx) => {
        if (ctx.type === "data" && ctx.mode === "default") {
          return ctx.chart.scales.y.getPixelForValue(0);
        }
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      ...TOOLTIP_STYLE,
      callbacks: { label: (ctx) => `  ${ctx.parsed.y} employees` },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#1e293b",
        font: { size: 10, weight: "500" },
        backdropColor: "rgba(241,245,249,0.85)",
        backdropPadding: { x: 5, y: 2 },
        showLabelBackdrop: true,
      },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#64748b", font: { size: 10 } },
    },
  },
};

const applicationStatusPieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1600,
    easing: "easeOutQuart",
    animateRotate: true,
    animateScale: true,
  },
  plugins: {
    legend: {
      display: true,
      position: "right",
      labels: {
        color: "#1e293b",
        font: { size: 12, weight: "500" },
        padding: 16,
        usePointStyle: true,
        pointStyleWidth: 10,
      },
    },
    tooltip: {
      ...TOOLTIP_STYLE,
      callbacks: { label: (ctx) => `  ${ctx.label}: ${ctx.parsed} applications` },
    },
  },
};

export default function AdminDashboard() {
  const [totalQuarters, setTotalQuarters] = useState("...");
  const [quarterCounts, setQuarterCounts] = useState({
    occupied: "...",
    vacant: "...",
    beyondRepair: "...",
  });

  // ── Chart Data States ──
  const [quarterTypeChartData, setQuarterTypeChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Employees",
        data: [],
        backgroundColor: "#378ADD",
        borderRadius: 0,
        borderSkipped: false,
        categoryPercentage: 1.0,
        barPercentage: 0.45,
      },
    ],
  });

  const [employeeClassChartData, setEmployeeClassChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Employees",
        data: [],
        backgroundColor: ["#7F77DD", "#534AB7", "#1D9E75", "#EF9F27", "#D85A30"],
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 38,
      },
    ],
  });

  const [applicationStatusPieData, setApplicationStatusPieData] = useState({
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#EF9F27", "#1D9E75", "#E24B4A"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  });

  // ── Load Top Stats ──
  useEffect(() => {
    async function loadTotalQuarters() {
      try {
        const data = await request("/api/dashboard/estate-quarters/total-count", { auth: true });
        setTotalQuarters(Number(data.total || 0).toLocaleString("en-IN"));
      } catch (err) {
        console.error("Total quarters count error:", err);
        setTotalQuarters("0");
      }
    }

    async function loadQuarterStatusCounts() {
      try {
        const data = await request("/api/dashboard/estate-quarters/status-counts", { auth: true });
        setQuarterCounts({
          occupied: Number(data.occupied || 0).toLocaleString("en-IN"),
          vacant: Number(data.vacant || 0).toLocaleString("en-IN"),
          beyondRepair: Number(data.beyondRepair || 0).toLocaleString("en-IN"),
        });
      } catch (err) {
        console.error("Quarter status counts error:", err);
      }
    }

    loadTotalQuarters();
    loadQuarterStatusCounts();
  }, []);

  // ── Load Quarter Type Chart Data ──
  useEffect(() => {
    async function loadEmployeesByType() {
      try {
        const data = await request("/api/dashboard/estate-quarters/employees-by-type", { auth: true });
        if (data && Array.isArray(data)) {
          const labels = data.map((item) => item.type);
          const counts = data.map((item) => item.count);

          setQuarterTypeChartData((prev) => ({
            ...prev,
            labels,
            datasets: [
              {
                ...prev.datasets[0],
                data: counts,
              },
            ],
          }));
        }
      } catch (err) {
        console.error("Employees by quarter type error:", err);
      }
    }

    loadEmployeesByType();
  }, []);

  // ── Load Employee Class Chart Data ──
  useEffect(() => {
    async function loadEmployeesByClass() {
      try {
        const data = await request("/api/dashboard/employees/count-by-class", { auth: true });
        if (data && Array.isArray(data)) {
          const labels = data.map((item) => item.className);
          const counts = data.map((item) => item.count);

          setEmployeeClassChartData((prev) => ({
            ...prev,
            labels,
            datasets: [
              {
                ...prev.datasets[0],
                data: counts,
              },
            ],
          }));
        }
      } catch (err) {
        console.error("Employees by class error:", err);
      }
    }

    loadEmployeesByClass();
  }, []);

  // ── Load Application Status Chart Data ──
  useEffect(() => {
    async function loadApplicationStatus() {
      try {
        const data = await request("/api/dashboard/applications/status-counts", { auth: true });
        if (data) {
          const statusData = [data.pending || 0, data.approved || 0, data.rejected || 0];

          setApplicationStatusPieData((prev) => ({
            ...prev,
            datasets: [
              {
                ...prev.datasets[0],
                data: statusData,
              },
            ],
          }));
        }
      } catch (err) {
        console.error("Applications by status error:", err);
      }
    }

    loadApplicationStatus();
  }, []);

  const dashboardStats = stats.map((item) => {
    if (item.label === "Total Number of Quarters") return { ...item, value: totalQuarters };
    if (item.label === "Number of Occupied Quarters") return { ...item, value: quarterCounts.occupied };
    if (item.label === "Number of Vacant Quarters") return { ...item, value: quarterCounts.vacant };
    if (item.label === "Number of quaters beyond repair") return { ...item, value: quarterCounts.beyondRepair };
    return item;
  });

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="A quick overview of quarter management activity, requests, and notices."
    >
      {/* ── Top 4 Stat Cards ── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item, index) => (
          <div
            key={item.label}
            className={`lms-card-land group relative overflow-hidden rounded-3xl border p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.18)] ${item.cardBg}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 ${item.hoverBg}`} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.38),transparent_34%)] transition-opacity duration-500 ease-out group-hover:opacity-90" />
            <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-500 ease-out group-hover:bg-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
                  {item.label}
                </p>
                <p className={`mt-4 text-3xl font-semibold tracking-tight ${item.valueColor}`}>
                  {item.value}
                </p>
              </div>
              <div className={`rounded-2xl p-3 ${item.accent}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Charts Section ── */}
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">

        <SectionCard title="Employees by Quarter Type" delay={380}>
          <div className="h-[480px]">
            <Bar data={quarterTypeChartData} options={quarterTypeChartOptions} />
          </div>
        </SectionCard>

        <div className="flex flex-col gap-4">

          <SectionCard title="Employees by Class" delay={470}>
            <div className="h-44">
              <Bar data={employeeClassChartData} options={employeeClassChartOptions} />
            </div>
          </SectionCard>

          <SectionCard title="Applications by Status" delay={560}>
            <div className="h-52">
              <Pie data={applicationStatusPieData} options={applicationStatusPieOptions} />
            </div>
          </SectionCard>

        </div>
      </section>
    </AdminLayout>
  );
}