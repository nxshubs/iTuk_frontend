// src/components/CalendarView.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Ban, AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"

// --- NOVAS IMPORTAÇÕES NECESSÁRIAS PARA dayjs E FUSO HORÁRIO ---
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configurar dayjs com os plugins de UTC e fuso horário
dayjs.extend(utc);
dayjs.extend(timezone);
// ----------------------------------------------------------------

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
  providerTimeZone: string; // <-- NOVA PROP
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
  providerTimeZone, // <-- RECEBENDO A NOVA PROP
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(dayjs().tz(providerTimeZone).toDate()) // <-- MUDANÇA: Inicializa com dayjs no fuso horário do provedor

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      // Cria uma nova instância de dayjs no fuso horário do provedor para manipulação
      const prevDayjs = dayjs(prev).tz(providerTimeZone);
      const newDayjs = direction === "prev" ? prevDayjs.subtract(1, 'month') : prevDayjs.add(1, 'month');
      return newDayjs.toDate(); // Retorna o objeto Date
    })
  }

  const getDaysInMonth = (date: Date) => {
    // Usa dayjs para manipular a data, garantindo que o fuso horário seja respeitado
    const dayjsDate = dayjs(date).tz(providerTimeZone);
    const year = dayjsDate.year();
    const month = dayjsDate.month(); // month() é zero-indexado em dayjs e Date
    
    // Obtém o primeiro e último dia do mês no fuso horário do provedor
    const firstDay = dayjsDate.startOf('month');
    const lastDay = dayjsDate.endOf('month');

    const daysInMonth = lastDay.date(); // dia do mês (ex: 31)
    const startingDayOfWeek = firstDay.day(); // dia da semana (0 para domingo, 1 para segunda, etc.)

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
  // --- MUDANÇA: 'today' também deve ser no fuso horário do provedor para comparações consistentes ---
  const todayDayjs = dayjs().tz(providerTimeZone); 

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
            <Button 
              className="font-poppins bg-transparent" 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(dayjs().tz(providerTimeZone).toDate())} // <-- MUDANÇA: Volta para a data de hoje no fuso horário do provedor
            >
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

            // --- MUDANÇA: Cria a data do dia usando dayjs no fuso horário do provedor ---
            const dateDayjs = dayjs().tz(providerTimeZone).year(currentDate.getFullYear()).month(currentDate.getMonth()).date(day);
            const date = dateDayjs.toDate(); // Retorna para Date object se onDayClick esperar Date
            const dateStr = dateDayjs.format("YYYY-MM-DD"); // Formato de string para comparação

            const dayAppointments = appointments.filter(apt => apt.date === dateStr);
            const blockedDayInfo = blockedDays.find(b => b.date === dateStr);
            const isBlocked = !!blockedDayInfo;
            const isUnblocking = unblockingId === blockedDayInfo?.id;
            // --- MUDANÇA: Comparações de 'hoje' usando dayjs ---
            const isToday = dateDayjs.isSame(todayDayjs, 'day'); 

            const handleClick = () => {
              if (isBlocked && blockedDayInfo) {
                onUnblockDay(blockedDayInfo.id);
              } else {
                onDayClick(date); // onDayClick ainda espera um objeto Date
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