"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface StepProps {
  data: ProviderApplicationData;
  setData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Step1_PersonalData({ data, setData, onFileChange }: StepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-[#FC9056] mb-4">Dados Pessoais</h3>
      <div className="space-y-2">
        <Label htmlFor="profilePhoto">Foto de Perfil (Opcional)</Label>
        <Input id="profilePhoto" type="file" onChange={onFileChange} accept="image/*" className="cursor-pointer"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo *</Label>
          <Input id="fullName" value={data.fullName} onChange={handleChange} placeholder="Seu nome completo"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input id="cpf" value={data.cpf} onChange={handleChange} placeholder="000.000.000-00"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">Data de Nascimento *</Label>
          <Input id="birthDate" type="date" value={data.birthDate} onChange={handleChange}/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gênero *</Label>
          <Select value={data.gender} onValueChange={(value) => setData(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger><SelectValue placeholder="Selecione"/></SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp *</Label>
          <Input id="whatsapp" value={data.whatsapp} onChange={handleChange} placeholder="(00) 90000-0000"/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (Opcional)</Label>
          <Input id="phone" value={data.phone} onChange={handleChange} placeholder="(00) 0000-0000"/>
        </div>
      </div>
    </div>
  )
}