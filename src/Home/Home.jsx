import { Link } from "react-router-dom";
import TopNavbar from "./UI/TopNavbar";
import bgImage from "../assets/AdminBuilding.jpg";




export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animated {
          background: linear-gradient(135deg, #1a2e5a, #2d4a8a, #c17f2f, #1a2e5a);
          background-size: 300% 300%;
          animation: gradientMove 15s ease-in-out infinite;
        }
      `}</style>

      {/* Animated gradient background */}
      <div className="gradient-animated absolute inset-0 -z-10" />

      {/* ── Rounded card frame ── */}
      <div className="relative h-full w-full overflow-hidden">

        {/* Background image */}
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-100 saturate-[1.2]"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(5,18,35,0.55) 0%, rgba(10,25,50,0.35) 45%, rgba(10,20,40,0.25) 100%)",
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 60%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col">

          {/* Navbar */}
          <TopNavbar titleColor="text-white" />

          {/* Hero body */}
          <main className="flex-1 flex items-end pb-8 px-6 sm:pb-10 sm:px-10 md:pb-12 md:px-12">
            <section className="flex flex-col gap-3 sm:gap-4 max-w-[90%] sm:max-w-[480px]">

              {/* Heading */}
              <h1
                className="font-extrabold leading-[1.05] text-white/80 tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 5vw, 5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
              >
                Land Management
                <br />
                <span className="text-white/80 font-bold">System</span>
              </h1>

              {/* Description */}
              <p
                className="text-sm sm:text-sm leading-relaxed text-blue-100 max-w-[360px]"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
              >
                A unified land data management portal for vacancy discovery,
                online applications, and estate administration.
              </p>

              

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-1">
                {/* <Link
                  to="/QuartersApplyLogin"
                  className="text-xs sm:text-sm font-semibold rounded-full px-5 sm:px-6 py-2 sm:py-2.5 no-underline text-white bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_6px_22px_rgba(249,115,22,0.42)] hover:brightness-110 transition-all"
                >
                  Apply for Quarters
                </Link> */}
                {/* <Link
                  to="/StaffLogin"
                  className="text-xs sm:text-sm font-semibold rounded-full px-5 sm:px-6 py-2 sm:py-2.5 no-underline text-white bg-white/10 backdrop-blur-md border border-white/25 hover:bg-white/20 transition-all"
                >
                  Staff Login
                </Link> */}
              </div>

            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
