"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Review {
  id: string;
  clientName: string;
  clientPhotoUrl: string | null; 
  rating: number;
  comment: string | null;
  date: string;
  service: string;
  isPublic: boolean;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6 animate-slide-in-from-bottom animation-delay-400">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  {/* CORREÇÃO: Lógica do Avatar */}
                  {review.clientPhotoUrl ? (
                    <img src={review.clientPhotoUrl} alt={review.clientName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-[#FC9056] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {review.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-[#FC9056] transition-colors">
                      {review.clientName}
                    </h4>
                    <p className="text-sm text-muted-foreground font-poppins dark:text-gray-400">{review.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-poppins">
                  <Badge variant={review.isPublic ? "default" : "secondary"} className="text-xs">
                    {review.isPublic ? "Pública" : "Privada"}
                  </Badge>
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
              {review.comment && (
                <p className="text-muted-foreground leading-relaxed mb-4 italic font-poppins dark:text-gray-400">"{review.comment}"</p>
              )}
              <p className="text-sm text-muted-foreground font-poppins dark:text-gray-400">
                {new Date(review.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                <p>Nenhuma avaliação encontrada para este filtro.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

