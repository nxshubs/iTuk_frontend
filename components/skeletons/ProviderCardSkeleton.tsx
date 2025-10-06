import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProviderCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-700" />
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
      </CardFooter>
    </Card>
  )
}
