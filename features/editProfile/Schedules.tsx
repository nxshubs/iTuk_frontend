// features/editProfile/Schedules.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Pencil } from "lucide-react"; // Adicionado Pencil icon
import { Availability } from "@/types/Availability";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Importar useState para o modal
import EditScheduleModal from "./EditScheduleModal"; // Importar o novo modal

interface SchedulesProps {
    availability: Availability[];
    onSaveAvailability: (newAvailability: Availability[]) => Promise<void>; // Novo prop para salvar
}

const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function Schedules({ availability, onSaveAvailability }: SchedulesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Estado para o loading do salvamento

    const sortedAvailability = [...availability].sort((a, b) => {
        // Primeiro por dayOfWeek
        if (a.dayOfWeek !== b.dayOfWeek) {
            return a.dayOfWeek - b.dayOfWeek;
        }
        // Depois por startTime
        return a.startTime.localeCompare(b.startTime);
    });

    const handleModalSave = async (newAvailability: Availability[]) => {
        setIsSaving(true);
        try {
            await onSaveAvailability(newAvailability);
            setIsModalOpen(false); // Fechar modal após salvar
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Horário de Funcionamento
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} size="sm" variant="outline">
                        <Pencil className="w-4 h-4 mr-2" /> Editar Horários
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {sortedAvailability.length > 0 ? (
                    dayNames.map((dayName, dayIndex) => {
                        const dailySlots = sortedAvailability.filter(slot => slot.dayOfWeek === dayIndex);
                        return (
                            <div key={dayIndex} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 border rounded-lg">
                                <div className="font-medium min-w-[100px]">{dayName}</div>
                                <div className="flex-grow flex flex-wrap gap-2 justify-center sm:justify-end text-muted-foreground">
                                    {dailySlots.length > 0 ? (
                                        dailySlots.map((slot, index) => (
                                            <span key={index} className="font-mono bg-muted px-2 py-1 rounded-md text-sm">
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm italic">Fechado</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum horário de funcionamento adicionado.
                        <Button variant="link" size="sm" onClick={() => setIsModalOpen(true)} className="p-0 h-auto ml-1 text-primary">
                            Clique para adicionar.
                        </Button>
                    </p>
                )}
            </CardContent>

            <EditScheduleModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                currentAvailability={availability}
                onSave={handleModalSave}
                isSaving={isSaving}
            />
        </Card>
    )
}