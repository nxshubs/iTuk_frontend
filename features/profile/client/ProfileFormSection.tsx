// Arquivo: features/profile/client/components/ProfileFormSection.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileData } from "@/types/ProfileData"

interface ProfileFormSectionProps {
  profileData: ProfileData;
  onDataChange: (data: ProfileData) => void;
}

export default function ProfileFormSection({ profileData, onDataChange }: ProfileFormSectionProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onDataChange({ ...profileData, [id]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" value={profileData.name ?? ''} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" value={profileData.email ?? ''} onChange={handleChange} disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telephone">Telefone</Label>
        <Input id="telephone" value={profileData.telephone ?? ''} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" value={profileData.whatsapp ?? ''} onChange={handleChange} disabled />
      </div>
    </div>
  )
}