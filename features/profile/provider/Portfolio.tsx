"use client"

// A importação do tipo UserProfileData deve apontar para o local correto
import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";

interface Props {
    profileData: UserProfileData | null
}

export default function Portfolio({ profileData }: Props) {
    // Acessa o portfólio de forma segura, garantindo que seja um array
    const portfolioImages = profileData?.portfolio || [];

    return (
        <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Portfólio de Trabalhos
                </CardTitle>
            </CardHeader>
            <CardContent>
                {portfolioImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {portfolioImages.map((image) => ( // 'image' é o objeto { id, imageUrl }
                            <div key={image.id} className="overflow-hidden rounded-lg group relative">
                                <img
                                    src={image.imageUrl || "/placeholder.svg"}
                                    alt={`Foto do portfólio`}
                                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40 rounded-lg border-2 border-dashed">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span>Nenhuma imagem no portfólio ainda.</span>
                        <span className="text-xs">Adicione fotos na tela de edição de perfil.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}