// src/features/appointments/provider/index.tsx
"use client"

import AppointmentDetailsModal from "../AppointmentDetailsModal"
import CreateAppointmentModal from "@/features/appointments/provider/CreateAppointmentModal"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, Clock } from "lucide-react"
import Cookies from 'js-cookie'
import Link from "next/link"

import type { Appointment } from "@/types/Appointment"
import { ViewSwitchButtons } from "./ViewSwitchButtons"
import { MonthView } from "./MonthView"
import { WeekView } from "./WeekView"
import { DayView } from "./DayView"
import { BlockDaysSkeleton } from "@/components/skeletons/BlockDaysSkeleton"

// --- NOVAS IMPORTAÇÕES NECESSÁRIAS PARA dayjs E FUSO HORÁRIO ---
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// ----------------------------------------------------------------

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
  handleAppointmentCreated: (newAppointment: Appointment) => void;
  providerTimeZone: string;
}

export default function ProviderCalendar({
  appointments,
  handleAppointmentCreated,
  providerTimeZone, // <-- RECEBENDO A NOVA PROP
}: props) {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasWorkingHours, setHasWorkingHours] = useState(false);

  const [selectedDateForCreate, setSelectedDateForCreate] = useState<Date | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedTimeForCreate, setSelectedTimeForCreate] = useState<string | null>(null)
  // --- MUDANÇA: Inicializa com dayjs no fuso horário do provedor ---
  const [currentDate, setCurrentDate] = useState(dayjs().tz(providerTimeZone).toDate()) 
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  // --- MUDANÇA: Inicializa com dayjs no fuso horário do provedor ---
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(dayjs().tz(providerTimeZone).toDate()) 
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

        if (availabilityData && availabilityData.length > 0) {
          setHasWorkingHours(true);
          const schedule: WeeklySchedule = {};
          availabilityData.forEach((avail: any) => {
            if (!schedule[avail.dayOfWeek]) schedule[avail.dayOfWeek] = [];
            schedule[avail.dayOfWeek].push({ start: avail.startTime, end: avail.endTime });
          });
          setWeeklySchedule(schedule);
        } else {
          setHasWorkingHours(false);
        }
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (providerTimeZone) { // Só busca a disponibilidade se o fuso horário estiver definido
      fetchAvailability();
    }
  }, [providerTimeZone]); // <-- Dependência adicionada: providerTimeZone

  useEffect(() => {
    if (viewMode === 'day' && !selectedDay) {
      setSelectedDay(dayjs().tz(providerTimeZone).toDate()); // <-- MUDANÇA
    }
  }, [viewMode, selectedDay, providerTimeZone]); // <-- Dependência adicionada

  const getWorkingHoursForDate = (date: Date) => {
    // --- MUDANÇA: Usar dayjs para obter o dia da semana no fuso horário do provedor ---
    const dayOfWeek = dayjs(date).tz(providerTimeZone).day(); 
    const daySchedule = weeklySchedule[dayOfWeek] || [];
    if (daySchedule.length === 0) return [];

    const workingHours: string[] = [];
    for (const schedule of daySchedule) {
      // Horários de início e fim já devem estar no formato HH:mm, então não precisam de tz() aqui
      const startHour = parseInt(schedule.start.split(":")[0]);
      const endHour = parseInt(schedule.end.split(":")[0]);
      for (let hour = startHour; hour < endHour; hour++) {
        workingHours.push(`${String(hour).padStart(2, "0")}:00`);
      }
    }
    return workingHours;
  }

  const getAppointmentsForDate = (date: Date) => {
    // --- MUDANÇA: Formata a data para comparação usando dayjs no fuso horário do provedor ---
    const dateStr = dayjs(date).tz(providerTimeZone).format('YYYY-MM-DD');
    return appointments.filter((apt) => apt && apt.date === dateStr);
  }

  const getAppointmentForHour = (date: Date, hour: string) => {
    const dayAppointments = getAppointmentsForDate(date);
    return dayAppointments.find((apt) => {
      // `apt.startTime` já está no fuso horário do provedor após o fetch em ProviderAppointments
      const aptStartDayjs = dayjs.utc(apt.startTime).tz(providerTimeZone);
      const aptEndDayjs = dayjs.utc(apt.endTime).tz(providerTimeZone);
      
      const currentHour = parseInt(hour.split(":")[0]);
      
      // Verifica se a hora atual está dentro do agendamento
      return dayjs(date).tz(providerTimeZone).hour(currentHour).isSame(aptStartDayjs, 'hour') || 
             (dayjs(date).tz(providerTimeZone).hour(currentHour).isAfter(aptStartDayjs, 'hour') && 
              dayjs(date).tz(providerTimeZone).hour(currentHour).isBefore(aptEndDayjs, 'hour'));
    });
  }

  const isFirstHourOfAppointment = (date: Date, hour: string, appointment: Appointment | undefined) => {
    if (!appointment || !appointment.startTime) return false;
    // `appointment.startTime` já está no fuso horário do provedor
    const aptStartHour = dayjs.utc(appointment.startTime).tz(providerTimeZone).hour();
    const currentHour = parseInt(hour.split(":")[0]);
    return currentHour === aptStartHour;
  }

  const getAppointmentDuration = (appointment: Appointment | undefined) => {
    if (!appointment || !appointment.startTime || !appointment.endTime) return 1;
    // `appointment.startTime` e `appointment.endTime` já estão no fuso horário do provedor
    const startDayjs = dayjs.utc(appointment.startTime).tz(providerTimeZone);
    const endDayjs = dayjs.utc(appointment.endTime).tz(providerTimeZone);
    const duration = endDayjs.diff(startDayjs, 'hour'); // Diferença em horas
    return duration > 0 ? duration : 1;
  }

  const getDaysInMonth = (date: Date) => {
    // --- MUDANÇA: Usar dayjs para calcular os dias no fuso horário do provedor ---
    const dayjsDate = dayjs(date).tz(providerTimeZone);
    const firstDay = dayjsDate.startOf('month');
    const lastDay = dayjsDate.endOf('month');
    const daysInMonth = lastDay.date();
    const startingDayOfWeek = firstDay.day(); // 0 para domingo, 1 para segunda...

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
    // --- MUDANÇA: Usar dayjs para calcular os dias da semana no fuso horário do provedor ---
    const startOfWeek = dayjs(date).tz(providerTimeZone).startOf('week'); // startOf('week') considera domingo como o primeiro dia por padrão
    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(startOfWeek.add(i, 'day').toDate());
    }
    return weekDays;
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      // --- MUDANÇA: Navega usando dayjs no fuso horário do provedor ---
      const newDayjs = dayjs(prev).tz(providerTimeZone);
      const updatedDayjs = direction === "prev" ? newDayjs.subtract(1, 'month') : newDayjs.add(1, 'month');
      return updatedDayjs.toDate();
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setSelectedWeek((prev) => {
      if (!prev) return null
      // --- MUDANÇA: Navega usando dayjs no fuso horário do provedor ---
      const newDayjs = dayjs(prev).tz(providerTimeZone);
      const updatedDayjs = direction === "prev" ? newDayjs.subtract(7, 'day') : newDayjs.add(7, 'day');
      return updatedDayjs.toDate();
    })
  }

  const navigateDay = (direction: "prev" | "next") => {
    setSelectedDay((prev) => {
      if (!prev) return null
      // --- MUDANÇA: Navega usando dayjs no fuso horário do provedor ---
      const newDayjs = dayjs(prev).tz(providerTimeZone);
      const updatedDayjs = direction === "prev" ? newDayjs.subtract(1, 'day') : newDayjs.add(1, 'day');
      return updatedDayjs.toDate();
    })
  }

  const handleDayClick = (day: number) => {
    if (!day) return
    // --- MUDANÇA: Cria a nova data usando dayjs no fuso horário do provedor ---
    const newDate = dayjs().tz(providerTimeZone).year(currentDate.getFullYear()).month(currentDate.getMonth()).date(day).toDate();
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
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "PENDING":
        return "bg-blue-500 border-blue-600 text-white"
      case "COMPLETED":
        return "bg-green-500 border-green-600 text-white"
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-500 border-red-600 text-white"
      default:
        return "bg-gray-500 border-gray-600 text-white"
    }
  }

  const formatDate = (date: Date) => {
    // --- MUDANÇA: Formata a data usando dayjs no fuso horário do provedor ---
    return dayjs(date).tz(providerTimeZone).format("dddd, D [de] MMMM [de] YYYY")
  }

  const formatWeekRange = (startDate: Date) => {
    // --- MUDANÇA: Formata o range da semana usando dayjs no fuso horário do provedor ---
    const startDayjs = dayjs(startDate).tz(providerTimeZone);
    const endDayjs = startDayjs.add(6, 'day');

    if (startDayjs.month() === endDayjs.month()) {
      return `${startDayjs.date()} - ${endDayjs.date()} de ${monthNames[startDayjs.month()]} ${startDayjs.year()}`
    } else {
      return `${startDayjs.date()} de ${monthNames[startDayjs.month()]} - ${endDayjs.date()} de ${monthNames[endDayjs.month()]} ${startDayjs.year()}`
    }
  }

  const days = getDaysInMonth(currentDate)
  const isToday = (day: number) => {
    // --- MUDANÇA: Compara com "hoje" usando dayjs no fuso horário do provedor ---
    const todayDayjs = dayjs().tz(providerTimeZone);
    const currentDayjs = dayjs().tz(providerTimeZone).year(currentDate.getFullYear()).month(currentDate.getMonth()).date(day);
    return currentDayjs.isSame(todayDayjs, 'day');
  }

  const isTodayDate = (date: Date) => {
    // --- MUDANÇA: Compara com "hoje" usando dayjs no fuso horário do provedor ---
    const todayDayjs = dayjs().tz(providerTimeZone);
    const targetDayjs = dayjs(date).tz(providerTimeZone);
    return targetDayjs.isSame(todayDayjs, 'day');
  }

  const handleNavigation = (direction: "prev" | "next") => {
    if (viewMode === "month") navigateMonth(direction)
    else if (viewMode === "week") navigateWeek(direction)
    else navigateDay(direction)
  }

  const handleTodayClick = () => {
    // --- MUDANÇA: Define "hoje" usando dayjs no fuso horário do provedor ---
    const today = dayjs().tz(providerTimeZone).toDate();
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
                  {viewMode === "month" ? (<>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</>)
                    : viewMode === "week" ? (selectedWeek && (<span>{formatWeekRange(getWeekDays(selectedWeek)[0])}</span>))
                      : (selectedDay && <span>{formatDate(selectedDay)}</span>)}
                </span>
              </CardTitle>
              <div className="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" onClick={() => handleNavigation("prev")}><ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                <Button variant="outline" size="sm" onClick={handleTodayClick} className="text-xs sm:text-sm bg-transparent font-poppins">Hoje</Button>
                <Button variant="outline" size="sm" onClick={() => handleNavigation("next")}><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-1 sm:p-2 lg:p-6">
            {viewMode === "month" ? (
              <MonthView 
                currentDate={currentDate} 
                days={days} 
                getAppointmentsForDate={getAppointmentsForDate} 
                getStatusColor={getStatusColor} 
                handleAppointmentClick={handleAppointmentClick} 
                handleDayClick={handleDayClick} 
                isToday={isToday} 
                weekDays={weekDays} 
                providerTimeZone={providerTimeZone} 
              />
            ) : viewMode === "week" ? (
              selectedWeek && (
                <WeekView
                  selectedWeek={selectedWeek}
                  weekDays={weekDays}
                  weekDaysFull={weekDaysFull}
                  monthNames={monthNames}
                  isTodayDate={isTodayDate}
                  getWorkingHoursForDate={getWorkingHoursForDate}
                  getAppointmentsForDate={getAppointmentsForDate}
                  getAppointmentForHour={getAppointmentForHour}
                  isFirstHourOfAppointment={isFirstHourOfAppointment}
                  getAppointmentDuration={getAppointmentDuration}
                  handleAppointmentClick={handleAppointmentClick}
                  handleWeekDayClick={handleWeekDayClick}
                  handleCreateAppointment={handleCreateAppointment}
                  getStatusColor={getStatusColor}
                  providerTimeZone={providerTimeZone} 
                />
              )
            ) : (
              selectedDay && (
                <DayView 
                  getAppointmentForHour={getAppointmentForHour} 
                  getStatusColor={getStatusColor} 
                  getWorkingHoursForDate={getWorkingHoursForDate} 
                  handleAppointmentClick={handleAppointmentClick} 
                  handleCreateAppointment={handleCreateAppointment} 
                  isTodayDate={isTodayDate} 
                  selectedDay={selectedDay} 
                  getAppointmentsForDate={getAppointmentsForDate}
                  providerTimeZone={providerTimeZone} 
                />
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
        providerTimeZone={providerTimeZone} 
      />
      <CreateAppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        selectedDate={selectedDateForCreate}
        selectedTime={selectedTimeForCreate}
        onCreateAppointment={handleAppointmentCreated}
        providerTimeZone={providerTimeZone} 
      />
    </>
  )
}