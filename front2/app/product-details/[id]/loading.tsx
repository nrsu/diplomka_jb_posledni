import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-6 w-32 mb-6">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full h-[400px] rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div>
          <div className="mb-6">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-3/4 mb-2" />

            <div className="flex items-center mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Skeleton key={star} className="h-5 w-5" />
                ))}
              </div>
              <Skeleton className="h-4 w-32 ml-2" />
            </div>

            <div className="mt-4 flex items-center">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          <div className="h-1 w-full my-6 bg-gray-200" />

          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div>
              <Skeleton className="h-6 w-24 mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-8 mx-4" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

