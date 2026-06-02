import { useState } from "react";
import TopHeader from "../../../Components/TopHeader";
import EmployeeSideNav from "./EmployeeSideNav";
import Footer from "../../../Components/Footer";

export default function EmployeeLayout({
  title,
  subtitle,
  children,
  role = "user",
  description = "Outsider Services",
  welcomeName = "Employee",
  logoutTo = "/QuartersApplyLogin",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#EEF2FF] font-['Segoe_UI',system-ui,sans-serif] text-slate-900">
      <div className="flex h-full flex-col overflow-hidden">
        <TopHeader
          role={role}
          description={description}
          welcomeName={welcomeName}
          showNotifications={false}
          logoutTo={logoutTo}
          onOpenMenu={() => setSidebarOpen(true)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="hidden h-full lg:flex">
            <EmployeeSideNav />
          </div>

          {sidebarOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              <div className="relative h-full bg-white shadow-xl">
                <EmployeeSideNav forceExpanded onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto px-5 py-7 md:px-8 xl:px-10">
              <div className="mx-auto w-full max-w-[1540px] space-y-6">
                {(title || subtitle) && (
                  <div>
                    {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
                    {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
                  </div>
                )}
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
