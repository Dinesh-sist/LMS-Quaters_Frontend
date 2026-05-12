import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import TopHeader from "./TopHeader";

export default function AdminLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="relative h-full">
              <AdminSidebar
                mobile
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader
            title={title}
            subtitle={subtitle}
            onOpenMenu={() => setSidebarOpen(true)}
          />

          <main className="flex-1 px-5 py-7 md:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1540px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
