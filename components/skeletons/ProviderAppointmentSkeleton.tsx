// Ex: features/appointments/provider/ProviderAppointmentsSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton"
import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"

export function ProviderAppointmentsSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="md:ml-64">
        <main className="p-2 sm:p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Skeleton do Header */}
            <div>
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-5 w-1/2" />
            </div>

            {/* Skeleton da Barra de Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-5 w-48" />
            </div>

            {/* Skeleton do Calendário */}
            <Skeleton className="h-[600px] w-full rounded-lg" />

            {/* Skeleton dos Cards de Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}