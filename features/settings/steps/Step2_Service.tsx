"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface StepProps {
  data: ProviderApplicationData;
  setData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
}

export default function Step2_Services({ data, setData }: StepProps) {
  const handlePaymentMethodChange = (method: string, checked: boolean) => {
    setData(prev => {
      const currentMethods = prev.paymentMethods;
      if (checked) {
        return { ...prev, paymentMethods: [...currentMethods, method] };
      } else {
        return { ...prev, paymentMethods: currentMethods.filter(m => m !== method) };
      }
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-[#FC9056] mb-4">Serviços Oferecidos</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Serviço Oferecido *</Label>
          {/* 👇 CORREÇÃO AQUI 👇 */}
          <Select value={data.serviceName} onValueChange={(value) => setData(prev => ({ ...prev, serviceName: value }))}>
            <SelectTrigger><SelectValue placeholder="Selecione o serviço" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Limpeza Doméstica">Limpeza Doméstica</SelectItem>
              <SelectItem value="Jardinagem">Jardinagem</SelectItem>
              {/* Adicionar mais serviços */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Preço por Hora (R$) *</Label>
          <Input id="hourlyRate" type="number" value={data.hourlyRate} onChange={(e) => setData(prev => ({ ...prev, hourlyRate: e.target.value }))} placeholder="50.00" />
        </div>
        <div className="space-y-2">
          <Label>Formas de Pagamento *</Label>
          <div className="grid grid-cols-2 gap-2">
            {["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"].map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox id={method} checked={data.paymentMethods.includes(method)} onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)} />
                <Label htmlFor={method} className="text-sm">{method}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição dos Serviços (Opcional)</Label>
          <Textarea id="description" value={data.description} onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} placeholder="Descreva sua experiência..." rows={4} />
        </div>
      </div>
    </div>
  )
}