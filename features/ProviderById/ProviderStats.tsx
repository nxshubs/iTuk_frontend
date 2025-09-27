// features/provider/profile/components/ProviderStats.tsx
"use client"

import type { Provider } from "@/types/Provider"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
// Ícones removidos pois seus cards não são mais usados
// import { Award, CheckCircle } from "lucide-react"

interface ProviderStatsProps {
  provider: Provider
}

export default function ProviderStats({ provider }: ProviderStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* REMOVIDO: A propriedade 'experience' não existe no seu tipo Provider */}
      {/* <Card>
        <CardContent className="p-4 text-center">
          <Award className="w-8 h-8 text-[#FC9056] mx-auto mb-2" />
          <div className="text-2xl font-bold">{provider.experience || "-"}</div>
          <div className="text-sm text-muted-foreground font-poppins">Experiência</div>
        </CardContent>
      </Card> */}
      
      {/* REMOVIDO: A propriedade 'completedJobs' não existe no seu tipo Provider */}
      {/* <Card>
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{provider.completedJobs || 0}</div>
          <div className="text-sm text-muted-foreground font-poppins">Trabalhos</div>
        </CardContent>
      </Card> */}

      {/* MANTIDO: 'reviewCount' existe no tipo Provider */}
      <Card className="col-span-full md:col-span-1">
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{provider.reviewCount}</div>
          <div className="text-sm text-muted-foreground font-poppins">Avaliações</div>
        </CardContent>
      </Card>
    </div>
  )
}