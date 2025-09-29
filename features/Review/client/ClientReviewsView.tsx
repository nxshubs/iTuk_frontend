"use client"

import ReviewsHeader from "@/features/Review/client/ReviewsHeader"
import ReviewsStats from "@/features/Review/client/ReviewStats"
import ReviewsFilters from "@/features/Review/client/ReviewsFilters"
import ReviewList from "@/features/Review/client/ReviewList"
import { Review } from "@/types/Review" 

interface ClientReviewsViewProps {
  reviews: Review[];
  filteredReviews: Review[];
  averageRating: number;
  uniqueSpecialties: string[];
  filters: {
    ratingFilter: string;
    dateFilter: string;
    specialtyFilter: string;
  };
  setFilters: {
    setRatingFilter: (value: string) => void;
    setDateFilter: (value: string) => void;
    setSpecialtyFilter: (value: string) => void;
  };
  clearFilters: () => void;
}

export default function ClientReviewsView({
  reviews,
  filteredReviews,
  averageRating,
  uniqueSpecialties,
  filters,
  setFilters,
  clearFilters,
}: ClientReviewsViewProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <ReviewsHeader />

      {/* <ReviewsStats 
        totalReviews={reviews.length}
        averageRating={averageRating}
        filteredCount={filteredReviews.length}
      /> */}
      
      <ReviewsFilters
        filters={filters}
        setFilters={setFilters}
        uniqueSpecialties={uniqueSpecialties}
        clearFilters={clearFilters}
      />

      <ReviewList reviews={filteredReviews} />
    </div>
  )
}