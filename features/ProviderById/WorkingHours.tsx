// Arquivo: features/provider/profile/components/WorkingHours.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface WorkingHoursProps {
  // ALTERAÇÃO: Agora recebe um array de strings
  hours: string[]
}

export default function WorkingHours({ hours }: WorkingHoursProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Horário de Funcionamento</h2>
        <div className="flex items-start text-muted-foreground font-poppins">
          <div className="flex flex-col">
            {hours.map((line, index) => (
              <div className="flex">
                <Clock className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span key={index}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}