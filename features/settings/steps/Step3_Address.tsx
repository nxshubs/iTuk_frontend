"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface StepProps {
  data: ProviderApplicationData;
  setData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
}

const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export default function Step3_Address({ data, setData }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-semibold text-[#FC9056]">Seu Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP *</Label>
          <Input 
            id="zipCode" 
            value={data.zipCode} 
            onChange={handleChange} 
            placeholder="00000-000"
            maxLength={9} // Limita o número de caracteres
          />
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="street">Rua / Logradouro *</Label>
            <Input id="street" value={data.street} onChange={handleChange} placeholder="Ex: Avenida Paulista" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input id="number" value={data.number} onChange={handleChange} placeholder="123" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" value={data.complement} onChange={handleChange} placeholder="Apto, bloco, casa, etc." />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input id="neighborhood" value={data.neighborhood} onChange={handleChange} placeholder="Ex: Bela Vista" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input id="city" value={data.city} onChange={handleChange} placeholder="Ex: São Paulo" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado *</Label>
          <Select value={data.state} onValueChange={(value) => setData(prev => ({ ...prev, state: value }))}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Selecione seu estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map(state => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  )
}