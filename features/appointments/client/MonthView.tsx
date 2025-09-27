"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Appointment } from "@/types/Appointment"

interface MonthViewProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  setViewMode: (mode: "month" | "week" | "day") => void;
  getAppointmentsForDate: (date: Date) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
}

export default function MonthView({ currentDate, setCurrentDate, setViewMode, getAppointmentsForDate, onViewDetails }: MonthViewProps) {
  
  const getMonthDays = (): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const handleMonthDayClick = (date: Date): void => {
    setCurrentDate(date);
    setViewMode("day");
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (<div key={day} className="p-1 text-center font-medium text-muted-foreground text-xs">{day}</div>))}
          {getMonthDays().map((date) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={date.toISOString()} className={`min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-muted/80 ${isCurrentMonth ? "bg-background" : "bg-muted/50"} ${isToday ? "ring-2 ring-primary" : ""}`} onClick={() => handleMonthDayClick(date)}>
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>{date.getDate()}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} onClick={(e) => { e.stopPropagation(); onViewDetails(apt); }} className={`text-xs p-1 rounded truncate ${apt.status === "upcoming" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                      {apt.service}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && <div className="text-xs text-muted-foreground text-center">+{dayAppointments.length - 2} mais</div>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}