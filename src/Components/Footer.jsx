export default function Footer({ className = "" }) {
  return (
    <footer
      className={`sticky bottom-0 z-20 border-t border-slate-200/80 bg-white/95 px-6 py-3 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 text-[12px] font-medium text-slate-500">
        <span>&copy; 2026 Paradip Port Authority</span>
        <span className="text-right">Real Estate Management System</span>
      </div>
    </footer>
  );
}
