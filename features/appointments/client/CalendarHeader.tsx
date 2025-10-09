"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- IMPORTS dayjs ---
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br'; // Importar locale para formatação em português

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br'); // Usar o locale português
// ----------------------------------------------------------------

type ViewMode = "month" | "week" | "day"

interface CalendarHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDate: dayjs.Dayjs;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  navigateDate: (direction: "prev" | "next") => void;
  userTimeZone: string; // Adicionando userTimeZone para formatação precisa de "Hoje"
}

export default function CalendarHeader({ viewMode, setViewMode, currentDate, setCurrentDate, navigateDate, userTimeZone }: CalendarHeaderProps) {

  const formatDate = (): string => {
    if (viewMode === "month") {
      return currentDate.format("MMMM [de] YYYY");
    }
    if (viewMode === "week") {
      const startOfWeek = currentDate.startOf('week');
      const endOfWeek = currentDate.endOf('week');

      if (startOfWeek.month() === endOfWeek.month()) {
        return `${startOfWeek.date()} - ${endOfWeek.date()} de ${endOfWeek.format("MMMM [de] YYYY")}`;
      }
      return `${startOfWeek.format("DD/MMM")} - ${endOfWeek.format("DD/MMM [de] YYYY")}`;
    }
    return currentDate.format("dddd, DD [de] MMMM [de] YYYY");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex bg-muted rounded-lg p-1 font-poppins">
              <Button variant={viewMode === "month" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("month")} className="px-2 sm:px-3 text-xs sm:text-sm">Mês</Button>
              <Button variant={viewMode === "week" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("week")} className="px-2 sm:px-3 text-xs sm:text-sm">Semana</Button>
              <Button variant={viewMode === "day" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("day")} className="px-2 sm:px-3 text-xs sm:text-sm">Dia</Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full lg:w-auto justify-between lg:justify-center">
            <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}><ChevronLeft className="w-4 h-4" /></Button>
            <h2 className="text-sm sm:text-lg font-semibold min-w-[150px] sm:min-w-[200px] text-center capitalize">{formatDate()}</h2>
            <Button variant="outline" size="sm" onClick={() => navigateDate("next")}><ChevronRight className="w-4 h-4" /></Button>
          </div>
          {/* Botão Hoje: Define para o início do dia ATUAL no fuso horário do usuário */}
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(dayjs().tz(userTimeZone).startOf('day'))} className="text-xs sm:text-sm font-poppins">Hoje</Button>
        </div>
      </CardHeader>
    </Card>
  )
}