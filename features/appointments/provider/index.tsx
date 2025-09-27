"use client"

import AppointmentDetailsModal from "../AppointmentDetailsModal"
import CreateAppointmentModal from "@/features/appointments/provider/CreateAppointmentModal"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, Clock } from "lucide-react" // Ícone importado
import Cookies from 'js-cookie'
import Link from "next/link" // Importe o Link para o botão de ação

import type { Appointment } from "@/types/Appointment"
import { ViewSwitchButtons } from "./ViewSwitchButtons"
import { MonthView } from "./MonthView"
import { WeekView } from "./WeekView"
import { DayView } from "./DayView"
import { BlockDaysSkeleton } from "@/components/skeletons/BlockDaysSkeleton"

interface WeeklySchedule {
  [key: number]: { start: string; end: string }[];
}

interface props {
  appliedStatusFilters: {
    upcoming: boolean;
    completed: boolean;
    cancelled: boolean;
  };
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  handleAppointmentCreated: (newAppointment: Appointment) => void;
}

export default function ProviderCalendar({
  appointments,
  filteredAppointments,
  handleAppointmentCreated,
}: props) {

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Adicionado: um estado para verificar se existem horários de trabalho
  const [hasWorkingHours, setHasWorkingHours] = useState(false);

  const [selectedDateForCreate, setSelectedDateForCreate] = useState<Date | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedTimeForCreate, setSelectedTimeForCreate] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const weekDaysFull = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      const token = Cookies.get('authToken');
      if (!token) {
        setApiError("Sessão inválida.");
        setIsLoading(false);
        return;
      }
      try {
        const availabilityRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!availabilityRes.ok) throw new Error("Falha ao buscar horários de trabalho.");

        const availabilityData = await availabilityRes.json();

        // 👇 ALTERAÇÃO: Verifica se retornou algum dado
        if (availabilityData && availabilityData.length > 0) {
          setHasWorkingHours(true);
          const schedule: WeeklySchedule = {};
          availabilityData.forEach((avail: any) => {
            if (!schedule[avail.dayOfWeek]) schedule[avail.dayOfWeek] = [];
            schedule[avail.dayOfWeek].push({ start: avail.startTime, end: avail.endTime });
          });
          setWeeklySchedule(schedule);
        } else {
          setHasWorkingHours(false); // Se não retornou, define como false
        }
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (viewMode === 'day' && !selectedDay) {
      setSelectedDay(new Date());
    }
  }, [viewMode, selectedDay]);

  // ... (todas as suas outras funções continuam aqui, sem alterações)
  const getWorkingHoursForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const daySchedule = weeklySchedule[dayOfWeek] || []
    if (daySchedule.length === 0) return []
    const workingHours = []
    for (const schedule of daySchedule) {
      const startHour = Number.parseInt(schedule.start.split(":")[0])
      const endHour = Number.parseInt(schedule.end.split(":")[0])
      for (let hour = startHour; hour < endHour; hour++) {
        workingHours.push(`${hour.toString().padStart(2, "0")}:00`)
      }
    }
    return workingHours
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredAppointments.filter((apt) => apt.date === dateStr)
  }

  const getAppointmentForHour = (date: Date, hour: string) => {
    const dayAppointments = getAppointmentsForDate(date)
    return dayAppointments.find((apt) => {
      const startHour = Number.parseInt(apt.time.split(":")[0])
      const endHour = Number.parseInt(apt.endTime.split(":")[0])
      const currentHour = Number.parseInt(hour.split(":")[0])
      return currentHour >= startHour && currentHour < endHour
    })
  }

  const isFirstHourOfAppointment = (date: Date, hour: string, appointment: any) => {
    if (!appointment) return false
    const startHour = Number.parseInt(appointment.time.split(":")[0])
    const currentHour = Number.parseInt(hour.split(":")[0])
    return currentHour === startHour
  }

  const getAppointmentDuration = (appointment: any) => {
    if (!appointment) return 1
    const startHour = Number.parseInt(appointment.time.split(":")[0])
    const endHour = Number.parseInt(appointment.endTime.split(":")[0])
    return endHour - startHour
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

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    const weekDays: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1)
      return newDate
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedWeek((prev) => {
      if (!prev) return null
      const newDate = new Date(prev)
      newDate.setDate(direction === "prev" ? prev.getDate() - 7 : prev.getDate() + 7)
      return newDate
    })
  }

  const navigateDay = (direction: "prev" | "next") => {
    setSelectedDay((prev) => {
      if (!prev) return null
      const newDate = new Date(prev)
      newDate.setDate(direction === "prev" ? prev.getDate() - 1 : prev.getDate() + 1)
      return newDate
    })
  }

  const handleDayClick = (day: number) => {
    if (!day) return
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDay(newDate)
    setViewMode("day")
  }

  const handleWeekDayClick = (date: Date) => {
    setSelectedDay(date)
    setViewMode("day")
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCreateAppointment = (date: Date, time: string) => {
    setSelectedDateForCreate(date)
    setSelectedTimeForCreate(time)
    setIsCreateModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-500 border-blue-600 text-white"
      case "completed": return "bg-green-500 border-green-600 text-white"
      case "cancelled": return "bg-red-500 border-red-600 text-white"
      default: return "bg-gray-500 border-gray-600 text-white"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })
  }

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDate.getDate()} - ${endDate.getDate()} de ${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`
    } else {
      return `${startDate.getDate()} de ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} de ${monthNames[endDate.getMonth()]} ${startDate.getFullYear()}`
    }
  }

  const days = getDaysInMonth(currentDate)
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isTodayDate = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const handleNavigation = (direction: "prev" | "next") => {
    if (viewMode === "month") navigateMonth(direction)
    else if (viewMode === "week") navigateWeek(direction)
    else navigateDay(direction)
  }

  const handleTodayClick = () => {
    const today = new Date()
    if (viewMode === "month") setCurrentDate(today)
    else if (viewMode === "week") setSelectedWeek(today)
    else setSelectedDay(today)
  }

  if (isLoading) {
    return <BlockDaysSkeleton />;
  }

  if (apiError) {
    return <div className="text-red-500 p-4">Erro ao carregar calendário: {apiError}</div>;
  }

  return (
    <>
      <ViewSwitchButtons handleTodayClick={handleTodayClick} setViewMode={setViewMode} viewMode={viewMode} />

      {!hasWorkingHours ? (
        <Card className="mt-4">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
            <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum horário de trabalho definido</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Para usar o calendário de agendamentos, primeiro você precisa definir seus horários de trabalho semanais.
            </p>
            <Button asChild className="mt-6 bg-[#FC9056] hover:bg-[#ff8340]">
              <Link href="/dashboard/provider">
                <Clock className="mr-2 h-4 w-4" />
                Definir Horários
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">
                  {viewMode === "month" ? (
                    <>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</>
                  ) : viewMode === "week" ? (
                    selectedWeek && (<span>{formatWeekRange(getWeekDays(selectedWeek)[0])}</span>)
                  ) : (
                    selectedDay && <span>{formatDate(selectedDay)}</span>
                  )}
                </span>
              </CardTitle>
              <div className="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" onClick={() => handleNavigation("prev")}>
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleTodayClick} className="text-xs sm:text-sm bg-transparent font-poppins">
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleNavigation("next")}>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-1 sm:p-2 lg:p-6">
            {viewMode === "month" ? (
              <MonthView currentDate={currentDate} days={days} getAppointmentsForDate={getAppointmentsForDate} getStatusColor={getStatusColor} handleAppointmentClick={handleAppointmentClick} handleDayClick={handleDayClick} isToday={isToday} weekDays={weekDays} />
            ) : viewMode === "week" ? (
              selectedWeek && (
                <WeekView getAppointmentDuration={getAppointmentDuration} getAppointmentForHour={getAppointmentForHour} getAppointmentsForDate={getAppointmentsForDate} getStatusColor={getStatusColor} getWeekDays={getWeekDays} getWorkingHoursForDate={getWorkingHoursForDate} handleAppointmentClick={handleAppointmentClick} handleCreateAppointment={handleCreateAppointment} handleWeekDayClick={handleWeekDayClick} isFirstHourOfAppointment={isFirstHourOfAppointment} isTodayDate={isTodayDate} monthNames={monthNames} selectedWeek={selectedWeek} weekDays={weekDays} weekDaysFull={weekDaysFull} />
              )
            ) : (
              selectedDay && (
                <DayView getAppointmentForHour={getAppointmentForHour} getStatusColor={getStatusColor} getWorkingHoursForDate={getWorkingHoursForDate} handleAppointmentClick={handleAppointmentClick} handleCreateAppointment={handleCreateAppointment} isTodayDate={isTodayDate} selectedDay={selectedDay} getAppointmentsForDate={getAppointmentsForDate} />
              )
            )}
          </CardContent>
        </Card>
      )}

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType="PROVIDER"
      />
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        selectedDate={selectedDateForCreate}
        selectedTime={selectedTimeForCreate}
        onCreateAppointment={handleAppointmentCreated}
      />
    </>
  )
}