"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ArrowRight } from "lucide-react"

export default function ProviderDashboardLinkCard() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/dashboard/provider");
  };

  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#FC9056]" /> 
          Painel do Prestador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between font-poppins">
          <div>
            <h4 className="font-medium">Você já é um prestador</h4>
            <p className="text-sm text-muted-foreground">
              Acesse seu painel para gerenciar seus serviços e agendamentos.
            </p>
          </div>
          <Button onClick={handleNavigate} className="bg-[#FC9056] hover:bg-[#ff8340] text-white">
            Acessar Painel
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}