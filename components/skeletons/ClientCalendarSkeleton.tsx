import { Card, CardContent } from "@/components/ui/card"

export function ClientCalendarSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton for Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-48 h-8 bg-muted rounded-md"></div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-10 bg-muted rounded-md"></div>
          <div className="w-24 h-10 bg-muted rounded-md"></div>
          <div className="w-24 h-10 bg-muted rounded-md"></div>
        </div>
      </div>

      {/* Skeleton for Calendar Grid (simulates week view) */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div key={dayIndex} className="p-2 border-r border-border last:border-r-0">
                <div className="w-16 h-6 bg-muted rounded-md mx-auto mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, eventIndex) => (
                    <div key={eventIndex} className="h-16 bg-muted/50 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
