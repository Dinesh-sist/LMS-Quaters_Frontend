import { useEffect, useRef } from "react";
import TopNavbar from "./UI/TopNavbar";

const stats = [
  { label: "Records",               value: "1,714", icon: "📄", bg: "#FEF3E2", color: "#BA7517" },
  { label: "Open Files",            value: "17",    icon: "📂", bg: "#E6F1FB", color: "#185FA5" },
  { label: "Vacant Quarter / Plots",value: "14",    icon: "🏗", bg: "#FCEBEB", color: "#A32D2D" },
  { label: "Notices",               value: "8",     icon: "🔔", bg: "#EAF3DE", color: "#3B6D11" },
];

const requests = [
  { id: 3095, fileNo: "22005", module: "Allotment", status: "Review",   stage: "Pending" },
  { id: 3335, fileNo: "22025", module: "Renewal",   status: "Scrutiny", stage: "Pending" },
  { id: 5535, fileNo: "22045", module: "Lease",     status: "Approval", stage: "Active"  },
];

const statusStyle = {
  Review:   { background: "#B5D4F4", color: "#0C447C" },
  Scrutiny: { background: "#FAC775", color: "#633806" },
  Approval: { background: "#C0DD97", color: "#27500A" },
};

const notices = [
  "Site resettlement update released",
  "Culture and labour unit circular published",
  "Corridor maintenance notice issued",
];

const activities = [
  "Estate officer updated new vacancy records for internal review.",
  "Proposal review moved to the scrutiny stage for committee action.",
  "Latest allotment document uploaded to the current request record.",
];

const landData = {
  labels: ["Industrial", "Housing", "Utilities", "Reserve", "Other"],
  values: [35, 25, 18, 14, 8],
  colors: ["#378ADD", "#7F77DD", "#EF9F27", "#1D9E75", "#888780"],
};

function LandUsageChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    const init = () => {
      if (!window.Chart || !canvasRef.current) return;
      chartInstance = new window.Chart(canvasRef.current, {
        type: "doughnut",
        data: {
          labels: landData.labels,
          datasets: [{
            data: landData.values,
            backgroundColor: landData.colors,
            borderWidth: 2,
            borderColor: "transparent",
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } },
          },
        },
      });
    };

    if (window.Chart) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = init;
      document.head.appendChild(script);
    }

    return () => { if (chartInstance) chartInstance.destroy(); };
  }, []);

  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <canvas ref={canvasRef} aria-label="Land usage donut chart" role="img" />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center", fontSize: 13, fontWeight: 500,
        color: "#1a2e5a", pointerEvents: "none",
      }}>
        PPA
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <style>{`
        /* ── Same static gradient as the About page ── */
        .dash-gradient-bg {
          background: linear-gradient(
            135deg,
            #08142b 0%,
            #10264d 35%,
            #163564 65%,
            #e87722 100%
          );
        }

        /* Subtle grid texture — matches About page */
        .dash-geo-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none;
        }

        /* Depth glow orbs — matches About page */
        .dash-glow-orb {
          position: absolute;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,119,34,0.14) 0%, transparent 68%);
          bottom: -140px; right: -100px;
          pointer-events: none;
        }
        .dash-glow-orb-2 {
          position: absolute;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,38,77,0.5) 0%, transparent 70%);
          top: -80px; left: -80px;
          pointer-events: none;
        }

        /* Cards */
        .dash-card {
          background: rgba(255,255,255,0.92);
          border-radius: 14px;
          border: 0.5px solid rgba(0,0,0,0.08);
          backdrop-filter: blur(8px);
        }
        .stat-card {
          background: rgba(255,255,255,0.92);
          border-radius: 14px;
          border: 0.5px solid rgba(0,0,0,0.08);
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          backdrop-filter: blur(8px);
        }

        /* Table */
        .req-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .req-table th { color: #6b7280; font-weight: 400; text-align: left; padding: 6px 8px; border-bottom: 0.5px solid #e5e7eb; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        .req-table td { padding: 8px 8px; border-bottom: 0.5px solid #f3f4f6; color: #1f2937; }
        .req-table tr:last-child td { border-bottom: none; }

        /* Badges & notices */
        .badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
        .notice-item { display: flex; gap: 10px; align-items: flex-start; padding: 9px 0; border-bottom: 0.5px solid #f3f4f6; }
        .notice-item:last-child { border-bottom: none; }
        .notice-avatar { width: 32px; height: 32px; border-radius: 50%; background: #E6F1FB; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
        .notice-title { font-size: 13px; font-weight: 500; color: #1f2937; margin: 0 0 2px; }
        .notice-sub { font-size: 11px; color: #9ca3af; margin: 0; }
        .notice-time { font-size: 11px; color: #9ca3af; white-space: nowrap; margin-left: auto; padding-left: 8px; }
      `}</style>

      {/* ── Background layers (same as About page) ── */}
      <div className="dash-gradient-bg absolute inset-0 -z-10" />
      <div className="absolute inset-0 bg-black/20 -z-10" />
      <div className="dash-geo-overlay" style={{ zIndex: 0 }} />
      <div className="dash-glow-orb"   style={{ zIndex: 0 }} />
      <div className="dash-glow-orb-2" style={{ zIndex: 0 }} />

      <div className="relative h-full w-full overflow-auto" style={{ zIndex: 1 }}>
        <div className="relative z-10 flex h-full flex-col">
          <TopNavbar titleColor="text-white" />

          <div style={{ padding: "24px 28px", flex: 1 }}>

            {/* Welcome */}
            <h1 style={{ fontSize: 28, fontWeight: 500, color: "#fff", margin: "0 0 20px" }}>
              Welcome back
            </h1>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 16 }}>
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: s.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: ".04em" }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 28, fontWeight: 500, color: "#1a2e5a", margin: 0, lineHeight: 1 }}>
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>

              {/* Latest Requests */}
              <div className="dash-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#1a2e5a", margin: 0 }}>Latest Requests</p>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Current Cycle</span>
                </div>
                <table className="req-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>File No.</th><th>Module</th><th>Status</th><th>Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.fileNo}</td>
                        <td>{r.module}</td>
                        <td><span className="badge" style={statusStyle[r.status]}>{r.status}</span></td>
                        <td style={{ color: r.stage === "Active" ? "#3B6D11" : "#9ca3af", fontWeight: r.stage === "Active" ? 500 : 400 }}>
                          {r.stage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Server Notices */}
              <div className="dash-card" style={{ padding: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1a2e5a", margin: "0 0 8px" }}>Server Notices</p>
                {notices.map((n) => (
                  <div key={n} className="notice-item">
                    <div className="notice-avatar">⚓</div>
                    <div style={{ flex: 1 }}>
                      <p className="notice-title">{n}</p>
                      <p className="notice-sub">Latest internal update shared for department awareness.</p>
                    </div>
                    <span className="notice-time">11h ago</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              {/* Land Usage */}
              <div className="dash-card" style={{ padding: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1a2e5a", margin: "0 0 14px" }}>Land Usage Overview</p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <LandUsageChart />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {landData.labels.map((label, i) => (
                      <span key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#6b7280" }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: landData.colors[i], display: "inline-block", flexShrink: 0 }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dash-card" style={{ padding: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "#1a2e5a", margin: "0 0 8px" }}>Recent Activity</p>
                {activities.map((a) => (
                  <div key={a} className="notice-item">
                    <div className="notice-avatar">⚓</div>
                    <div style={{ flex: 1 }}>
                      <p className="notice-title">{a}</p>
                      <p className="notice-sub">Most recent action captured within the current workflow timeline.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}