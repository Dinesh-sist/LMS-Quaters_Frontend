import Logo from "../assets/Logo.png"


export default function Brand({ collapsed = false }) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <div className="brand-shimmer flex items-center shrink-0">
        <img src={Logo} alt="Logo" className="h-8 w-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain rounded-lg shrink-0" />
      </div>
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <span className="block text-[12px] sm:text-base lg:text-[clamp(0.95rem,1.5vw+0.5rem,1.85rem)] font-bold text-white truncate">
            PARADIP PORT AUTHORITY
          </span>
          <span className="mt-0.5 block text-[7.5px] sm:text-[11px] lg:text-[15px] font-semibold uppercase tracking-[0.1em] text-white/85 truncate">
            Land Management System
          </span>
        </div>
      )}
    </div>
  );
}
