// src/components/Modal/ConflictModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Calendar, Clock } from "lucide-react" // Adicione Clock para exibir horários

// --- NOVAS IMPORTAÇÕES NECESSÁRIAS PARA dayjs E FUSO HORÁRIO ---
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// ----------------------------------------------------------------

// É uma boa prática definir os tipos de dados que o componente espera
interface Appointment {
  id: string;
  date: string; // Formato "YYYY-MM-DD"
  time: string; // <-- Adicionado o campo time
  clientName: string;
}

// A interface de props agora inclui a propriedade 'appointments'
interface ConflictModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  appointments: Appointment[] 
  providerTimeZone: string; // <-- NOVA PROP
}

export function ConflictModal({ isOpen, onOpenChange, appointments, providerTimeZone }: ConflictModalProps) {
    // --- MUDANÇA: Exibe a data do primeiro agendamento (ou uma data de fallback) no fuso horário do provedor ---
    const displayDate = appointments.length > 0
        ? dayjs.utc(appointments[0].date).tz(providerTimeZone).format("dddd, D [de] MMMM [de] YYYY")
        : "Data Indefinida";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Não é possível bloquear este dia
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-3">
                            A data **{displayDate}** possui agendamentos confirmados e não pode ser bloqueada:
                        </p>
                        <div className="space-y-2">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        {/* --- MUDANÇA: Incluído o horário do agendamento --- */}
                                        <Calendar className="w-4 h-4 text-yellow-600" />
                                        <span className="font-medium text-yellow-800">{appointment.clientName}</span>
                                        {appointment.time && (
                                            <>
                                                <span className="text-xs text-yellow-700">às</span>
                                                <Clock className="w-3 h-3 text-yellow-600" />
                                                <span className="text-xs text-yellow-700 font-medium">{appointment.time}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <strong>Dica:</strong> Para bloquear este dia, você precisa primeiro cancelar ou reagendar todos os
                            agendamentos existentes.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button onClick={() => onOpenChange(false)} className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">
                            Entendi
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}