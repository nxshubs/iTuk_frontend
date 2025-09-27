"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette } from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function AppearanceSettingsCard() {
  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#FC9056]" />
          Aparência
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between font-poppins">
          <div>
            <h4 className="font-medium">Tema</h4>
            <p className="text-sm text-muted-foreground">Escolha entre tema claro, escuro ou do sistema</p>
          </div>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  )
}