"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Provider } from "@/types/Provider"
import type { Review } from "@/types/Review"
import type { Availability } from "@/types/Availability"

import BookingModal from "@/features/appointments/BookingModal"
import ProfileHeader from "@/features/ProviderById/ProfileHeader"
import ProviderHeaderCard from "@/features/ProviderById/ProviderHeaderCard"
import ProviderStats from "@/features/ProviderById/ProviderStats"
import AboutSection from "@/features/ProviderById/AboutSection"
import ServicesOffered from "@/features/ProviderById/ServicesOffered"
import ServiceDescription from "@/features/ProviderById/ServiceDescription"
import ReviewsSection from "@/features/ProviderById/ReviewsSection"
import WorkingHours from "@/features/ProviderById/WorkingHours"
import Gallery from "@/features/ProviderById/Gallery" 
import Location from "@/features/ProviderById/Location"

const formatAvailability = (availability: Availability[]): string[] => {
  if (!availability || availability.length === 0) {
    return ["Horários não definidos."];
  }
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const sortedAvailability = availability.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  
  return sortedAvailability
    .map(avail => `${daysOfWeek[avail.dayOfWeek]}: ${avail.startTime} - ${avail.endTime}`);
};

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

interface ProviderProfileViewProps {
  provider: Provider
  reviews: Review[]
  ratingDistribution: RatingDistribution[]
}

export default function ProviderProfileView({ provider, reviews, ratingDistribution }: ProviderProfileViewProps) {
  const router = useRouter()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false) 

  return (
    <div className="min-h-screen bg-muted/30">
      <ProfileHeader onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <ProviderHeaderCard
          provider={provider}
          isFavorite={isFavorite}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onBooking={() => setIsBookingModalOpen(true)}
        />
        
        <ProviderStats provider={provider} />

        {provider.description && <AboutSection bio={provider.description} />}
        
        {provider.services && provider.services.length > 0 && (
          <ServicesOffered services={provider.services.map(s => s.name)} />
        )}
        
        {provider.serviceDescription && (
          <ServiceDescription description={provider.serviceDescription} />
        )}
        
        <ReviewsSection 
          reviews={reviews} 
          rating={provider.averageRating ?? 0}
          reviewCount={provider.reviewCount}
          ratingDistribution={ratingDistribution} 
        />
        
        {provider.availability && provider.availability.length > 0 && (
          <WorkingHours hours={formatAvailability(provider.availability)} />
        )}

        {provider.portfolio && provider.portfolio.length > 0 && (
          <Gallery images={provider.portfolio.map(p => p.imageUrl)} />
        )}
        
        {provider.address && <Location address={provider.address} />}
      </main>

      <BookingModal
        provider={provider}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  )
}