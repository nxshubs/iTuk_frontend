"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface StepProps {
  data: ProviderApplicationData;
  setData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
}

export default function Step4_Location({ data, setData }: StepProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-[#FC9056] mb-4">Localização e Revisão</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="useLocation" checked={data.useCurrentLocation} onCheckedChange={(checked) => setData(prev => ({ ...prev, useCurrentLocation: checked as boolean }))} />
          <Label htmlFor="useLocation">Permitir uso da localização para encontrar clientes</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Ativar esta opção pode ajudar clientes próximos a encontrarem seus serviços mais facilmente.
        </p>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Resumo da Solicitação</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Nome:</strong> {data.fullName || "Não preenchido"}</p>
            <p><strong>Serviço:</strong> {data.serviceName || "Não preenchido"}</p>
            <p><strong>Preço/hora:</strong> R$ {data.hourlyRate || "0.00"}</p>
            <p><strong>Cidade:</strong> {data.city || "Não preenchida"}, {data.state || "Não preenchido"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}