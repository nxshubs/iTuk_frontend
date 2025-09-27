// features/provider/profile/components/Gallery.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"

interface GalleryProps {
    images: string[]
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Galeria de Trabalhos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Trabalho ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}