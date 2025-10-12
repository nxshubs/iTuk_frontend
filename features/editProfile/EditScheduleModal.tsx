// features/editProfile/EditScheduleModal.tsx (Refatorado com Horários em Horas Cheias)
"use client"

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Availability } from "@/types/Availability";

interface LocalScheduleDay {
    id?: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

interface EditScheduleModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    currentAvailability: Availability[];
    onSave: (newAvailability: Availability[]) => void;
    isSaving: boolean;
}

const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

// FUNÇÃO ATUALIZADA para gerar opções de horário apenas em horas cheias
function generateTimeOptions(): string[] {
    const times: string[] = [];
    for (let h = 0; h < 24; h++) {
        const hour = h.toString().padStart(2, '0');
        const minute = '00'; // Minutos fixos em 00
        times.push(`${hour}:${minute}`);
    }
    return times;
}

export default function EditScheduleModal({
    isOpen,
    onOpenChange,
    currentAvailability,
    onSave,
    isSaving,
}: EditScheduleModalProps) {
    const [localSchedule, setLocalSchedule] = useState<LocalScheduleDay[]>([]);

    // Gerar as opções de horário uma única vez e memorizá-las
    const timeOptions = useMemo(() => generateTimeOptions(), []); // Sem argumento de intervalo agora

    useEffect(() => {
        const initialSchedule: LocalScheduleDay[] = dayNames.map((_, index) => {
            const existingSlot = currentAvailability.find(slot => slot.dayOfWeek === index);
            return {
                id: existingSlot?.id,
                dayOfWeek: index,
                startTime: existingSlot?.startTime || "09:00",
                endTime: existingSlot?.endTime || "18:00",
                isActive: !!existingSlot,
            };
        });
        setLocalSchedule(initialSchedule);
    }, [currentAvailability]);

    const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
        setLocalSchedule(prev => prev.map(day =>
            day.dayOfWeek === dayOfWeek
                ? { ...day, [field]: value }
                : day
        ));
    };

    const handleToggleDay = (dayOfWeek: number, checked: boolean) => {
        setLocalSchedule(prev => prev.map(day =>
            day.dayOfWeek === dayOfWeek
                ? { ...day, isActive: checked }
                : day
        ));
    };

    const handleSubmit = () => {
        const newAvailability: Availability[] = localSchedule
            .filter(day => day.isActive)
            .map(day => ({
                id: day.id || `new-${Date.now()}-${Math.random()}`,
                dayOfWeek: day.dayOfWeek,
                startTime: day.startTime,
                endTime: day.endTime,
            }));
        onSave(newAvailability);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gerenciar Horários de Funcionamento</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {localSchedule.map((day) => (
                        <div key={day.dayOfWeek} className="flex items-center gap-4 p-3 border rounded-lg bg-secondary/20">
                            <div className="flex-1 font-semibold text-lg">{dayNames[day.dayOfWeek]}</div>
                            <div className="flex items-center gap-2">
                                {/* Select para Start Time */}
                                <Select
                                    value={day.startTime}
                                    onValueChange={(value) => handleTimeChange(day.dayOfWeek, 'startTime', value)}
                                    disabled={!day.isActive || isSaving}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Início" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map(time => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <span className="text-muted-foreground">-</span>

                                {/* Select para End Time */}
                                <Select
                                    value={day.endTime}
                                    onValueChange={(value) => handleTimeChange(day.dayOfWeek, 'endTime', value)}
                                    disabled={!day.isActive || isSaving}
                                >
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="Fim" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map(time => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Switch
                                checked={day.isActive}
                                onCheckedChange={(checked) => handleToggleDay(day.dayOfWeek, checked)}
                                disabled={isSaving}
                                aria-label={`Ativar/Desativar ${dayNames[day.dayOfWeek]}`}
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving} className="bg-[#FC9056] hover:bg-[#FC9056]/90">
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                        ) : (
                            "Salvar Horários"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}