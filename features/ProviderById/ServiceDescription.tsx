// features/provider/profile/components/ServiceDescription.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ServiceDescriptionProps {
    description: string
}

export default function ServiceDescription({ description }: ServiceDescriptionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Descrição dos Serviços</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed font-poppins">
            {description}
          </p>
          {/* Você pode adicionar a seção de "diferenciais" aqui se ela vier da API */}
        </div>
      </CardContent>
    </Card>
  )
}