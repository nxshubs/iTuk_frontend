"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface StepProps {
  data: ProviderApplicationData;
  setData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
}

export default function Step3_Address({ data, setData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-[#FC9056] mb-4">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">Rua *</Label>
          <Input id="street" value={data.street} onChange={handleChange} placeholder="Nome da rua" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input id="number" value={data.number} onChange={handleChange} placeholder="123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" value={data.complement} onChange={handleChange} placeholder="Apto, bloco, etc." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input id="neighborhood" value={data.neighborhood} onChange={handleChange} placeholder="Nome do bairro" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input id="city" value={data.city} onChange={handleChange} placeholder="Nome da cidade" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Select value={data.state} onValueChange={(value) => setData(prev => ({ ...prev, state: value }))}>
            <SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              {/* Adicionar outros estados */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP *</Label>
          <Input id="zipCode" value={data.zipCode} onChange={handleChange} placeholder="00000-000" />
        </div>
      </div>
    </div>
  )
}