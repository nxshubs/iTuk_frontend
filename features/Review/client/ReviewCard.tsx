"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Edit } from "lucide-react"
import { Review } from "@/types/Review" 

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {


  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FC9056] to-[#fa9d6b] rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {review.reviewed?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h4 className="font-semibold text-foreground group-hover:text-[#FC9056] transition-colors">
                {review.reviewed?.name || 'Prestador de Serviço'}
              </h4>
              {review.service?.name && (
                  <p className="text-sm text-muted-foreground font-poppins">{review.service.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4 italic font-poppins">
            "{review.comment}"
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-poppins">
            Avaliado em{" "}
            {new Date(review.createdAt).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}