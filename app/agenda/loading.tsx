export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-gradient-to-b from-green-500 to-green-600 text-white flex flex-col">
        <div className="p-4 border-b border-green-400">
          <div className="h-6 bg-white/20 rounded animate-pulse"></div>
        </div>
        <nav className="flex-1 p-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 bg-white/10 rounded-lg mb-1 animate-pulse"></div>
          ))}
        </nav>
        <div className="p-2 border-t border-green-400">
          <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse ml-auto"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="bg-white rounded-lg border">
              <div className="p-0">
                {/* Table Header Skeleton */}
                <div className="border-b p-4">
                  <div className="grid grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>

                {/* Table Rows Skeleton */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="border-b p-4">
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                      <div>
                        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div>
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Counter Skeleton */}
            <div className="mt-4">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
