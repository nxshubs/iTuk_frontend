import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  profileData: UserProfileData | null
}

export default function OferedServices({profileData}: Props) {
  return (
    <Card>
      <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Serviços Oferecidos</h2>
          <div className="flex flex-wrap gap-2">
            {profileData?.services.map((service) => (
                <Badge key={service.id} variant="secondary" className="bg-[#FC9056]/10 text-[#FC9056] text-sm p-2">
                    {service.name} - R$ {service.price.toFixed(2)}
                </Badge>
            ))}
          </div>
      </CardContent>
    </Card>
  )
}