import TopNavbar from "./UI/TopNavbar";

export default function About() {
  return (
    <div className="relative min-h-screen w-full">

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
      `}</style>

      {/* Background Gradient — fixed so it covers viewport at all scroll depths */}
      <div className="gradient-bg fixed inset-0 -z-10" />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 -z-10" />

      <TopNavbar titleColor="text-white" />

      {/* Main Content — scrollable, vertically centered on large screens */}
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:flex lg:min-h-[calc(100vh-80px)] lg:items-center lg:py-10">

        <div className="w-full">

          {/* Top Section */}
          <div className="mb-8 sm:mb-10">

            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[5px] text-orange-400 sm:text-xs">
              About
            </p>

            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Land Data Management System
            </h1>

            <div className="mt-6 h-px w-full bg-white/10 sm:mt-8" />
          </div>

          {/* Overview Card */}
          <div className="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-7 md:rounded-[38px] md:p-8">

            <h2 className="mb-5 text-xl font-semibold text-white sm:text-2xl md:text-3xl lg:text-4xl sm:mb-7 md:mb-8">
              Overview
            </h2>

            <div className="space-y-4 text-sm leading-7 text-gray-200 sm:space-y-5 sm:text-base sm:leading-8 md:space-y-7 md:text-[17px] md:leading-9">

              <p>
                Land management is the process by which the resources of land
                are utilized effectively from both environmental and economic
                perspectives. It includes activities related to farming,
                mineral extraction, property management, estate administration,
                and urban planning.
              </p>

              <p>
                Land management systems play a major role in handling lease
                data, ownership records, permits, land tracking, and well
                information. These systems help organizations maintain accurate
                records and streamline operational activities through a
                centralized digital environment.
              </p>

              <p>
                The system reduces manual administrative effort by organizing
                important data in a structured and reliable format. It enables
                teams and departments to access, manage, and monitor information
                efficiently while improving transparency and coordination.
              </p>

              <p>
                The system reduces manual administrative effort by organizing
                important data in a structured and reliable format. It enables
                teams and departments to access, manage, and monitor information
                efficiently while improving transparency and coordination.
              </p>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}