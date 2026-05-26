import TopNavbar from "./UI/TopNavbar";

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(232,119,34,0.08),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_48%,#eef4ff_100%)]" />
      <div className="fixed inset-0 -z-10 bg-white/20" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[length:72px_72px]" />
      <div className="fixed bottom-[-140px] right-[-100px] -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(232,119,34,0.10)_0%,transparent_68%)]" />
      <div className="fixed left-[-80px] top-[-80px] -z-10 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.10)_0%,transparent_70%)]" />

      <div className="relative z-10">
        <TopNavbar navTextColor="light" />

        <main className="relative z-10 flex justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-12">
          <div className="w-full max-w-[900px]">


            <section className="rounded-[20px] border border-slate-900/10 bg-white/90 px-5 py-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] backdrop-blur-[10px] sm:px-7 sm:py-7 lg:px-10 lg:py-9">
            <h1 className="mt-2 text-[24px] font-bold leading-tight tracking-[-0.01em] text-blue-950 sm:text-[32px] lg:text-[40px]">
              About
            </h1>

              <p className="mb-4 text-[14px] font-medium leading-[1.35] text-blue-950 sm:text-[18px] lg:text-[20px]">
                A centralized platform for managing port land records, lease data, and estate
                operations efficiently.
              </p>

              <div className="grid grid-cols-1 gap-y-3 sm:gap-y-4 md:grid-cols-2 md:gap-x-9">
                <div className="space-y-3">
                  <p className="text-[12px] leading-[1.85] text-blue-950/80 sm:text-[13px] lg:text-[14px]">
                    Land management is the process by which the resources of land are utilized
                    effectively from both environmental and economic perspectives. It includes
                    activities related to farming, mineral extraction, property management, estate
                    administration, and urban planning.
                  </p>
                  <p className="text-[12px] leading-[1.85] text-blue-950/80 sm:text-[13px] lg:text-[14px]">
                    Land management systems play a major role in handling lease data, ownership
                    records, permits, land tracking, and well information, helping organizations
                    maintain accurate records and streamline operational activities through a
                    centralized digital environment.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[12px] leading-[1.85] text-blue-950/80 sm:text-[13px] lg:text-[14px]">
                    The system reduces manual administrative effort by organizing important data in
                    a structured and reliable format. It enables teams and departments to access,
                    manage, and monitor information efficiently while improving transparency and
                    coordination across all port authority divisions.
                  </p>
                  <p className="text-[12px] leading-[1.85] text-blue-950/80 sm:text-[13px] lg:text-[14px]">
                    Designed to serve the operational needs of Paradip Port Authority, this
                    platform ensures that every land record, from allotments and renewals to lease
                    approvals, is tracked, auditable, and accessible to authorized personnel at any
                    time.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
