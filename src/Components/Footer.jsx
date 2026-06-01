export default function Footer({ className = "", sticky = true }) {
  return (
    <footer
      className={`${sticky ? "sticky bottom-0 z-20" : "shrink-0"} border-t border-slate-200/80 bg-white/95 px-6 py-3 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-slate-500">
        <span>&copy; 2026 Paradip Port Authority</span>
        <span className="text-right">Land Management System</span>
      </div>
    </footer>
  );
}
