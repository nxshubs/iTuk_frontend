"use client"

import { useRef } from "react"; // 👈 Adicionado para o input de arquivo
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Camera, User } from "lucide-react"
import { Provider } from "@/types/Provider"

interface BasicInformationsProps {
  profileData: Provider | null;
  handleInputChange: (field: keyof Provider, value: any) => void;
  onImageSelect: (file: File, previewUrl: string) => void; 
}

export default function BasicInformations({ profileData, handleInputChange, onImageSelect }: BasicInformationsProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitial = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const profession = profileData?.services?.[0]?.name || "Não definida";

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl); 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Informações Básicas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />

        <div className="flex flex-col items-center gap-4 mb-6">
          {profileData?.photoUrl ? (
            <img
              src={profileData.photoUrl}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center border border-orange-200">
              <span className="text-5xl font-bold">{getInitial(profileData?.name)}</span>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full max-w-xs"
            onClick={handleButtonClick}
          >
            <Camera className="w-4 h-4 mr-2" />
            Alterar foto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={profileData?.name || ''}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label>Profissão Principal</Label>
            <Input
                value={profession}
                disabled
                className="disabled:opacity-100 disabled:cursor-default"
            />
          </div>
          <div>
            <Label htmlFor="telephone">Telefone</Label>
            <Input
              id="telephone"
              value={profileData?.telephone || ''}
              onChange={(e) => handleInputChange("telephone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={profileData?.whatsapp || ''}
              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              disabled 
              className="disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}