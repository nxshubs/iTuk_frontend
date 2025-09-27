import { Card, CardContent, CardHeader } from "../ui/card";

export function BlockDaysSkeleton() {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-44 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Main Card Skeleton */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="h-4 w-10 mx-auto bg-gray-200 rounded"></div>
            ))}
          </div>
          {/* Day blocks */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, index) => (
              <div key={index} className="min-h-[110px] p-2 bg-gray-200 rounded-lg">
                <div className="h-4 w-6 mb-2 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
