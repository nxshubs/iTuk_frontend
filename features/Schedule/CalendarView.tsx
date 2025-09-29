"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Ban, AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"

// --- Tipos de Dados ---
interface BlockedDay {
  id: string
  date: string // Formato "YYYY-MM-DD"
  reason?: string
}

interface Appointment {
  id: string;
  date: string; // Formato "YYYY-MM-DD"
  clientName: string;
}

// --- Props do Componente ---
interface CalendarViewProps {
  blockedDays: BlockedDay[]
  appointments: Appointment[]
  onDayClick: (date: Date) => void
  onUnblockDay: (id: string) => void
  unblockingId: string | null 
}

// --- Constantes ---
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

// --- Componente ---
export function CalendarView({
  blockedDays,
  appointments,
  onDayClick,
  onUnblockDay,
  unblockingId,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(1);
      newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1)
      return newDate
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button className="font-poppins bg-transparent" variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hoje
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm font-poppins text-gray-600 mt-2">
          Clique num dia livre para o bloquear, ou num dia bloqueado para o desbloquear.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b font-poppins">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="min-h-[110px] p-2 bg-muted/20 rounded-lg"></div>
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const dateStr = date.toISOString().split("T")[0]
            const dayAppointments = appointments.filter(apt => apt.date === dateStr);
            const blockedDayInfo = blockedDays.find(b => b.date === dateStr);
            const isBlocked = !!blockedDayInfo;
            const isUnblocking = unblockingId === blockedDayInfo?.id;
            const isToday = date.toDateString() === today.toDateString();

            const handleClick = () => {
              if (isBlocked && blockedDayInfo) {
                onUnblockDay(blockedDayInfo.id);
              } else {
                onDayClick(date);
              }
            };

            return (
              <div
                key={index}
                onClick={handleClick}
                className={`min-h-[110px] p-2 border rounded-lg transition-colors flex flex-col justify-between cursor-pointer ${isToday
                    ? "ring-2 ring-[#FC9056] bg-[#FC9056]/5"
                    : isBlocked
                      ? "bg-red-50 border-red-200"
                      : dayAppointments.length > 0
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-background hover:bg-muted/50"
                  }`}
              >
                <div>
                  <div className={`text-sm font-medium mb-2 ${isToday ? "text-[#FC9056] font-bold" : isBlocked ? "text-red-700" : "text-foreground"}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {isUnblocking ? (
                      <div className="flex items-center justify-center h-[50px]">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      </div>
                    ) : isBlocked ? (
                      <div className="flex items-center gap-1">
                        <Ban className="w-3 h-3 text-red-600" />
                        <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-poppins">Bloqueado</div>
                      </div>
                    ) : dayAppointments.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-yellow-600" />
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-poppins">
                          {dayAppointments.length} agend.
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 text-center py-2 font-poppins">Clique para bloquear</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}