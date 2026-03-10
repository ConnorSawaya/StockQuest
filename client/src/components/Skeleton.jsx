// Reusable skeleton loading primitives

export function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
}

export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

export function SkeletonCircle({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-full ${className}`} />;
}

// Full Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Stats strip */}
      <div className="flex items-center gap-4 mb-6">
        <SkeletonLine className="h-4 w-10" />
        <SkeletonLine className="h-4 w-10" />
        <SkeletonLine className="h-4 w-10" />
        <SkeletonBlock className="flex-1 h-3 min-w-[140px]" />
      </div>

      {/* Next Up card */}
      <div className="card mb-4">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-14 h-14 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-3 w-16" />
            <SkeletonLine className="h-5 w-48" />
            <SkeletonLine className="h-3 w-32" />
          </div>
          <SkeletonCircle className="w-6 h-6 flex-shrink-0" />
        </div>
      </div>

      {/* Trade card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="w-14 h-14 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-5 w-32" />
            <SkeletonLine className="h-3 w-40" />
          </div>
          <SkeletonCircle className="w-6 h-6 flex-shrink-0" />
        </div>
      </div>

      {/* Learning path card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <SkeletonLine className="h-5 w-32" />
          <SkeletonLine className="h-4 w-16" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <SkeletonCircle className="w-8 h-8 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <SkeletonLine className="h-3.5 w-32" />
                <SkeletonBlock className="h-1.5 w-full" />
              </div>
              <SkeletonLine className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Full LessonsPage skeleton
export function LessonsPageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <SkeletonLine className="h-7 w-24 mb-6" />
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            {/* Module header */}
            <div className="flex items-center gap-3 mb-4">
              <SkeletonCircle className="w-9 h-9" />
              <div className="flex-1 space-y-1.5">
                <SkeletonLine className="h-4 w-40" />
              </div>
              <SkeletonCircle className="w-11 h-11" />
            </div>
            {/* Lesson rows */}
            <div className="space-y-1">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3 p-2.5">
                  <SkeletonCircle className="w-7 h-7 flex-shrink-0" />
                  <SkeletonLine className={`h-3.5 flex-1 w-${j % 2 === 0 ? '48' : '36'}`} />
                  <SkeletonCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
