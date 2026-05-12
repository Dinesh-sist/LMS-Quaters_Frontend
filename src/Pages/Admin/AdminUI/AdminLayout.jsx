import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Verify Applications", to: "/admin/verify" },
  { label: "Application Status", to: "/admin/status" },
  { label: "Committee History", to: "/admin/history" },
];

export default function AdminLayout({ title, subtitle, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Admin Dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${active ? "bg-blue-950 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/StaffLogin"
              className="px-4 py-2 rounded-2xl text-sm font-medium text-blue-950 bg-blue-100 hover:bg-blue-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
