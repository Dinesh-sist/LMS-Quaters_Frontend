import TopHeader from "../../Components/TopHeader";
import Sidebar from "./EmployeeUI/EmployeeSideNav";

export default function DemandNote() {
  return (
    <div className="font-['Segoe_UI',system-ui,sans-serif] h-screen flex flex-col overflow-hidden bg-[linear-gradient(180deg,#e6eeff_0%,#f5f8ff_36%,#edf3ff_100%)]">
      <div className="h-full bg-[#f7faff] overflow-hidden flex flex-col">
        <TopHeader
          role="newuser"
          description="Outsider Services"
          welcomeName="Applicant"
          showNotifications={false}
          logoutTo="/QuartersApplyLogin"
        />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />
          <main className="flex-1 overflow-y-auto px-9 py-7 bg-[#f4f6fa]">
            <div className="mb-[22px]">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-[-0.02em] mb-1.5">
                Demand Note
              </h2>
              <div className="h-[3px] w-[52px] rounded-sm bg-[#e87722]" />
            </div>

            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_2px_12px_rgba(26,46,90,0.07)] px-8 py-7 text-slate-600">
              Demand note screen is not implemented yet.
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

