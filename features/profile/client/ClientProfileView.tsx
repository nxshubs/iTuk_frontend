"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import ProfilePhotoSection from "./ProfilePhotoSection"
import ProfileFormSection from "./ProfileFormSection"
import GoogleConnectSection from "./GoogleConnectSection"
import { ProfileData } from "@/types/ProfileData"

interface ClientProfileViewProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  isGoogleConnected: boolean;
  onGoogleConnect: () => void;
  photoPreview: string | null; // Nova prop
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Nova prop
}

export default function ClientProfileView({
  profileData,
  setProfileData,
  isGoogleConnected,
  onGoogleConnect,
  photoPreview,
  onFileChange,
}: ClientProfileViewProps) {
  return (
    <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#FC9056]" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePhotoSection 
          photoUrl={profileData.photoUrl}
          photoPreview={photoPreview}
          userName={profileData.name}
          onFileChange={onFileChange}
        />
        <ProfileFormSection 
          profileData={profileData}
          onDataChange={setProfileData}
        />
        <GoogleConnectSection 
          isConnected={isGoogleConnected}
          onConnectToggle={onGoogleConnect}
        />
      </CardContent>
    </Card>
  )
}