"use client"

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { Review } from '@/app/(private)/dashboard/provider/profile/page'; 

interface ReviewsProps {
  reviews: Review[];
}

const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`${starSize} ${star <= Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            ))}
        </div>
    );
};


export default function Reviews({ reviews }: ReviewsProps) {
    const [reviewsToShow, setReviewsToShow] = useState(3);

    const handleLoadMoreReviews = () => {
        setReviewsToShow(reviews.length); 
    };

    const calculateRatingStats = () => {
        if (!reviews || reviews.length === 0) {
            return { average: 0, count: 0, distribution: [] };
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const average = totalRating / reviews.length;
        const distribution = Array.from({ length: 5 }, (_, i) => {
            const star = 5 - i;
            const count = reviews.filter(r => r.rating === star).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return { stars: star, count, percentage };
        });
        return { average: parseFloat(average.toFixed(1)), count: reviews.length, distribution };
    };
    
    const ratingStats = calculateRatingStats();

    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">As suas Avaliações</h2>

                {ratingStats.count > 0 ? (
                    <>
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="text-center md:text-left">
                                <div className="text-5xl font-bold mb-2">{ratingStats.average}</div>
                                <div className="flex justify-center md:justify-start mb-2">
                                    {renderStars(ratingStats.average, "md")}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Baseado em {ratingStats.count} avaliações
                                </div>
                            </div>
                            <div className="flex-1">
                                {ratingStats.distribution.map((item) => (
                                    <div key={item.stars} className="flex items-center gap-3 mb-2">
                                        <span className="text-sm w-8">{item.stars} ★</span>
                                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                                        </div>
                                        <span className="text-sm text-muted-foreground w-8 text-right">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lista de Avaliações */}
                        <div className="space-y-6">
                            {reviews.slice(0, reviewsToShow).map((review) => (
                                <div key={review.id} className="border-t pt-6 first:border-t-0 first:pt-0">
                                    <div className="flex gap-4">
                                        <img
                                            src={review.reviewer.photoUrl || "/placeholder.svg"}
                                            alt={review.reviewer.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold">{review.reviewer.name}</span>
                                                <span className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                {renderStars(review.rating)}
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botão "Ver Mais" */}
                        {reviewsToShow < reviews.length && (
                            <div className="text-center mt-8">
                                <Button onClick={handleLoadMoreReviews} variant="outline">
                                    Ver todas as {reviews.length} avaliações
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground text-center py-4">Você ainda não possui nenhuma avaliação.</p>
                )}
            </CardContent>
        </Card>
    );
}