"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Appointment } from "@/types/Appointment" 

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br'; 

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

interface RescheduleModalProps {
    appointment: Appointment | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (appointmentId: string, newDate: string, newTime: string) => void;
    userTimeZone: string;
}

export default function RescheduleModal({ appointment, isOpen, onClose, onSubmit, userTimeZone }: RescheduleModalProps) {
    const [newDate, setNewDate] = useState(""); 
    const [newTime, setNewTime] = useState(""); 

    useEffect(() => {
        if (appointment && appointment.startTime) {
            const startTimeInUserTimeZone = dayjs.utc(appointment.startTime).tz(userTimeZone);
            setNewDate(startTimeInUserTimeZone.format('YYYY-MM-DD'));
            setNewTime(startTimeInUserTimeZone.format('HH:mm'));
        }
    }, [appointment, userTimeZone]); 

    if (!appointment) return null;

    const handleSubmit = () => {
        if (newDate && newTime) {
            onSubmit(appointment.id, newDate, newTime);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-4 sm:mx-auto">
                <DialogHeader>
                    <DialogTitle>Solicitar Alteração de Horário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground font-poppins">
                        Você está solicitando uma alteração para o serviço de{" "}
                        <span className="font-semibold text-foreground">{appointment.service.name}</span> com{" "} 
                        <span className="font-semibold text-foreground">{appointment.provider.name}</span>.
                    </p>
                    
                    <div className="space-y-2">
                        <Label htmlFor="newDate">Nova Data</Label>
                        <Input 
                            id="newDate"
                            type="date" 
                            value={newDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
                            min={dayjs().tz(userTimeZone).format('YYYY-MM-DD')} 
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
                    <p className="text-xs text-muted-foreground pt-2 font-poppins">
                        A alteração depende da aprovação do prestador de serviço.
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="font-poppins">Cancelar</Button>
                    <Button onClick={handleSubmit} className="bg-[#FC9056] hover:bg-[#ff8340] font-poppins">Enviar Solicitação</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}