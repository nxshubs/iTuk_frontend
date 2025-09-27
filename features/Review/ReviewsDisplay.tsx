import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ReviewsDisplay() {
  const reviews = [
    {
      id: "1",
      clientName: "Maria Santos",
      rating: 5,
      comment: "Excelente profissional! Muito pontual e caprichosa.",
      date: "2024-01-10",
      isPublic: false,
    },
    {
      id: "2",
      clientName: "João Silva",
      rating: 4,
      comment: "Bom trabalho, recomendo!",
      date: "2024-01-08",
      isPublic: false,
    },
  ]

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">Suas avaliações não estão públicas</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Assine o plano premium para tornar suas avaliações visíveis para novos clientes
            </p>
          </div>
          <Link href="/subscription">
            <Button className="bg-[#6A0DAD] hover:bg-[#5A0B9D] text-white">Assinar Premium</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Resumo das Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-[#6A0DAD]">{averageRating.toFixed(1)}</div>
            <div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{reviews.length} avaliações</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="relative">
            {!review.isPublic && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Privada
                </span>
              </div>
            )}
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{review.clientName}</h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString("pt-BR")}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
