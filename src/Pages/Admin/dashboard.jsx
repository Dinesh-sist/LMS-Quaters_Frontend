import { useEffect, useState, useMemo } from "react";
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
import { Bar, Doughnut } from "react-chartjs-2";

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
  backgroundColor: "rgba(15, 23, 42, 0.92)",
  titleColor: "#f8fafc",
  bodyColor: "#e2e8f0",
  padding: 10,
  cornerRadius: 8,
  displayColors: true,
  boxWidth: 10,
  boxHeight: 10,
};

// ── Helper to calculate smooth fade-in alpha for data labels after landing animation ──
function getFadeAlpha(chart) {
  if (!chart._labelsFadeStartTime) return 0;
  const fadeDuration = 400; // 400ms smooth fade-in
  const elapsed = Date.now() - chart._labelsFadeStartTime;
  const rawProgress = Math.min(1, Math.max(0, elapsed / fadeDuration));
  const alpha = 1 - Math.pow(1 - rawProgress, 3); // easeOutCubic

  if (rawProgress < 1) {
    requestAnimationFrame(() => {
      if (chart.ctx) chart.draw();
    });
  }
  return alpha;
}

// ── Plugin to draw numerical counts neatly at the right end of each horizontal bar ──
const endBarLabelsPlugin = {
  id: "endBarLabels",
  afterDatasetsDraw(chart) {
    if (!chart._labelsFadeStartTime) {
      return;
    }

    if (chart.options.scales?.x?.stacked) {
      return;
    }

    const alpha = getFadeAlpha(chart);
    if (alpha <= 0) return;

    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const value = dataset.data[index];
          if (value !== undefined && value !== null && value > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#334155";
            ctx.font = "600 11px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(value.toLocaleString("en-IN"), element.x + 8, element.y);
            ctx.restore();
          }
        });
      }
    });
  },
};

function getCategoryStatusOpts(isStacked) {
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    categoryPercentage: isStacked ? 0.55 : 0.82,
    barPercentage: 0.85,
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      onComplete: (context) => {
        if (context.chart && !context.chart._labelsFadeStartTime) {
          context.chart._labelsFadeStartTime = Date.now();
          context.chart.draw();
        }
      },
    },
    animations: {
      x: {
        type: "number",
        easing: "easeOutQuart",
        duration: 1200,
        from: 0,
      },
      y: {
        duration: 0,
      },
      width: {
        type: "number",
        easing: "easeOutQuart",
        duration: 1200,
        from: 0,
      },
      height: {
        duration: 0,
      },
    },
    layout: { padding: { top: 16, bottom: 16, left: 4, right: 64 } },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: "#334155",
          font: { size: 12, weight: "600" },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 16,
        },
      },
      tooltip: {
        ...TOOLTIP,
        callbacks: {
          label: (c) => `  ${c.dataset.label}: ${c.parsed.x.toLocaleString("en-IN")} quarters`,
        },
      },
    },
    scales: {
      x: {
        stacked: isStacked,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#64748b", font: { size: 11 } },
        beginAtZero: true,
      },
      y: {
        stacked: isStacked,
        grid: { display: false },
        ticks: { color: "#1e293b", font: { size: 11, weight: "600" } },
      },
    },
  };
}

// ── Plugin to draw numerical counts at the top of vertical bars ──
const topVerticalBarLabelsPlugin = {
  id: "topVerticalBarLabels",
  afterDatasetsDraw(chart) {
    if (!chart._labelsFadeStartTime) {
      return;
    }

    const alpha = getFadeAlpha(chart);
    if (alpha <= 0) return;

    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta.hidden) {
        meta.data.forEach((element, index) => {
          const value = dataset.data[index];
          if (value !== undefined && value !== null && value > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#334155";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(value.toLocaleString("en-IN"), element.x, element.y - 4);
            ctx.restore();
          }
        });
      }
    });
  },
};

const donutCenterTextPlugin = {
  id: "donutCenterText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const dataset = chart.config.data.datasets[0];
    if (!dataset || !dataset.data || !dataset.data.length) return;

    const total = dataset.data.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

    ctx.save();
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.font = "600 11px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Total", centerX, centerY - 9);

    ctx.font = "bold 17px sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(total.toLocaleString("en-IN"), centerX, centerY + 9);

    ctx.restore();
  },
};

const classDoughnutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1400,
    easing: "easeOutQuart",
    animateRotate: true,
    animateScale: true,
  },
  animations: {
    numbers: {
      type: "number",
      properties: ["circumference", "endAngle"],
      from: 0,
      duration: 1400,
      easing: "easeOutQuart",
    },
  },
  cutout: "52%",
  layout: { padding: { left: 0, right: 36, top: 4, bottom: 4 } },
  plugins: {
    legend: {
      display: true,
      position: "right",
      align: "center",
      labels: {
        color: "#1e293b",
        font: { size: 11, weight: "600" },
        padding: 8,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 15,
      },
    },
    tooltip: {
      ...TOOLTIP,
      callbacks: {
        label: (c) => `  ${c.label}: ${c.parsed.toLocaleString("en-IN")} employees`,
      },
    },
  },
};

const historyChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: "easeOutQuart",
    onComplete: (context) => {
      if (context.chart && !context.chart._labelsFadeStartTime) {
        context.chart._labelsFadeStartTime = Date.now();
        context.chart.draw();
      }
    },
  },
  animations: {
    y: {
      type: "number",
      easing: "easeOutQuart",
      duration: 1200,
      from: (ctx) => (ctx.chart.scales.y ? ctx.chart.scales.y.getPixelForValue(0) : undefined),
    },
    x: { duration: 0 },
    height: { type: "number", easing: "easeOutQuart", duration: 1200, from: 0 },
    width: { duration: 0 },
  },
  layout: { padding: { top: 24, bottom: 4, left: 4, right: 16 } },
  plugins: {
    legend: {
      display: true,
      position: "top",
      align: "end",
      labels: {
        color: "#334155",
        font: { size: 12, weight: "600" },
        usePointStyle: true,
        pointStyle: "circle",
        padding: 16,
      },
    },
    tooltip: {
      ...TOOLTIP,
      padding: 12,
      callbacks: {
        title: (items) => {
          const item = items[0];
          return item ? `${item.label}` : "";
        },
        beforeBody: (items) => {
          const item = items[0];
          if (!item) return [];
          const meta =
            item.dataset?.committeeMeta?.[item.dataIndex] ||
            item.chart?.data?.committeeMeta?.[item.dataIndex];
          if (!meta) return [];
          const lines = [];
          if (meta.fromDate && meta.toDate) {
            lines.push(`Publish Date: ${meta.fromDate} to ${meta.toDate}`);
          }
          if (meta.quarterTypes) {
            lines.push(`Quarter Types: ${meta.quarterTypes}`);
          }
          return lines;
        },
        label: (c) => `  ${c.dataset.label}: ${c.parsed.y.toLocaleString("en-IN")} applications`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#1e293b", font: { size: 11, weight: "600" } },
    },
    y: {
      min: 0,
      max: 100,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#64748b", font: { size: 11 }, stepSize: 10 },
      beginAtZero: true,
    },
  },
};

const CUSTOM_CATEGORY_ORDER = [
  "1 ROOM",
  "A TYPE",
  "B TYPE",
  "B TYPE IIIR",
  "C TYPE",
  "C TYPE (MODIFIED)",
  "D TYPE",
  "E TYPE",
];

const TYPE_BAR_COLORS = [
  "#1ba0b5ff", // Blue
  "#ab3771ff", // Pink
  "#F97316", // Orange
  "#cf774eff", // Purple
  "#EAB308", // Yellow
  "#2eafd7ff", // Light Blue
  "#F472B6", // Light Pink
  "#FB923C", // Light Orange
  "#C084FC", // Light Purple
  "#FDE047", // Light Yellow
];

const typeChartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: "easeOutQuart",
    onComplete: (context) => {
      if (context.chart && !context.chart._labelsFadeStartTime) {
        context.chart._labelsFadeStartTime = Date.now();
        context.chart.draw();
      }
    },
  },
  animations: {
    y: {
      type: "number",
      easing: "easeOutQuart",
      duration: 1200,
      from: (ctx) => (ctx.chart.scales.y ? ctx.chart.scales.y.getPixelForValue(0) : undefined),
    },
    x: {
      duration: 0,
    },
    height: {
      type: "number",
      easing: "easeOutQuart",
      duration: 1200,
      from: 0,
    },
    width: {
      duration: 0,
    },
  },
  layout: { padding: { top: 20, bottom: 4 } },
  plugins: {
    legend: { display: false },
    tooltip: { ...TOOLTIP, callbacks: { label: (c) => `  ${c.label}: ${c.parsed.y} employees` } },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { display: false },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { color: "#64748b", font: { size: 10 }, stepSize: 50 },
      beginAtZero: true,
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
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const yearsList = useMemo(
    () => [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4],
    [currentYear]
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [counts, setCounts] = useState({
    total: "—", occupied: "—", vacant: "—", beyondRepair: "—",
  });

  const [chartMode, setChartMode] = useState("grouped"); // "grouped" | "stacked"

  const [historyChart, setHistoryChart] = useState({
    labels: [],
    committeeMeta: [],
    datasets: [
      {
        label: "Total Applications",
        data: [],
        backgroundColor: "#3B82F6",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 24,
      },
      {
        label: "Approved Applications",
        data: [],
        backgroundColor: "#EC4899",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 24,
      },
    ],
  });

  const [categoryChart, setCategoryChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Occupied",
        data: [],
        backgroundColor: "#3eacbfff",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 20,
      },
      {
        label: "Vacant",
        data: [],
        backgroundColor: "#EC4899",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 20,
      },
      {
        label: "Others",
        data: [],
        backgroundColor: "#F97316",
        borderRadius: 0,
        borderSkipped: false,
        barThickness: 20,
      },
    ],
  });

  const [classChart, setClassChart] = useState({
    labels: [],
    datasets: [{
      label: "Employees",
      data: [],
      backgroundColor: TYPE_BAR_COLORS,
      borderColor: "#ffffff",
      borderWidth: 2,
      hoverOffset: 6,
    }],
  });

  const [typeChart, setTypeChart] = useState({
    labels: [],
    datasets: [{
      label: "Employees",
      data: [],
      backgroundColor: TYPE_BAR_COLORS,
      borderRadius: 0,
      borderSkipped: false,
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

    request("/api/dashboard/estate-quarters/category-status-counts", { auth: true })
      .then((d) => {
        if (!Array.isArray(d)) return;
        const sorted = [...d].sort((a, b) => {
          const catA = String(a.category || "").trim().toUpperCase();
          const catB = String(b.category || "").trim().toUpperCase();
          const idxA = CUSTOM_CATEGORY_ORDER.indexOf(catA);
          const idxB = CUSTOM_CATEGORY_ORDER.indexOf(catB);
          const posA = idxA !== -1 ? idxA : 999;
          const posB = idxB !== -1 ? idxB : 999;
          if (posA !== posB) return posA - posB;
          return catA.localeCompare(catB);
        });

        setCategoryChart({
          labels: sorted.map((i) => i.category),

          datasets: [
            {
              label: "Occupied",
              data: sorted.map((i) => i.occupied),
              backgroundColor: "#219599ff",
              borderRadius: 0,
              borderSkipped: false,
              barThickness: 20,
            },
            {
              label: "Vacant",
              data: sorted.map((i) => i.vacant),
              backgroundColor: "#EC4899",
              borderRadius: 0,
              borderSkipped: false,
              barThickness: 20,
            },
            {
              label: "Others",
              data: sorted.map((i) => i.others),
              backgroundColor: "#F97316",
              borderRadius: 0,
              borderSkipped: false,
              barThickness: 20,
            },
          ],
        });
      })
      .catch(console.error);

    request("/api/dashboard/employees/count-by-class", { auth: true })
      .then((d) => {
        if (!Array.isArray(d)) return;
        const colors = d.map((_, idx) => TYPE_BAR_COLORS[idx % TYPE_BAR_COLORS.length]);
        setClassChart({
          labels: d.map((i) => i.className),
          datasets: [{
            label: "Employees",
            data: d.map((i) => i.count),
            backgroundColor: colors,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 6,
          }],
        });
      })
      .catch(console.error);

    request("/api/dashboard/estate-quarters/employees-by-type", { auth: true })
      .then((d) => {
        if (!Array.isArray(d)) return;
        const activeTypes = d.filter((i) => Number(i.count) > 0);
        const sortedTypes = [...activeTypes].sort((a, b) => {
          const catA = String(a.type || "").trim().toUpperCase();
          const catB = String(b.type || "").trim().toUpperCase();
          const idxA = CUSTOM_CATEGORY_ORDER.indexOf(catA);
          const idxB = CUSTOM_CATEGORY_ORDER.indexOf(catB);
          const posA = idxA !== -1 ? idxA : 999;
          const posB = idxB !== -1 ? idxB : 999;
          if (posA !== posB) return posA - posB;
          return catA.localeCompare(catB);
        });

        const colors = sortedTypes.map((_, idx) => TYPE_BAR_COLORS[idx % TYPE_BAR_COLORS.length]);
        setTypeChart({
          labels: sortedTypes.map((i) => i.type),
          datasets: [{
            label: "Employees",
            data: sortedTypes.map((i) => i.count),
            backgroundColor: colors,
            borderRadius: 0,
            borderSkipped: false,
            barThickness: 24,
          }],
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    request(`/api/dashboard/allotment-committee/history?year=${selectedYear}`, { auth: true })
      .then((d) => {
        if (!d || !Array.isArray(d.committees)) return;
        const comms = d.committees;
        setHistoryChart({
          labels: comms.map((c) => c.committeeName),
          committeeMeta: comms,
          datasets: [
            {
              label: "Total Applications",
              data: comms.map((c) => c.totalApplications),
              committeeMeta: comms,
              backgroundColor: "#2dbdc7ff",
              borderRadius: 0,
              borderSkipped: false,
              barThickness: 24,
            },
            {
              label: "Approved Applications",
              data: comms.map((c) => c.approvedApplications),
              committeeMeta: comms,
              backgroundColor: "#EC4899",
              borderRadius: 0,
              borderSkipped: false,
              barThickness: 24,
            },
          ],
        });
      })
      .catch(console.error);
  }, [selectedYear]);

  const isStacked = chartMode === "stacked";
  const categoryOpts = useMemo(() => getCategoryStatusOpts(isStacked), [isStacked]);

  const rowHeight = isStacked ? 70 : 95;
  const categoryChartHeight = Math.max(380, categoryChart.labels.length * rowHeight + 60);


  return (
    <AdminLayout
      title="Dashboard"
      subtitle="A quick overview of quarter management activity, requests, and notices."
    >
      {/* ══ Stat Cards ══ */}
      <div className="grid w-full grid-cols-2 gap-4 overflow-hidden lg:grid-cols-4">
        {STAT_CARDS.map((card, i) => (
          <div
            key={card.key}
            style={{ animationDelay: `${i * 80}ms` }}
            className={`
              lms-card-land group relative overflow-hidden rounded-2xl border
              p-4 xl:p-5
              transition-all duration-300 ease-out
              hover:-translate-y-0.5
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



      {/* ══ History of House Allotment Committee (Full Wide Chart) ══ */}
      <div className="mt-6 w-full min-w-0">
        <Card
          title="History of House Allotment Committee"
          action={
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              aria-label="Select Year"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {yearsList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          }
        >
          <div className="w-full min-w-0" style={{ height: "clamp(300px, 38vh, 440px)" }}>
            <Bar
              key={`hist-${selectedYear}-${historyChart.datasets[0].data.length}`}
              data={historyChart}
              options={historyChartOpts}
              plugins={[topVerticalBarLabelsPlugin]}
            />
          </div>
        </Card>
      </div>

      {/* ══ Charts ══ */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 mt-6">

        {/* LEFT — Grouped / Stacked Horizontal Bar Chart */}
        <Card
          title="Quarters Breakdown by Category"
          action={
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChartMode("grouped")}
                className={`rounded-md px-2.5 py-1 transition-all ${chartMode === "grouped"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Grouped
              </button>
              <button
                type="button"
                onClick={() => setChartMode("stacked")}
                className={`rounded-md px-2.5 py-1 transition-all ${chartMode === "stacked"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                Stacked
              </button>
            </div>
          }
        >
          <div className="w-full min-w-0 max-h-[520px] overflow-y-auto pr-1">
            <div style={{ height: `${categoryChartHeight}px`, minHeight: "380px" }}>
              <Bar key={`cat-${categoryChart.labels.length}-${chartMode}`} data={categoryChart} options={categoryOpts} plugins={[endBarLabelsPlugin]} />
            </div>
          </div>
        </Card>

        {/* RIGHT — two stacked */}
        <div className="flex min-w-0 flex-col gap-6">

          <Card title="Number of Employees by Class">
            <div className="w-full min-w-0" style={{ height: "clamp(210px, 25vh, 280px)" }}>
              {classChart.labels.length > 0 && (
                <Doughnut
                  key={`cls-${classChart.labels.join("-")}`}
                  data={classChart}
                  options={classDoughnutOpts}
                  plugins={[donutCenterTextPlugin]}
                />
              )}
            </div>
          </Card>

          <Card title="Number of Employees by Quarter Type" className="flex-1">
            <div className="flex flex-col gap-3">
              <div className="w-full min-w-0" style={{ height: "clamp(180px, 22vh, 260px)" }}>
                <Bar key={`type-${typeChart.labels.length}`} data={typeChart} options={typeChartOpts} plugins={[topVerticalBarLabelsPlugin]} />
              </div>
              {typeChart.labels.length > 0 && (
                <div className="grid grid-cols-3 gap-x-6 gap-y-2 pt-2.5 border-t border-slate-100 text-[11px] font-semibold text-slate-700">
                  {typeChart.labels.map((label, idx) => (
                    <div key={label} className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: TYPE_BAR_COLORS[idx % TYPE_BAR_COLORS.length] }}
                      />
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
