// features/provider/profile/components/ReviewsSection.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, MoreHorizontal } from "lucide-react"
import type { Review } from "@/types/Review"
import { Badge } from "@/components/ui/badge"

interface RatingDistribution {
  stars: number
  count: number
  percentage: number
}

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  reviewCount: number
  ratingDistribution: RatingDistribution[]
}

const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
  const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${starSize} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

export default function ReviewsSection({ reviews, rating, reviewCount, ratingDistribution }: ReviewsSectionProps) {
  const [reviewsToShow, setReviewsToShow] = useState(3)
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Avaliações e comentários</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold mb-2">{rating.toFixed(1)}</div>
            <div className="flex justify-center md:justify-start mb-2">{renderStars(rating, "md")}</div>
            <div className="text-sm text-muted-foreground font-poppins">{reviewCount} avaliações</div>
          </div>
          <div className="flex-1">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 mb-2 font-poppins">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DE AVALIAÇÕES PREENCHIDA */}
        <div className="space-y-6">
          {reviews.slice(0, reviewsToShow).map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex gap-4">
                <img
                  src={review.reviewer.photoUrl || "/placeholder.svg"}
                  alt={review.reviewer.name || "Avaliador"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold">{review.reviewer.name}</span>
                    <span className="text-sm text-muted-foreground font-poppins">
                      {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-muted-foreground mb-3 leading-relaxed font-poppins">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHelpfulClick(review.id)}
                      className={`h-8 px-3 ${
                        helpfulReviews.has(review.id)
                          ? "text-[#FC9056] bg-[#FC9056]/10"
                          : "text-muted-foreground hover:text-[#FC9056] font-poppins cursor-pointer"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                       Útil
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviewsToShow < reviews.length && (
          <div className="text-center mt-6">
            <Button 
              onClick={() => setReviewsToShow(prev => prev + 3)} 
              variant="outline"
              className="border-[#FC9056] text-[#FC9056] hover:bg-[#FC9056]/10 bg-transparent cursor-pointer"
            >
              Ler mais avaliações ({reviews.length - reviewsToShow} restantes)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}