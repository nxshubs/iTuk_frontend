"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
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
      const currentMethods = prev.paymentMethods || []; 
      if (checked) {
        return { ...prev, paymentMethods: [...currentMethods, method] };
      } else {
        return { ...prev, paymentMethods: currentMethods.filter(m => m !== method) };
      }
    });
  };

  const handleServiceChange = (value: string) => {
    if (value !== "Outro") {
      setData(prev => ({ ...prev, serviceName: value, customServiceName: "" }));
    } else {
      setData(prev => ({ ...prev, serviceName: value }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-semibold text-[#FC9056]">Serviços e Pagamentos</h3>
      <div className="space-y-4">
        
        {/* --- SELEÇÃO DE SERVIÇO --- */}
        <div className="space-y-2">
          <Label htmlFor="serviceName">Principal Serviço Oferecido *</Label>
          <Select value={data.serviceName} onValueChange={handleServiceChange}>
            <SelectTrigger id="serviceName">
              <SelectValue placeholder="Selecione um serviço da lista..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Limpeza</SelectLabel>
                <SelectItem value="Limpeza Doméstica">Limpeza Doméstica</SelectItem>
                <SelectItem value="Limpeza Pós-obra">Limpeza Pós-obra</SelectItem>
                <SelectItem value="Limpeza de Escritório">Limpeza de Escritório</SelectItem>
                <SelectItem value="Passar Roupas">Passar Roupas</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Manutenção e Reparos</SelectLabel>
                <SelectItem value="Eletricista">Eletricista</SelectItem>
                <SelectItem value="Encanador">Encanador</SelectItem>
                <SelectItem value="Montador de Móveis">Montador de Móveis</SelectItem>
                <SelectItem value="Pintor">Pintor</SelectItem>
                <SelectItem value="Pequenos Reparos (Marido de Aluguel)">Pequenos Reparos (Marido de Aluguel)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Cuidados Pessoais</SelectLabel>
                <SelectItem value="Cabeleireiro(a)">Cabeleireiro(a)</SelectItem>
                <SelectItem value="Manicure e Pedicure">Manicure e Pedicure</SelectItem>
                <SelectItem value="Maquiador(a)">Maquiador(a)</SelectItem>
                <SelectItem value="Massagista">Massagista</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Aulas e Tutoria</SelectLabel>
                <SelectItem value="Professor(a) Particular">Professor(a) Particular</SelectItem>
                <SelectItem value="Aula de Música">Aula de Música</SelectItem>
                <SelectItem value="Aula de Idiomas">Aula de Idiomas</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Eventos</SelectLabel>
                <SelectItem value="Bartender">Bartender</SelectItem>
                <SelectItem value="Churrasqueiro(a)">Churrasqueiro(a)</SelectItem>
                <SelectItem value="Cozinheiro(a)">Cozinheiro(a)</SelectItem>
                <SelectItem value="Garçom/Garçonete">Garçom/Garçonete</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Cuidados com Pets</SelectLabel>
                <SelectItem value="Dog Walker (Passeador de cães)">Dog Walker (Passeador de cães)</SelectItem>
                <SelectItem value="Pet Sitter (Babá de pets)">Pet Sitter (Babá de pets)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Outra Categoria</SelectLabel>
                <SelectItem value="Outro">Outro (especificar)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* --- CAMPO DE SERVIÇO CUSTOMIZADO (CONDICIONAL) --- */}
        {data.serviceName === "Outro" && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="customServiceName">Qual serviço você oferece? *</Label>
            <Input 
              id="customServiceName" 
              onChange={(e) => setData(prev => ({ ...prev, customServiceName: e.target.value }))} 
              placeholder="Ex: Cuidador de Idosos" 
            />
          </div>
        )}

        {/* --- PREÇO POR HORA --- */}
        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Preço Base por Hora (R$) *</Label>
          <Input 
            id="hourlyRate" 
            type="number" 
            value={data.hourlyRate} 
            onChange={(e) => setData(prev => ({ ...prev, hourlyRate: e.target.value }))} 
            placeholder="50.00" 
          />
           <p className="text-xs text-muted-foreground">Este é um preço inicial. Você poderá cadastrar preços específicos para cada serviço no seu perfil.</p>
        </div>
        
        {/* --- FORMAS DE PAGAMENTO --- */}
        <div className="space-y-2">
          <Label>Formas de Pagamento Aceitas *</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"].map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox 
                  id={method} 
                  checked={(data.paymentMethods || []).includes(method)} 
                  onCheckedChange={(checked) => handlePaymentMethodChange(method, checked as boolean)} 
                />
                <Label htmlFor={method} className="text-sm font-normal cursor-pointer">{method}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição dos Seus Serviços (Opcional)</Label>
          <Textarea 
            id="description" 
            value={data.description} 
            onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} 
            placeholder="Descreva sua experiência, especialidades e o que te diferencia como profissional..." 
            rows={4} 
          />
        </div>
      </div>
    </div>
  )
}