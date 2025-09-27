"use client"

import type React from "react"
import type { Provider } from "@/types/Provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Instagram, Heart, Phone, XCircle, Loader2 } from "lucide-react" // CORREÇÃO: Importa o Loader2
import WhatsAppIcon from "../../components/ui/whatsapp"

interface ProviderCardProps {
    provider: Provider
    isFavorite: boolean
    isFavoriting: boolean // CORREÇÃO: Nova prop para o estado de carregamento
    onFavoriteClick: (providerId: string, e: React.MouseEvent) => void
    onBookService: (provider: Provider, e: React.MouseEvent) => void
    onCardClick: (providerId: string) => void
}

const getAvailabilityInfo = (nextAvailableDate?: string | null) => {
    if (!nextAvailableDate) return { text: "Indisponível", iconColor: "text-red-500" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableDate = new Date(nextAvailableDate);
    availableDate.setHours(0, 0, 0, 0);
    const diffTime = availableDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: "Indisponível", iconColor: "text-red-500" };
    if (diffDays === 0) return { text: "Disponível hoje", iconColor: "text-green-500" };
    if (diffDays === 1) return { text: "Disponível amanhã", iconColor: "text-blue-500" };
    const dateText = availableDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return { text: `Disponível em ${dateText}`, iconColor: "text-muted-foreground" };
};

const formatAddress = (address?: string | null): string => {
    if (!address) return "";
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 4) {
        const cityAndState = parts[parts.length - 2];
        const city = cityAndState.split(' - ')[0];
        const neighborhood = parts[parts.length - 3];
        return `${neighborhood}, ${city}`;
    }
    return address;
};

export default function ProviderCard({
    provider,
    isFavorite,
    isFavoriting,
    onFavoriteClick,
    onBookService,
    onCardClick,
}: ProviderCardProps) {
    
    const availability = getAvailabilityInfo(provider.nextAvailableDate);
    const displayAddress = formatAddress(provider.address);

    return (
        <Card
            key={provider.id}
            className="relative hover:shadow-lg transition-shadow cursor-pointer flex flex-col py-0"
            onClick={() => onCardClick(provider.id)}
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 rounded-full h-8 w-8"
                onClick={(e) => onFavoriteClick(provider.id, e)}
                disabled={isFavoriting}
            >
                {isFavoriting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#FC9056]" />
                ) : (
                    <Heart className={`h-5 w-5 transition-all ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-gray-600"}`} />
                )}
            </Button>
            <CardContent className="pt-6 flex-grow">
                <div className="flex items-start gap-4">
                    <img src={provider.photoUrl || "/placeholder.svg"} alt={provider.name || "Prestador"} className="w-16 h-16 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground mb-1 truncate">{provider.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2 font-poppins">{provider.service}</p>
                    </div>
                </div>
            </CardContent>
            <CardContent className="flex-grow font-poppins">
                <div className="flex items-center gap-1 mb-2">
                    <Star className={`w-4 h-4 ${provider.reviewCount > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    <span className="font-medium">{provider.averageRating ? provider.averageRating.toFixed(1) : "-"}</span>
                    <span className="text-muted-foreground text-sm">({provider.reviewCount} {provider.reviewCount === 1 ? "avaliação" : "avaliações"})</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {displayAddress ? (
                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{displayAddress}</span></div>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-400"><XCircle className="w-4 h-4" /><span>Sem local</span></div>
                    )}
                    <div className={`flex items-center gap-1 ${availability.iconColor}`}>
                        <Clock className="w-4 h-4" />
                        <span>{availability.text}</span>
                    </div>
                </div>
            </CardContent>
            <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-[#FC9056]">{provider.price}</span>
                </div>
                <div className="flex flex-col lg:flex-row w-full items-center gap-3">
                    <Button size="sm" className="bg-[#FC9056] hover:bg-[#f57733] cursor-pointer w-full md:flex-1 py-2 font-poppins" onClick={(e) => onBookService(provider, e)}>
                        Agendar
                    </Button>
                    <div className="flex w-full lg:w-auto items-center gap-2">
                        {provider.whatsapp &&
                            <a href={`https://wa.me/${provider.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={e => e.stopPropagation()}>
                                <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 hover:bg-muted/50 bg-transparent"><WhatsAppIcon className="h-4 w-4" /></Button>
                            </a>
                        }
                        {provider.telephone &&
                            <a href={`tel:${provider.telephone}`} aria-label="Ligar" onClick={e => e.stopPropagation()}>
                                <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 hover:bg-muted/50 bg-transparent"><Phone className="h-4 w-4" /></Button>
                            </a>
                        }
                        {provider.instagram &&
                            <a href={`https://instagram.com/${provider.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" onClick={e => e.stopPropagation()}>
                                <Button variant="outline" size="icon" className="rounded-lg h-9 w-9 hover:bg-muted/50 bg-transparent"><Instagram className="h-4 w-4" /></Button>
                            </a>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}