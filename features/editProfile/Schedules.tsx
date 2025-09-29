"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Availability } from "@/types/Availability";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SchedulesProps {
  availability: Availability[];
}

const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function Schedules({ availability }: SchedulesProps) {
  const router = useRouter();
  const sortedAvailability = [...availability].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horário de Funcionamento
          </div>
          <Button onClick={() => router.push("/dashboard/provider")} size="sm" variant="outline">
            Gerenciar Horários
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAvailability.length > 0 ? (
          sortedAvailability.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <div className="font-medium w-28">
                {dayNames[slot.dayOfWeek]}
              </div>
              <div className="flex-grow text-center text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded-md">{slot.startTime}</span>
                <span className="mx-2">-</span>
                <span className="font-mono bg-muted px-2 py-1 rounded-md">{slot.endTime}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum horário de funcionamento adicionado.
          </p>
        )}
      </CardContent>
    </Card>
  )
}