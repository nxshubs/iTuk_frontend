"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export default function SecuritySettingsCard() {
  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#FC9056]" />
          Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 font-poppins">
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">Excluir Conta</Button>
      </CardContent>
    </Card>
  )
}