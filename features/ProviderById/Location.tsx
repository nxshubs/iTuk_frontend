// features/provider/profile/components/Location.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface LocationProps {
    address: string
}

export default function Location({ address }: LocationProps) {
    const handleLocation = () => {
        const encodedAddress = encodeURIComponent(address)
        window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank")
    }

    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Localização</h2>
                <div className="flex items-start gap-3 font-poppins">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium">{address}</p>
                        <Button onClick={handleLocation} variant="link" className="p-0 h-auto text-[#FC9056]">
                            Ver no mapa
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}