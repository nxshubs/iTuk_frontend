// features/Review/ProviderReviewsSkeleton.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/shared/DashboardHeader";
import SidebarMenu from "@/components/shared/SidebarMenu";

// Um sub-componente para o skeleton de um único card de avaliação
const ReviewCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function ProviderReviewsSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* 👇 SIDEBAR E HEADER ADICIONADOS AQUI 👇 */}
      <SidebarMenu isOpen={false} onClose={() => {}} />
      <div className="md:ml-64">
        <DashboardHeader onMobileMenuToggle={() => {}} />

        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Skeleton do Cabeçalho da Página */}
            <div>
              <Skeleton className="h-10 w-3/5 mb-3" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            <div className="space-y-6">
              {/* Skeleton dos Filtros */}
              <Skeleton className="h-10 w-full rounded-lg" />
              
              {/* Skeleton da Lista de Avaliações */}
              <div className="space-y-4">
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}