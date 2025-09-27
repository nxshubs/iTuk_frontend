import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  profileData: UserProfileData | null
}

export default function About({ profileData }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Sobre</h2>
        <p className="text-muted-foreground leading-relaxed font-poppins">{profileData?.description}</p>
      </CardContent>
    </Card>
  )
}