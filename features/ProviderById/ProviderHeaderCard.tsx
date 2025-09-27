// features/provider/profile/components/ProviderHeaderCard.tsx
"use client"

import type { Provider } from "@/types/Provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, CreditCard, Heart, Calendar, Phone } from "lucide-react"
import WhatsAppIcon from "@/components/ui/whatsapp"

interface ProviderHeaderCardProps {
  provider: Provider
  isFavorite: boolean
  onFavoriteToggle: () => void
  onBooking: () => void
}

export default function ProviderHeaderCard({ provider, isFavorite, onFavoriteToggle, onBooking }: ProviderHeaderCardProps) {
  
  const handleAction = (url: string) => window.open(url, "_blank");
  
  return (
    <Card className="relative">
      <Button variant="ghost" size="sm" onClick={onFavoriteToggle} className="absolute top-4 right-4 z-10 p-2 h-auto hover:bg-white/80">
        <Heart className={`w-6 h-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}`} />
      </Button>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img src={provider.photoUrl || "/placeholder.svg"} alt={provider.name || "Prestador"} className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">{provider.name}</h1>
            <p className="text-xl text-muted-foreground mb-3 font-poppins">{provider.specialty}</p>

            <div className="flex items-center justify-center md:justify-start gap-4 mb-4 font-poppins">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{provider.averageRating?.toFixed(1) ?? "N/A"}</span>
                <span className="ml-1 text-muted-foreground">({provider.reviewCount} avaliações)</span>
              </div>
              {provider.address && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {provider.address}
                </div>
              )}
            </div>

            {provider.paymentMethods.length > 0 && (
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-4">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                {provider.paymentMethods.map((method) => (
                  <Badge key={method} variant="outline" className="font-poppins text-xs">{method}</Badge>
                ))}
              </div>
            )}
            
            <div className="text-2xl font-bold text-[#FC9056] mb-4">{provider.price}</div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start font-poppins">
              <Button onClick={onBooking} className="bg-[#FC9056] hover:bg-[#ff8340] flex-1 sm:flex-none cursor-pointer">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Serviço
              </Button>
              {provider.whatsapp && (
                 <Button onClick={() => handleAction(`https://wa.me/${provider.whatsapp?.replace(/\D/g, "")}`)} variant="outline" className="border-green-500 cursor-pointer text-green-600 hover:bg-green-50 flex-1 sm:flex-none bg-transparent">
                   <WhatsAppIcon className="w-4 h-4" />
                 </Button>
              )}
              {provider.telephone && (
                <Button onClick={() => handleAction(`tel:${provider.telephone}`)} variant="outline" className="border-purple-500 cursor-pointer text-purple-600 hover:bg-purple-50 flex-1 sm:flex-none bg-transparent">
                  <Phone className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}