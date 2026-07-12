import Logo from "../assets/Logo.png"


export default function Brand({ collapsed = false }) {
  return (
    <div className="flex min-w-0 shrink-0 items-center gap-3">
      <div className="brand-shimmer flex items-center">
        <img src={Logo} alt="Logo" className="w-10 rounded-lg sm:w-15 lg:w-17" />
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <span className="block text-sm font-bold sm:text-base lg:text-xl text-white">
            PARADIP PORT AUTHORITY
          </span>
          <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px] lg:text-[15px]">
            Land Management System
          </span>
        </div>
      )}
    </div>
  );
}
