"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Provider } from "@/types/Provider"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface BookingModalProps {
    provider: Provider | null
    isOpen: boolean
    onClose: () => void
    onBookingSuccess?: () => void
}

export default function BookingModal({ provider, isOpen, onClose, onBookingSuccess }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>(""); // Estado volta a ser string
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [timeError, setTimeError] = useState<string | null>(null);

    const [isBooking, setIsBooking] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            if (!selectedDate || !provider || !selectedServiceId) return;

            setIsLoadingTimes(true);
            setTimeError(null);
            setAvailableTimes([]);
            setSelectedTime("");

            const token = Cookies.get('authToken');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${provider.id}/availability?date=${selectedDate}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Não foi possível buscar os horários.");
                }

                const data = await response.json();
                setAvailableTimes(data);

                if (data.length === 0) {
                    setTimeError("Nenhum horário livre para esta data.");
                }
            } catch (error: any) {
                setTimeError(error.message);
            } finally {
                setIsLoadingTimes(false);
            }
        };

        fetchAvailableTimes();
    }, [selectedDate, selectedServiceId, provider]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !provider || !selectedServiceId) return;

        setIsBooking(true);
        setBookingError(null);
        const token = Cookies.get('authToken');
        
        // A data já é uma string 'YYYY-MM-DD', então a conversão é direta
        const startTime = new Date(`${selectedDate}T${selectedTime}:00.000Z`).toISOString();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/client`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceId: selectedServiceId,
                    startTime: startTime,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao criar agendamento.");
            }
            
            toast.success("Agendamento solicitado com sucesso!");
            if (onBookingSuccess) onBookingSuccess();
            handleClose();

        } catch (error: any) {
            setBookingError(error.message);
            toast.error(error.message);
        } finally {
            setIsBooking(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setSelectedDate("");
            setSelectedTime("");
            setSelectedServiceId("");
            setAvailableTimes([]);
            setTimeError(null);
            setBookingError(null);
        }, 300);
    }

    if (!provider) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Agendar com {provider.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="font-poppins space-y-2">
                        <Label>Qual serviço você deseja?</Label>
                        <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                            <SelectTrigger><SelectValue placeholder="Selecione o serviço" /></SelectTrigger>
                            <SelectContent>
                                {provider.services?.map(service => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name} - R$ {service.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 👇 VOLTAMOS A USAR O INPUT TYPE="DATE" 👇 */}
                    <div className="font-poppins space-y-2">
                        <Label><CalendarIcon className="w-4 h-4 inline mr-1" /> Selecione a data</Label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]} // Impede selecionar datas passadas
                            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                            disabled={!selectedServiceId} // Desabilita até que um serviço seja escolhido
                        />
                    </div>

                    <div className="font-poppins space-y-2">
                        <Label><Clock className="w-4 h-4 inline mr-1" /> Horários disponíveis</Label>
                        {isLoadingTimes && <div className="text-center p-4 text-sm text-muted-foreground">Buscando horários... <Loader2 className="inline w-4 h-4 animate-spin" /></div>}
                        {timeError && <div className="text-center p-4 text-sm text-red-500">{timeError}</div>}
                        {!isLoadingTimes && !timeError && availableTimes.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {availableTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`p-2 text-sm rounded-md border transition-colors ${selectedTime === time ? "bg-[#FC9056] text-white border-[#FC9056]" : "bg-background text-foreground hover:bg-muted"}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                            {!isLoadingTimes && !timeError && availableTimes.length === 0 && selectedDate && (
                            <div className="text-center p-4 text-sm text-muted-foreground">Nenhum horário encontrado.</div>
                            )}
                    </div>

                    <Button
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedTime || !selectedServiceId || isBooking}
                        className="w-full bg-[#FC9056] hover:bg-[#ff8340]"
                    >
                        {isBooking ? <Loader2 className="animate-spin mx-auto" /> : "Solicitar Agendamento"}
                    </Button>

                    {bookingError && <p className="text-sm text-center text-red-500">{bookingError}</p>}
                </div>
            </DialogContent>
        </Dialog>
    )
}