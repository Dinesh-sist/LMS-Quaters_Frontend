const lineWidths = ["100%", "82%", "68%"];

function SkeletonBlock({ className = "", style }) {
  return <div className={`lms-skeleton-block ${className}`.trim()} style={style} />;
}

function PublicPageSkeleton() {
  return (
    <div className="lms-skeleton-public">
      <div className="lms-skeleton-overlay" />
      <div className="lms-skeleton-public-inner">
        <div className="lms-skeleton-navbar">
          <SkeletonBlock className="h-12 w-56 rounded-2xl" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-10 w-24 rounded-full" />
            <SkeletonBlock className="h-10 w-28 rounded-full" />
          </div>
        </div>

        <div className="lms-skeleton-hero">
          <div className="space-y-4">
            <SkeletonBlock className="h-5 w-28 rounded-full" />
            <SkeletonBlock className="h-14 w-[min(88vw,520px)] rounded-3xl" />
            <SkeletonBlock className="h-14 w-[min(80vw,440px)] rounded-3xl" />
            {lineWidths.map((width) => (
              <SkeletonBlock key={width} className="h-4 rounded-full" style={{ width }} />
            ))}
            <div className="flex gap-3 pt-3">
              <SkeletonBlock className="h-11 w-40 rounded-full" />
              <SkeletonBlock className="h-11 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthPageSkeleton() {
  return (
    <div className="lms-skeleton-auth">
      <div className="lms-skeleton-auth-card">
        <div className="lms-skeleton-navbar">
          <SkeletonBlock className="h-10 w-44 rounded-2xl" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-9 w-24 rounded-full" />
            <SkeletonBlock className="h-9 w-24 rounded-full" />
          </div>
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SkeletonBlock className="hidden h-full min-h-[420px] rounded-[28px] lg:block" />

          <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 sm:p-8">
            <div className="space-y-4">
              <SkeletonBlock className="h-6 w-40 rounded-full" />
              <SkeletonBlock className="h-12 w-64 rounded-2xl" />
              <SkeletonBlock className="h-4 w-[88%] rounded-full" />
            </div>

            <div className="mt-10 space-y-5">
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-20 rounded-full" />
                <SkeletonBlock className="h-12 w-full rounded-2xl" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-24 rounded-full" />
                <SkeletonBlock className="h-12 w-full rounded-2xl" />
              </div>
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalCards({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-[22px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full space-y-3">
              <SkeletonBlock className="h-8 w-16 rounded-xl" />
              <SkeletonBlock className="h-4 w-32 rounded-full" />
            </div>
            <SkeletonBlock className="h-11 w-11 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PortalHeader() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-10 w-72 rounded-2xl" />
      <SkeletonBlock className="h-4 w-80 max-w-full rounded-full" />
    </div>
  );
}

export function TableSectionSkeleton({
  searchable = true,
  rowCount = 8,
  columnCount = 5,
}) {
  const visibleColumns = Math.max(3, Math.min(columnCount, 6));

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/85 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      {searchable ? (
        <div className="border-b border-slate-200/70 p-4">
          <SkeletonBlock className="h-11 w-full max-w-xs rounded-2xl" />
        </div>
      ) : null}
      <div className="space-y-3 p-4">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${visibleColumns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: visibleColumns }).map((_, index) => (
            <SkeletonBlock key={index} className="h-4 rounded-full" />
          ))}
        </div>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${visibleColumns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: visibleColumns }).map((_, colIndex) => (
              <SkeletonBlock key={`${rowIndex}-${colIndex}`} className="h-12 rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalFormSkeleton() {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-8">
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
            <SkeletonBlock className="h-4 w-36 rounded-full" />
            <SkeletonBlock className="h-12 w-full rounded-2xl" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mt-8 h-12 w-full rounded-2xl" />
    </div>
  );
}

function PortalLayoutSkeleton({ variant = "table" }) {
  const showCards = variant !== "form";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-10 w-10 rounded-2xl lg:hidden" />
              <SkeletonBlock className="h-12 w-72 rounded-2xl" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
              <SkeletonBlock className="h-10 w-36 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-[268px] border-r border-slate-200 bg-white px-5 py-7 lg:block">
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-12 w-full rounded-2xl" />
              ))}
            </div>
          </aside>

          <main className="flex-1 overflow-auto px-5 py-7 md:px-8 xl:px-10">
            <div className="mx-auto max-w-[1540px] space-y-6">
              <PortalHeader />
              {showCards ? <PortalCards /> : null}
              {variant === "form" ? <PortalFormSkeleton /> : <TableSectionSkeleton />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PageSkeleton({ variant = "public" }) {
  if (variant === "auth") return <AuthPageSkeleton />;
  if (variant === "portal-form") return <PortalLayoutSkeleton variant="form" />;
  if (variant === "portal-table") return <PortalLayoutSkeleton variant="table" />;
  return <PublicPageSkeleton />;
}
