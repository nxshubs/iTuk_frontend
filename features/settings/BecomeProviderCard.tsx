"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

interface BecomeProviderCardProps {
  onOpenModal: () => void;
}

export default function BecomeProviderCard({ onOpenModal }: BecomeProviderCardProps) {
  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#FC9056]" />
          Tornar-se Prestador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between font-poppins">
          <div>
            <h4 className="font-medium">Ofereça seus serviços</h4>
            <p className="text-sm text-muted-foreground">
              Cadastre-se como prestador e comece a receber solicitações
            </p>
          </div>
          <Button onClick={onOpenModal} className="bg-[#FC9056] hover:bg-[#ff8340] text-white">
            Começar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}