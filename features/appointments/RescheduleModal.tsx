"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Appointment } from "@/types/Appointment" // Supondo que você moveu a interface para um arquivo de tipos

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentId: string, newDate: string, newTime: string) => void;
}

export default function RescheduleModal({ appointment, isOpen, onClose, onSubmit }: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (appointment) {
      setNewDate(appointment.date);
      setNewTime(appointment.time);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSubmit = () => {
    if (newDate && newTime) {
      onSubmit(appointment.id, newDate, newTime);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar Alteração de Horário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Você está solicitando uma alteração para o serviço de{" "}
            <span className="font-semibold text-foreground">{appointment.service}</span> com{" "}
            <span className="font-semibold text-foreground">{appointment.providerName}</span>.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="newDate">Nova Data</Label>
            <Input 
              id="newDate"
              type="date" 
              value={newDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newTime">Novo Horário</Label>
            <Input 
              id="newTime"
              type="time" 
              value={newTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTime(e.target.value)}
            />
          </div>
            <p className="text-xs text-muted-foreground pt-2">
            A alteração depende da aprovação do prestador de serviço.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} className="bg-[#FC9056] hover:bg-[#ff8340]">Enviar Solicitação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}