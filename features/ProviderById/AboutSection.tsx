// features/provider/profile/components/AboutSection.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"

interface AboutSectionProps {
  bio: string
}

export default function AboutSection({ bio }: AboutSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Sobre</h2>
        <p className="text-muted-foreground leading-relaxed font-poppins">{bio}</p>
      </CardContent>
    </Card>
  )
}