"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Calendar } from "lucide-react"

// É uma boa prática definir os tipos de dados que o componente espera
interface Appointment {
    id: string;
    date: string;
    clientName: string;
}

// A interface de props agora inclui a propriedade 'appointments'
interface ConflictModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    appointments: Appointment[] // Propriedade adicionada
}

export function ConflictModal({ isOpen, onOpenChange, appointments }: ConflictModalProps) {
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
                            Este dia possui agendamentos confirmados e não pode ser bloqueado:
                        </p>
                        <div className="space-y-2">
                            {/* O componente agora mapeia a propriedade 'appointments' recebida */}
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-yellow-600" />
                                        <span className="font-medium text-yellow-800">{appointment.clientName}</span>
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

