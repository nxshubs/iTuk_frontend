import { UserProfileData } from "@/app/(private)/dashboard/provider/profile/page";
import { Card, CardContent } from "@/components/ui/card";
import { Award, CheckCircle, Users } from "lucide-react";

interface Props {
  profileData: UserProfileData | null
}

export default function ProviderStats({ profileData }: Props) {
  console.log("profileData?.reviewsReceived.length:", profileData?.reviewsReceived.length)
  return(
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <Award className="w-8 h-8 text-[#FC9056] mx-auto mb-2" />
          <div className="text-2xl font-bold">{profileData?.experience}</div>
          <div className="text-sm text-muted-foreground font-poppins">Experiência</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{profileData?.completedJobs}</div>
          <div className="text-sm text-muted-foreground font-poppins">Trabalhos</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{profileData?.reviewsReceived.length === undefined && 0}</div>
          <div className="text-sm text-muted-foreground font-poppins">Avaliações</div>
        </CardContent>
      </Card>
    </div>
  )
}