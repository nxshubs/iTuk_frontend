"use client"

import type React from "react"
import type { Provider } from "@/types/Provider" 
import { DetailedAddress } from "@/types/DetailedAddress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Instagram, Heart, Phone, XCircle, Loader2 } from "lucide-react"
import WhatsAppIcon from "@/components/ui/whatsapp"

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


interface ProviderCardProps {
    provider: Provider
    isFavorite: boolean
    isFavoriting: boolean
    onFavoriteClick: (providerId: string, e: React.MouseEvent) => void
    onBookService: (provider: Provider, e: React.MouseEvent) => void
    onCardClick: (providerId: string) => void
    userTimeZone: string;
}

const getAvailabilityInfo = (nextAvailableDate?: string | null, userTimeZone?: string) => {
    if (!nextAvailableDate || !userTimeZone) {
        return { text: "Indisponível", iconColor: "text-red-500" };
    }

    try {
        const nowInUserTZ = dayjs().tz(userTimeZone);
        
        const availableDateTimeInUserTZ = dayjs.utc(nextAvailableDate).tz(userTimeZone);

        if (availableDateTimeInUserTZ.isSameOrBefore(nowInUserTZ, 'minute')) {
            return { text: "Indisponível", iconColor: "text-red-500" };
        }

        const todayInUserTZ = nowInUserTZ.startOf('day');
        const availableDateStartInUserTZ = availableDateTimeInUserTZ.startOf('day');

        const diffDays = availableDateStartInUserTZ.diff(todayInUserTZ, 'day');

        if (diffDays === 0) {
            return { text: "Disponível hoje", iconColor: "text-green-500" };
        }
        if (diffDays === 1) {
            return { text: "Disponível amanhã", iconColor: "text-blue-500" };
        }
        if (diffDays > 1) {
            const dateText = availableDateTimeInUserTZ.format('DD/MM'); 
            return { text: `Disponível em ${dateText}`, iconColor: "text-muted-foreground" };
        }
        return { text: "Indisponível", iconColor: "text-red-500" };


    } catch (error) {
        console.error("Erro ao processar data de disponibilidade:", error);
        return { text: "Data inválida", iconColor: "text-red-500" };
    }
};

// --- FUNÇÃO formatAddress ATUALIZADA ---
const formatAddress = (fullAddress?: string | null, detailedAddress?: DetailedAddress | null): string => {
    // 1. Prioriza o detailedAddress se disponível
    if (detailedAddress) {
        const parts = [detailedAddress.neighborhood, detailedAddress.city, detailedAddress.state].filter(Boolean);
        if (parts.length > 0) {
            if (detailedAddress.neighborhood && detailedAddress.city) {
                return `${detailedAddress.neighborhood}, ${detailedAddress.city}`;
            } else if (detailedAddress.city && detailedAddress.state) {
                return `${detailedAddress.city}, ${detailedAddress.state}`;
            } else if (detailedAddress.city) {
                return detailedAddress.city;
            } else if (detailedAddress.state) {
                return detailedAddress.state;
            }
        }
    }

    // 2. Fallback para a lógica de parsing da string de endereço antiga
    if (!fullAddress) {
        return "";
    }

    const cleanedAddress = fullAddress
        .replace(/-\s*[A-Z]{2}\b/g, '') 
        .replace(/\b[A-Z]{2}\b/g, '') 
        .replace(/,\s*,/g, ',') 
        .trim();

    const parts = cleanedAddress.split(',').map(part => part.trim()).filter(Boolean);

    let relevantParts = [];
    for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (!/^\d+$/.test(part) && !/^\d{5}-\d{3}$/.test(part)) { // Ignora números e CEPs
            relevantParts.unshift(part); 
            if (relevantParts.length === 2) { // Pega no máximo as duas últimas partes relevantes (ex: "Bairro, Cidade")
                break;
            }
        }
    }

    if (relevantParts.length === 2) {
        return relevantParts.join(', ');
    } 
    else if (relevantParts.length === 1) {
        return relevantParts[0];
    }
    return ""; 
};


export default function ProviderCard({
    provider,
    isFavorite,
    isFavoriting,
    onFavoriteClick,
    onBookService,
    onCardClick,
    userTimeZone
}: ProviderCardProps) {
    
    const availability = getAvailabilityInfo(provider.nextAvailableDate, userTimeZone);
    // --- MUDANÇA AQUI: Passar o detailedAddress para a função ---
    const displayAddress = formatAddress(provider.address, provider.detailedAddress);

    console.log(`[ProviderCard - ${provider.name}] nextAvailableDate:`, provider.nextAvailableDate, 
                " | userTimeZone:", userTimeZone, 
                " | Availability Info:", availability);

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
                        <p className="text-muted-foreground text-sm mb-2 font-poppins">{provider.specialty}</p>
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
                <div className="flex items-center justify-between mb-4 font-poppins">
                    {provider.services && provider.services.length > 0 && provider.services[0].price !== undefined ? (
                        <span className="font-semibold text-[#FC9056]">
                            A partir de R$ {provider.services[0].price.toFixed(2).replace('.', ',')}
                        </span>
                    ) : (
                        <span className="font-semibold text-muted-foreground">Preço a consultar</span>
                    )}
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