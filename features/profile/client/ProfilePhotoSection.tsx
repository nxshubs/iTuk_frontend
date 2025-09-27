"use client"

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface ProfilePhotoSectionProps {
  photoUrl: string | null;
  photoPreview: string | null;
  userName: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePhotoSection({ 
  photoUrl, 
  photoPreview, 
  userName,
  onFileChange 
}: ProfilePhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string | null) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  return (
    <div className="flex items-center gap-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
      />

      <Avatar key={photoPreview || photoUrl} className="w-24 h-24">
        <AvatarImage src={photoPreview || photoUrl || ''} />
        <AvatarFallback className="bg-gradient-to-br from-[#FC9056] to-[#ff9f6c] text-white text-2xl">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="font-poppins">
        <Button 
          variant="outline" 
          className="mb-2 bg-transparent"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="w-4 h-4 mr-2" />
          Alterar Foto
        </Button>
        <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
      </div>
    </div>
  )
}