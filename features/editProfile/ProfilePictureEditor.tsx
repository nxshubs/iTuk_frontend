// src/features/editProfile/ProfilePictureEditor.tsx

"use client"

import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureEditorProps {
  imageUrl: string;
  name: string | null;
  onImageSelect: (file: File, previewUrl: string) => void;
  isSaving?: boolean;
}

export default function ProfilePictureEditor({
  imageUrl,
  name,
  onImageSelect,
  isSaving,
}: ProfilePictureEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação de tipo e tamanho
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // Limite de 2MB
      toast.error("A imagem é muito grande. O limite é de 2MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageSelect(file, previewUrl);
  };

  const handleAvatarClick = () => {
    if (!isSaving) {
      fileInputRef.current?.click();
    }
  };

  const nameInitial = name ? name.charAt(0).toUpperCase() : "P";

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative group cursor-pointer"
        onClick={handleAvatarClick}
      >
        <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-muted">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="text-4xl bg-gradient-to-br from-[#FC9056] to-[#ffab7d] text-white">
            {nameInitial}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Camera className="text-white h-8 w-8" />
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleAvatarClick}
        disabled={isSaving}
      >
        Mudar Foto
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
}