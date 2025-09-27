// app/dashboard/requests/components/RequestsHeader.tsx

import { Badge } from "@/components/ui/badge"

interface RequestsHeaderProps {
  pendingCount: number
}

export default function RequestsHeader({ pendingCount }: RequestsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Solicitações de Agendamento</h1>
        <p className="text-muted-foreground">Gerencie as solicitações dos seus clientes</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {pendingCount} Pendentes
        </Badge>
      </div>
    </div>
  )
}