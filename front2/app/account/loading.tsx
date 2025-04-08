import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-20" />
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}

