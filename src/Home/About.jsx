import TopNavbar from "./UI/TopNavbar";
import Footer from "../Components/Footer";

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.747H5.25A2.25 2.25 0 013 18.497V5.253A2.25 2.25 0 015.25 3h9a2.25 2.25 0 012.25 2.25v3M12 21l9-9-3-3-9 9v3h3z" />
      </svg>
    ),
    title: "Land Records",
    desc: "Maintain accurate allotment, renewal, and ownership records in a single auditable system.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Lease Management",
    desc: "Track lease terms, approvals, and expirations with automated alerts and audit trails.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: "Estate Operations",
    desc: "Coordinate across all port authority divisions with shared dashboards and role-based access.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
    title: "Map & Tracking",
    desc: "Visualize land parcels, ROW zones, and port boundaries with integrated geospatial mapping.",
  },
];


export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50">
      <style>{`
        @keyframes aboutPageFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes aboutSectionRise {
          0% {
            opacity: 0;
            transform: translateY(28px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes aboutGlowDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -14px, 0) scale(1.03); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .about-page-enter {
          animation: aboutPageFadeIn 0.45s ease-out both;
        }
        .about-reveal {
          opacity: 0;
          animation: aboutSectionRise 0.78s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }
        .about-glow {
          animation: aboutGlowDrift 12s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-page-enter,
          .about-reveal,
          .about-glow {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(232,119,34,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef4ff_100%)]" />
      <div className="fixed inset-0 -z-10 bg-white/20" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[length:72px_72px]" />
      <div className="about-glow fixed bottom-[-140px] right-[-100px] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,119,34,0.10)_0%,transparent_68%)]" />
      <div className="about-glow fixed left-[-80px] top-[-80px] -z-10 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.10)_0%,transparent_70%)]" />

      <div className="about-page-enter relative z-10 flex min-h-screen flex-col">
        <TopNavbar navTextColor="light" />

        <main className="relative z-10 flex flex-1 justify-center px-4 py-10 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-[900px] space-y-5">

            {/* ── Hero card ── */}
            <section
              className="about-reveal rounded-[20px] border border-slate-900/10 bg-white/90 px-6 py-8 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-[10px] sm:px-8 sm:py-9 lg:px-10"
              style={{ animationDelay: "0.08s" }}
            >
              <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-[-0.02em] text-blue-950 sm:text-[34px] lg:text-[42px]">
                Land Management <br className="hidden sm:block" />
                <span className="text-orange-500">System</span>
              </h1>
              <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-blue-950/60 sm:text-[15px] lg:text-[16px]">
                A centralized platform for managing port land records, lease data, and estate
                operations — built for accuracy, transparency, and efficiency.
              </p>
            </section>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((f, index) => (
                <div
                  key={f.title}
                  className="about-reveal group rounded-[16px] border border-slate-900/10 bg-white/90 px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-[10px] transition-shadow hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
                  style={{ animationDelay: `${0.16 + index * 0.09}s` }}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-100">
                    {f.icon}
                  </div>
                  <h3 className="mb-1.5 text-[14px] font-bold text-blue-950 sm:text-[15px]">{f.title}</h3>
                  <p className="text-[12px] leading-[1.8] text-blue-950/60 sm:text-[13px]">{f.desc}</p>
                </div>
              ))}
            </section>

            {/* ── What is Land Management ── */}
            <section
              className="about-reveal rounded-[20px] border border-slate-900/10 bg-white/90 px-6 py-7 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-[10px] sm:px-8 lg:px-10"
              style={{ animationDelay: "0.34s" }}
            >
              <h2 className="mb-4 text-[16px] font-bold text-blue-950 sm:text-[18px]">
                What is Land Management?
              </h2>
              <div className="space-y-4">
                <p className="text-[12px] leading-[1.9] text-blue-950/65 sm:text-[13px] lg:text-[14px]">
                  Land management is the process by which the resources of land are utilized effectively from both environmental and economic perspectives. It includes activities related to farming, mineral extraction, property management, estate administration, and urban planning. Land management systems play a major role in handling lease data, ownership records, permits, land tracking, and well information — helping organizations maintain accurate records and streamline operations through a centralized digital environment.
                </p>
                <p className="text-[12px] leading-[1.9] text-blue-950/65 sm:text-[13px] lg:text-[14px]">
                  This is the official website of Paradip Port Authority under the Ministry of Shipping, Government of India. The information contained in this Web Site (http://www.paradipport.gov.in) has been prepared solely for the purpose of providing information about Paradip Port Authority to interested parties, and is not in any way binding on Paradip Port Authority. By accessing this Web Site, you agree that Paradip Port Authority will not be liable for any direct or indirect loss arising from the use of the information and the material contained in this Web Site. This Web Site has been compiled in good faith by the Paradip Port Authority, but no representation is made or warranty given (either express or implied) as to the completeness or accuracy of the information it contains. The same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify/check this information with Paradip Port Authority before you act upon it. By accessing this Web Site, you agree that under no circumstances will Paradip Port Authority be liable for any direct or indirect loss or damage, arising out of or in connection with the use of this website. These terms and conditions shall be governed by and construed in accordance with the Indian laws. Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the court of Jagatsinghpur, Orissa state, India.
                </p>
                <p className="text-[12px] leading-[1.9] text-blue-950/65 sm:text-[13px] lg:text-[14px]">
                  The information posted on this website could include hypertext links or pointers to information created and maintained by non-Government/Private organizations. Paradip Port Authority is providing these links and pointers for your information and convenience. When you select a link to an outside website, you are leaving the Paradip Port Authority website and are subject to the privacy and security policies of the owners/sponsors of the outside website. Paradip Port Authority does not guarantee the availability of such linked pages at all times. Paradip Port Authority cannot authorize the use of copyrighted materials contained in linked websites. Users are advised to request such authorization from the owner of the linked website. Paradip Port Authority does not guarantee that linked websites comply with Indian Government Web Guidelines. The copyright in the material contained in this Web Site belongs to and remains solely with Paradip Port Authority. Your access to it or to download does not imply a license to reproduce and/or distribute this information and you are not allowed to use the material for any other purpose without the prior approval of Paradip Port Authority. Application for obtaining permission should be made to dmmsppt@paradipport.gov.in. Prior permission is required before hyperlinks are directed from any website to this website, and permission for the same should be obtained by sending a request at dmmsppt@paradipport.gov.in.
                </p>
              </div>
            </section>

            {/* ── Feature cards ── */}




          </div>
        </main>
        <Footer sticky={false} className="mt-auto" />
      </div>
    </div>
  );
}
