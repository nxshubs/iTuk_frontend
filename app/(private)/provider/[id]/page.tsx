// Arquivo: app/dashboard/client/provider/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProviderProfileView from "@/features/ProviderById/ProviderProfileView"
import type { Provider } from "@/types/Provider"
import type { Review } from "@/types/Review"
import Cookies from "js-cookie"
import { apiFetch } from "@/lib/api"

interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id as string

  const [provider, setProvider] = useState<Provider | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!providerId) return

    const fetchProviderData = async () => {
      setIsLoading(true)
      setError(null)
      const token = Cookies.get('authToken')

      if (!token) {
        setError("Sessão inválida. Por favor, faça login novamente.")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${providerId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao buscar dados do prestador.");
        }

        const data = await response.json();

        setProvider(data);
        setReviews(data.reviewsReceived || []);
        setRatingDistribution(data.ratingDistribution || []);

      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviderData()
  }, [providerId])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando perfil...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!provider) {
    return <div className="flex justify-center items-center h-screen">Prestador não encontrado.</div>
  }

  return (
    <ProviderProfileView
      provider={provider}
      reviews={reviews}
      ratingDistribution={ratingDistribution} 
    />
  )
}