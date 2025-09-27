"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { Provider } from "@/types/Provider"; // 👈 CORREÇÃO: Usa o tipo Provider

interface LocalizationProps {
  profileData: Provider | null;
  handleInputChange: (field: keyof Provider, value: any) => void;
}

export default function LocalizationAndPrice({ profileData, handleInputChange }: LocalizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Endereço Completo</Label>
          <Input
            id="address"
            value={profileData?.address ?? ''}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Rua, número, bairro, cidade - estado"
          />
        </div>
      </CardContent>
    </Card>
  )
}