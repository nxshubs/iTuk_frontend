import { Inbox } from "lucide-react"

export default function NoRequestsFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-card border border-dashed rounded-lg p-12 min-h-[400px]">
      <Inbox className="w-16 h-16 mb-4 text-gray-400" />
      <h3 className="text-xl font-semibold text-foreground">Caixa de Entrada Vazia</h3>
      <p className="mt-2 text-sm">
        Você não tem nenhuma solicitação de agendamento pendente no momento.
      </p>
    </div>
  )
}