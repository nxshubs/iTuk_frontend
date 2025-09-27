"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Provider } from "@/types/Provider"; // 👈 CORREÇÃO: Usa o tipo Provider
import { PenSquare } from "lucide-react";

interface BiographyProps {
  profileData: Provider | null;
  handleInputChange: (field: keyof Provider, value: any) => void;
}

export default function Biography({ profileData, handleInputChange }: BiographyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <PenSquare className="w-5 h-5 text-primary" />
            Sobre Você e Seus Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Sua Biografia (Opcional)</Label>
          <Textarea
            id="description"
            value={profileData?.description ?? ''}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            placeholder="Conte um pouco sobre sua experiência e qualificações..."
          />
        </div>
        <div>
          <Label htmlFor="servicesDescription">Descrição Detalhada dos Serviços (Opcional)</Label>
          <Textarea
            id="servicesDescription" // 👈 CORREÇÃO: Nome do campo ajustado
            value={profileData?.serviceDescription ?? ''}
            onChange={(e) => handleInputChange("serviceDescription", e.target.value)}
            rows={4}
            placeholder="Descreva detalhadamente os serviços que você oferece..."
          />
        </div>
      </CardContent>
    </Card>
  )
}