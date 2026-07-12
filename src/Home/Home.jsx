import { useEffect, useState } from "react";
import TopNavbar from "./UI/TopNavbar";
import bgImage from "../assets/AdminBuilding.jpg";

export default function Home() {
  const [heroImageReady, setHeroImageReady] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = bgImage;

    const handleReady = () => setHeroImageReady(true);

    if (image.complete) {
      handleReady();
      return undefined;
    }

    image.onload = handleReady;
    image.onerror = handleReady;

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes heroBgFadeIn {
          0% {
            opacity: 0;
            transform: scale(1.05) translateZ(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
        }
        @keyframes heroHeadingSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-32px) translateZ(0);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateZ(0);
          }
        }
        @keyframes navbarDropIn {
          0% {
            opacity: 0;
            transform: translateY(-36px) translateZ(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateZ(0);
          }
        }
        
        .hero-bg-image {
          opacity: 0;
          transform: scale(1.05);
          will-change: opacity, transform;
        }
        .hero-bg-image.is-ready {
          animation: heroBgFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-heading {
          opacity: 0;
          animation: heroHeadingSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          will-change: opacity, transform;
        }
        .hero-navbar {
          opacity: 0;
          animation: navbarDropIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          will-change: opacity, transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-bg-image,
          .hero-bg-image.is-ready,
          .hero-heading,
          .hero-navbar,
          .gradient-animated {
            animation: none !important;
            transition: none !important;
          }
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
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          onLoad={() => setHeroImageReady(true)}
          className={`hero-bg-image absolute inset-0 h-full w-full object-cover object-center ${
            heroImageReady ? "is-ready" : ""
          }`}
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
          <div className="hero-navbar">
            <TopNavbar titleColor="text-white" transparent hideTranslatePopup />
          </div>

          {/* Hero body */}
          <main className="flex-1 flex items-center pb-8 px-6 sm:pb-10 sm:px-10 md:pb-12 md:px-12">
            <section className="flex flex-col gap-3 sm:gap-4 max-w-[90%] sm:max-w-[480px]">

              {/* Heading */}
              <h1
                className="hero-heading font-extrabold leading-[1.05] text-white/80 tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 5vw, 5rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}
              >
                Land Management
                <br />
                <span className="text-white/80 font-bold">System</span>
              </h1>

              {/* Description */}
              
              

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
