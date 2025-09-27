"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { useState, useEffect, useMemo } from "react"
import ClientReviewsView from "@/features/Review/client/ClientReviewsView"
import { Review } from "@/types/Review"
import Cookies from "js-cookie"
import { Loader2 } from "lucide-react"
import { apiFetch } from "@/lib/api"

export default function ClientReviewsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados para os filtros
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  // Estados para os dados da API
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyReviews = async () => {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('authToken');

      if (!token) {
        setError("Não autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review/client/my-reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log(response)

        if (!response.ok) {
          throw new Error("Falha ao carregar suas avaliações.");
        }

        const fetchedReviews: Review[] = await response.json();
        setReviews(fetchedReviews);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  }, [reviews]);

  const uniqueSpecialties = useMemo(() => {
    return [...new Set(reviews.map((review) => review.service?.name || ''))].filter(Boolean);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (ratingFilter !== "all" && review.rating !== Number.parseInt(ratingFilter)) return false;
      if (specialtyFilter !== "all" && review.service?.name !== specialtyFilter) return false;
      if (dateFilter !== "all") {
        const reviewDate = new Date(review.createdAt);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (dateFilter === "week") return reviewDate >= weekAgo;
        if (dateFilter === "month") return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [reviews, ratingFilter, dateFilter, specialtyFilter]);

  const clearFilters = () => {
    setRatingFilter("all");
    setDateFilter("all");
    setSpecialtyFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#FC9056]" />
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="md:ml-64">
        <DashboardHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-6 lg:p-8">
          <ClientReviewsView
            reviews={reviews}
            filteredReviews={filteredReviews}
            averageRating={averageRating}
            uniqueSpecialties={uniqueSpecialties}
            filters={{ ratingFilter, dateFilter, specialtyFilter }}
            setFilters={{ setRatingFilter, setDateFilter, setSpecialtyFilter }}
            clearFilters={clearFilters}
          />
        </main>
      </div>
    </div>
  )
}