"use client"

import { useState, useEffect } from "react"
import Cookies from 'js-cookie';

// Seus imports de componentes
import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import PremiumAlert from "@/features/Review/PremiumAlert"
import ReviewFilter from "@/features/Review/StarFilter"
import ReviewList from "@/features/Review/ReviewList"
import { Card, CardContent } from "@/components/ui/card"
import { ProviderReviewsSkeleton } from "@/components/skeletons/ProviderReviewSkeleton";

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

export default function ProviderReviews() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 1000));

    const fetchReviews = async () => {
      const token = Cookies.get('authToken');
      if (!token) {
        setIsLoading(false);
        setApiError("Autenticação não encontrada.");
        return;
      }

      try {
        const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review/provider/my-reviews`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const reviewsData = await reviewsRes.json();
        if (!reviewsRes.ok) {
          throw new Error(reviewsData.error || "Falha ao buscar avaliações.");
        }
        setReviews(reviewsData);
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        await minLoadingPromise;
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  console.log("apiError", apiError)

  const filteredReviews = filter === "all" ? reviews : reviews.filter((r) => r.rating === Number.parseInt(filter));

  if (isLoading) {
    return <ProviderReviewsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="md:ml-64">
        <DashboardHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Minhas Avaliações</h1>
              <p className="text-muted-foreground text-lg font-poppins">Veja o que seus clientes estão dizendo sobre você</p>
            </div>

            {apiError ? (
              apiError.includes("premium") ? (
                <PremiumAlert />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-red-500">
                    <p>Erro: {apiError}</p>
                  </CardContent>
                </Card>
              )
            ) : (
              <>
                <ReviewFilter filter={filter} setFilter={setFilter} />
                <ReviewList reviews={filteredReviews} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
