"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Appointment } from "@/types/Appointment";
import { Review } from "@/types/Review";


interface AppointmentWithReview extends Appointment {
    review?: Review | null;
}

interface ReviewModalProps {
  appointment: AppointmentWithReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (ratingValue: number, comment: string) => Promise<void>;
}

export default function ReviewModal({ appointment, isOpen, onClose, onSubmitReview }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
    }
  }, [isOpen]);

  const handleRatingClick = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }

    if (!appointment?.id) {
        toast.error("Erro: Agendamento inválido para avaliação.");
        return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReview(rating, comment);
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Avaliar {appointment.provider.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-center text-muted-foreground">
            Sua opinião é importante! Avalie o atendimento referente ao serviço "{appointment.service.name}".
          </p>

          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`cursor-pointer ${i < rating ? 'text-[#FC9056] fill-[#FC9056]' : 'text-gray-300 dark:text-gray-600'}`}
                size={32}
                onClick={() => handleRatingClick(i)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Deixe um comentário opcional sobre o atendimento..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className="text-right text-sm text-muted-foreground">{comment.length}/500</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}