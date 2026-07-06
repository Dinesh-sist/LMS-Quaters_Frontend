import { useState } from "react";
import AdminSideNav from "./AdminSideNav";
import TopHeader from "../../../Components/TopHeader";
import Footer from "../../../Components/Footer";

export default function AdminLayout({ title, subtitle, headerRight = null, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
      <div className="flex h-full flex-col overflow-hidden">

        <TopHeader
          role="admin"
          description="Quarter Management Portal"
          welcomeName="Admin"
          showNotifications={false}
          onOpenMenu={() => setSidebarOpen(true)}
        />

        {/* ── Body row: sidebar + content side by side ── */}
        <div className="flex min-h-0 flex-1 overflow-hidden">

          {/* Desktop sidebar — shrink-0 so it never compresses */}
          <div className="hidden shrink-0 h-full lg:flex">
            <AdminSideNav />
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              <div className="relative h-full bg-white shadow-xl">
                <AdminSideNav forceExpanded onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* ── Main content area ──
              min-w-0  → allows flex child to shrink below its content size
              flex-1   → takes all remaining width after sidebar
              overflow-hidden → no horizontal bleed
          */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-indigo-50">
            <main
              className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 md:px-6 xl:px-8"
              style={{ scrollbarGutter: "stable" }}
            >
              {/* Inner centering wrapper
                  w-full + min-w-0 = constrained to parent, never wider
                  max-w-[1540px]   = looks good on ultrawide monitors
              */}
              <div className="mx-auto w-full min-w-0 max-w-[1540px] space-y-5">
                {(title || subtitle) && (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {title && (
                        <h1 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h1>
                      )}
                      {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                      )}
                    </div>
                    {headerRight && <div className="shrink-0">{headerRight}</div>}
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