"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MapPin } from "lucide-react"

export default function LocationSettingsCard() {
  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FC9056]" />
          Preferências de Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between font-poppins">
          <div>
            <h4 className="font-medium">Usar localização atual</h4>
            <p className="text-sm text-muted-foreground">
              Permitir que o app use sua localização para encontrar prestadores
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="space-y-2 font-poppins">
          <Label htmlFor="searchRadius">Raio de busca (km)</Label>
          <Input id="searchRadius" type="number" defaultValue="10" min="1" max="50" />
        </div>
      </CardContent>
    </Card>
  )
}