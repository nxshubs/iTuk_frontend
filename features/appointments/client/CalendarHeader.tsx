"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ViewMode = "month" | "week" | "day"

interface CalendarHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  navigateDate: (direction: "prev" | "next") => void;
}

export default function CalendarHeader({ viewMode, setViewMode, currentDate, setCurrentDate, navigateDate }: CalendarHeaderProps) {
  
  const formatDate = (): string => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    }
    if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${endOfWeek.toLocaleDateString("pt-BR", { month: 'long', year: 'numeric' })}`;
      }
      return `${startOfWeek.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })} - ${endOfWeek.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
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
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())} className="text-xs sm:text-sm font-poppins">Hoje</Button>
        </div>
      </CardHeader>
    </Card>
  )
}