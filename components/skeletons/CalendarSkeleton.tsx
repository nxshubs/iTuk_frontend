// features/appointments/provider/CalendarSkeleton.tsx (Atualizado)

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardHeader from "@/components/shared/DashboardHeader" // 👈 Importado
import SidebarMenu from "@/components/shared/SidebarMenu"     // 👈 Importado

export function CalendarSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="md:ml-64">
        <main className="p-2 sm:p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Skeleton do Header da página de agendamentos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Skeleton className="h-10 w-3/4 mb-3" /> {/* Título principal */}
                <Skeleton className="h-5 w-1/2" />       {/* Descrição */}
              </div>
            </div>

            {/* Skeleton da Barra de Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />         {/* Botão de Filtros */}
                {/* Você pode adicionar mais skeletons para os badgets de filtro ativos se quiser ser mais granular */}
              </div>
              <Skeleton className="h-5 w-48" />           {/* "Mostrando X de Y agendamentos" */}
            </div>

            {/* Skeleton para os botões de troca de visualização (Calendar modes: Month, Week, Day) */}
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Skeleton para o título (Mês/Semana/Dia) */}
                  <Skeleton className="h-7 w-48 rounded-md" />
                  
                  {/* Skeleton para os botões de navegação */}
                  <div className="flex gap-1 sm:gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-16 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-1 sm:p-2 lg:p-6">
                <div className="flex flex-col gap-4">
                  {/* Skeleton para os cabeçalhos dos dias da semana */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full rounded-md" />
                    ))}
                  </div>
                  
                  {/* Skeleton para o grid principal do calendário */}
                  <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>
              </CardContent>
            </Card>

            {/* Skeleton para os Cards de Estatísticas */}
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