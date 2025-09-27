import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Props {
  profileData: UserProfileData | null
}

export default function Localization({ profileData }: Props) {

  const handleLocation = () => {
    if (!profileData?.address) return;
    const encodedAddress = encodeURIComponent(profileData.address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Localização</h2>
        <div className="flex items-start gap-3 font-poppins">
          <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{profileData?.address}</p>
            <Button onClick={handleLocation} variant="link" className="p-0 h-auto text-[#FC9056]">
              Ver no mapa
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}