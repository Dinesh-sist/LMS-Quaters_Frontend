import TopNavbar from "./UI/TopNavbar";

export default function About() {
  return (
    <div style={{ minHeight: "100vh", width: "100%", position: "relative", overflowX: "hidden" }}>
      <style>{`
        .gradient-bg {
          background: linear-gradient(
            135deg,
            #08142b 0%,
            #10264d 35%,
            #163564 65%,
            #e87722 100%
          );
        }

        .geo-overlay {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 72px 72px;
          pointer-events: none;
          z-index: 0;
        }

        .glow-orb {
          position: fixed;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232,119,34,0.14) 0%, transparent 68%);
          bottom: -140px;
          right: -100px;
          pointer-events: none;
          z-index: 0;
        }

        .glow-orb-2 {
          position: fixed;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,38,77,0.5) 0%, transparent 70%);
          top: -80px;
          left: -80px;
          pointer-events: none;
          z-index: 0;
        }

        .about-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(10px, 1.2vw, 11px);
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f4a55a;
        }

        .about-label .dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #e87722;
          display: inline-block;
          flex-shrink: 0;
        }

        .accent-rule {
          display: flex;
          align-items: center;
          margin: 14px 0 22px;
        }
        .accent-rule .bar {
          width: 44px; height: 2px;
          background: #e87722;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .accent-rule .line {
          flex: 1; height: 1px;
          background: rgba(255,255,255,0.10);
        }

        .about-card {
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.055);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: clamp(20px, 3vw, 36px) clamp(20px, 3.5vw, 40px);
        }

        .section-tag {
          font-size: clamp(10px, 1.1vw, 11px);
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0 0 10px;
        }

        .card-subtitle {
          font-size: clamp(14px, 1.6vw, 20px);
          font-weight: 500;
          color: #ffffff;
          margin: 0 0 16px;
          line-height: 1.35;
        }

        .body-text {
          font-size: clamp(12px, 1.3vw, 14px);
          font-weight: 400;
          line-height: 1.85;
          color: rgba(255,255,255,0.72);
          margin: 0;
        }

        .body-text + .body-text {
          margin-top: 12px;
        }

        .text-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 36px;
        }

        @media (max-width: 700px) {
          .text-grid {
            grid-template-columns: 1fr;
            gap: 12px 0;
          }
        }

        .tags-row {
          display: flex;
          gap: 8px;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }

        .tag-pill {
          font-size: clamp(9px, 1vw, 11px);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          padding: 5px 13px;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 100px;
          background: rgba(255,255,255,0.04);
          white-space: nowrap;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu1 { animation: fadeUp 0.6s ease both; }
        .fu2 { animation: fadeUp 0.6s 0.1s ease both; }
        .fu3 { animation: fadeUp 0.6s 0.2s ease both; }
        .fu4 { animation: fadeUp 0.6s 0.32s ease both; }

        .about-main {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          padding: clamp(24px, 4vh, 48px) clamp(16px, 4vw, 48px);
        }

        .about-inner {
          width: 100%;
          max-width: 900px;
        }
      `}</style>

      {/* Fixed background layers */}
      <div className="gradient-bg" style={{ position: "fixed", inset: 0, zIndex: -1 }} />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: -1 }} />
      <div className="geo-overlay" />
      <div className="glow-orb" />
      <div className="glow-orb-2" />

      {/* Page content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNavbar titleColor="text-white" />

        <main className="about-main">
          <div className="about-inner">

           

            {/* Page title — same font as dashboard (system sans, bold) */}
            <h1
              className="fu2"
              style={{
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                color: "#ffffff",
                margin: "8px 0 0",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
              }}
            >
              Land Data Management System
            </h1>

            {/* Sub-label matching dashboard "About" eyebrow */}
            <p
              className="fu2"
              style={{
                fontSize: "clamp(10px, 1.1vw, 11px)",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
              color: "#fb923c",
                margin: "10px 0 0",
              }}
            >
              About
            </p>

            {/* Accent rule */}
            <div className="accent-rule fu2">
              <div className="bar" />
              <div className="line" />
            </div>

            {/* Overview card */}
            <div className="about-card fu3">

              <p className="section-tag">Overview</p>

              <p className="card-subtitle">
                A centralized platform for managing port land records,
                lease data, and estate operations efficiently.
              </p>

              <div className="text-grid">
                <div>
                  <p className="body-text">
                    Land management is the process by which the resources of
                    land are utilized effectively from both environmental and
                    economic perspectives. It includes activities related to
                    farming, mineral extraction, property management, estate
                    administration, and urban planning.
                  </p>
                  <p className="body-text">
                    Land management systems play a major role in handling lease
                    data, ownership records, permits, land tracking, and well
                    information — helping organizations maintain accurate records
                    and streamline operational activities through a centralized
                    digital environment.
                  </p>
                </div>
                <div>
                  <p className="body-text">
                    The system reduces manual administrative effort by
                    organizing important data in a structured and reliable
                    format. It enables teams and departments to access, manage,
                    and monitor information efficiently while improving
                    transparency and coordination across all port authority
                    divisions.
                  </p>
                  <p className="body-text">
                    Designed to serve the operational needs of Paradip Port
                    Authority, this platform ensures that every land record —
                    from allotments and renewals to lease approvals — is tracked,
                    auditable, and accessible to authorized personnel at any time.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}