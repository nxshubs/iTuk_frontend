"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { Appointment } from "@/types/Appointment"
import { toast } from "sonner"

interface ReviewModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
}

export default function ReviewModal({ appointment, isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    if (rating > 0) {
      toast.success(`Avaliação enviada! ${rating} estrelas para ${appointment?.provider.name}`)
      onClose()
      setRating(0)
      setComment("")
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar Atendimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 font-poppins">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold font-sans">{appointment.provider.name}</h3>
            <p className="text-sm text-gray-600">{appointment.service.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Como foi o atendimento?</label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && "Muito ruim"}
                {rating === 2 && "Ruim"}
                {rating === 3 && "Regular"}
                {rating === 4 && "Bom"}
                {rating === 5 && "Excelente"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comentário (opcional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              rows={4}
            />
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0} className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">
              Enviar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
