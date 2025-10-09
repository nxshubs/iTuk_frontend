"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Appointment } from "@/types/Appointment"

// --- IMPORTS dayjs ---
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// ----------------------------------------------------------------

interface MonthViewProps {
  currentDate: dayjs.Dayjs;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  setViewMode: (mode: "month" | "week" | "day") => void;
  getAppointmentsForDate: (date: dayjs.Dayjs) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  userTimeZone: string; // Nova prop
}

export default function MonthView({ currentDate, setCurrentDate, setViewMode, getAppointmentsForDate, onViewDetails, userTimeZone }: MonthViewProps) {

  const getMonthDays = (): dayjs.Dayjs[] => {
    const startOfMonth = currentDate.startOf('month');
    const startOfCalendar = startOfMonth.startOf('week');

    const days: dayjs.Dayjs[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(startOfCalendar.add(i, 'day'));
    }
    return days;
  };

  const handleMonthDayClick = (date: dayjs.Dayjs): void => {
    setCurrentDate(date);
    setViewMode("day");
  };

  // Função para obter a cor do status da badge
  const getAppointmentBadgeColor = (status: Appointment['status']) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED":
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (<div key={day} className="p-1 text-center font-medium text-muted-foreground text-xs">{day}</div>))}
          {getMonthDays().map((date) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isCurrentMonth = date.month() === currentDate.month();
            const isToday = date.isSame(dayjs().tz(userTimeZone), 'day');

            return (
              <div key={date.toISOString()} className={`min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-muted/80 ${isCurrentMonth ? "bg-background" : "bg-muted/50"} ${isToday ? "ring-2 ring-[#FC9056]" : ""}`} onClick={() => handleMonthDayClick(date)}>
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}>{date.date()}</div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} onClick={(e) => { e.stopPropagation(); onViewDetails(apt); }} className={`text-xs p-1 rounded truncate ${getAppointmentBadgeColor(apt.status)}`}>
                      {/* Exibindo a hora convertida e o nome do serviço */}
                      {apt.startTime ? dayjs.utc(apt.startTime).tz(userTimeZone).format('HH:mm') : ''} - {apt.service.name}
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