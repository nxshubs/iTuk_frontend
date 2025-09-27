import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  profileData: UserProfileData | null
}

export default function ServicesDescription({ profileData }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Descrição dos Serviços</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed font-poppins">
            Ofereço serviços completos de limpeza residencial e comercial com foco na qualidade e satisfação do
            cliente. Utilizo produtos de alta qualidade e técnicas profissionais para garantir um ambiente limpo
            e saudável.
          </p>
          {/* <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-[#FC9056]">Diferenciais do meu trabalho:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground font-poppins">
              <li>• Produtos ecológicos e seguros</li>
              <li>• Equipamentos profissionais</li>
              <li>• Flexibilidade de horários</li>
              <li>• Orçamento personalizado</li>
              <li>• Garantia de satisfação</li>
            </ul>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}