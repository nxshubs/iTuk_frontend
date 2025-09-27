// features/provider/profile/components/ProfileHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ProfileHeaderProps {
  onBack: () => void;
}

export default function ProfileHeader({ onBack }: ProfileHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Button variant="ghost" onClick={onBack} className="font-poppins cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    </header>
  )
}