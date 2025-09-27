// features/provider/profile/components/ServicesOffered.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ServicesOfferedProps {
  services: string[]
}

export default function ServicesOffered({ services }: ServicesOfferedProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
        <div className="flex flex-wrap gap-2">
          {services.map((service, index) => (
            <Badge key={index} variant="secondary" className="bg-[#FC9056]/10 font-poppins text-[#FC9056]">
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}