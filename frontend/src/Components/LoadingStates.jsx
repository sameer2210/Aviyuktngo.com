const SkeletonBlock = ({ className = '' }) => (
  <div aria-hidden="true" className={`loading-skeleton ${className}`.trim()} />
);

export const InlineLoading = ({ label = 'Loading' }) => (
  <span role="status" aria-live="polite" className="inline-flex items-center gap-2">
    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current opacity-70 loading-dot" />
    <span>{label}</span>
  </span>
);

export const RouteLoadingState = ({ label = 'Loading page' }) => (
  <main
    role="status"
    aria-live="polite"
    aria-label={label}
    className="min-h-[70vh] w-full bg-[#f6f3ed] px-4 py-8 text-[#10213f] sm:px-6 lg:px-10"
  >
    <span className="sr-only">{label}</span>
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#d8dfec] bg-white shadow-sm">
          <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-[#335288]" />
          <div className="absolute inset-x-2 top-5 h-1 rounded-full bg-[#b7c4d8]" />
          <div className="absolute inset-x-2 top-8 h-1 rounded-full bg-[#efe4d2]" />
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-28 rounded-full" />
          <SkeletonBlock className="h-2 w-44 rounded-full" />
        </div>
      </div>

      <SkeletonBlock className="mb-5 h-2 w-full rounded-full" />
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <SkeletonBlock className="h-[320px] rounded-lg sm:h-[380px]" />
        <div className="space-y-4">
          <SkeletonBlock className="h-24 rounded-lg" />
          <SkeletonBlock className="h-24 rounded-lg" />
          <SkeletonBlock className="h-24 rounded-lg" />
        </div>
      </div>
    </div>
  </main>
);

export const SectionLoadingState = ({ className = '' }) => (
  <section
    role="status"
    aria-live="polite"
    aria-label="Loading section"
    className={`w-full bg-[#f6f3ed] px-4 py-10 ${className}`.trim()}
  >
    <span className="sr-only">Loading section</span>
    <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
      <div className="space-y-3 md:col-span-1">
        <SkeletonBlock className="h-3 w-24 rounded-full" />
        <SkeletonBlock className="h-8 w-52 rounded-md" />
        <SkeletonBlock className="h-20 w-full rounded-lg" />
      </div>
      <SkeletonBlock className="h-56 rounded-lg md:col-span-2" />
    </div>
  </section>
);

export const GalleryGridLoadingState = ({ cards = 6, className = '' }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Loading gallery"
    className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}
  >
    <span className="sr-only">Loading gallery</span>
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <SkeletonBlock className="h-48 rounded-none" />
        <div className="space-y-2 p-4">
          <SkeletonBlock className="h-3 w-3/4 rounded-full" />
          <SkeletonBlock className="h-2 w-1/2 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const AdminTableLoadingState = ({ rows = 5, columns = 4 }) => (
  <div role="status" aria-live="polite" aria-label="Loading admin data" className="overflow-hidden rounded-lg bg-white shadow-md">
    <span className="sr-only">Loading admin data</span>
    <div className="grid gap-4 border-b border-gray-100 bg-gray-50 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBlock key={index} className="h-3 rounded-full" />
      ))}
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <SkeletonBlock key={columnIndex} className="h-4 rounded-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonBlock;
