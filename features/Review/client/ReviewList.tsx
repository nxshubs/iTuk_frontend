"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import ReviewCard from "./ReviewCard"
import { Review } from "@/types/Review" 

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6 animate-slide-in-from-bottom animation-delay-400">
      {reviews.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nenhuma avaliação encontrada</p>
              <p className="text-sm">Tente ajustar os filtros para ver mais resultados.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  )
}