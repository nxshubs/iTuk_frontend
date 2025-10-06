import { Card, CardContent } from "@/components/ui/card"

export function ClientReviewsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-10 w-3/5 bg-muted rounded-lg mb-3"></div>
        <div className="h-6 w-4/5 bg-muted rounded-lg"></div>
      </div>

      {/* Stats and Filters Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-20 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
          <div className="mt-6 h-12 bg-muted rounded-lg"></div>
        </CardContent>
      </Card>

      {/* Review List Skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div>
                    <div className="h-5 w-32 bg-muted rounded-md mb-2"></div>
                    <div className="h-4 w-24 bg-muted rounded-md"></div>
                  </div>
                </div>
                <div className="h-5 w-20 bg-muted rounded-md"></div>
              </div>
              <div className="mt-4 h-12 w-full bg-muted rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
