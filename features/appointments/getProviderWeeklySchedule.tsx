"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Plus, Trash2, ChevronLeft, ChevronRight, Ban, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

interface TimeSlot {
  id: string
  date: string
  time: string
  available: boolean
  recurring?: boolean
  dayOfWeek?: number
}

interface WeeklySchedule {
  [key: number]: { start: string; end: string; available: boolean }[]
}

interface BlockedDay {
  id: string
  date: string
  reason?: string
}

// Mock appointments data for validation
const mockAppointments = [
  { id: "1", date: "2024-01-15", clientName: "Maria Santos" },
  { id: "2", date: "2024-01-16", clientName: "João Silva" },
  { id: "3", date: "2024-01-17", clientName: "Ana Costa" },
]

// Global state for weekly schedule - in a real app, this would be in a context or state management solution
export const getProviderWeeklySchedule = (): WeeklySchedule => {
  return {
    1: [{ start: "09:00", end: "19:00", available: true }], // Segunda
    2: [{ start: "09:00", end: "19:00", available: true }], // Terça
    3: [{ start: "09:00", end: "19:00", available: true }], // Quarta
    4: [{ start: "09:00", end: "19:00", available: true }], // Quinta
    5: [{ start: "09:00", end: "17:00", available: true }], // Sexta
    6: [{ start: "10:00", end: "14:00", available: true }], // Sábado
    0: [], // Domingo - não trabalha
  }
}

function ScheduleManagement() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "weekly">("calendar")
  const [isBlockDayModalOpen, setIsBlockDayModalOpen] = useState(false)
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false)
  const [isBulkBlockModalOpen, setIsBulkBlockModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [conflictAppointments, setConflictAppointments] = useState<any[]>([])
  const [bulkStartDate, setBulkStartDate] = useState<string>("")
  const [bulkEndDate, setBulkEndDate] = useState<string>("")
  const [bulkReason, setBulkReason] = useState<string>("")

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", date: "2024-01-15", time: "09:00", available: true },
    { id: "2", date: "2024-01-15", time: "10:00", available: true },
    { id: "3", date: "2024-01-15", time: "14:00", available: false },
    { id: "4", date: "2024-01-16", time: "09:00", available: true },
    { id: "5", date: "2024-01-17", time: "10:00", available: true },
    { id: "6", date: "2024-01-17", time: "11:00", available: true },
    { id: "7", date: "2024-01-18", time: "14:00", available: true },
    { id: "8", date: "2024-01-19", time: "09:00", available: false },
    { id: "9", date: "2024-01-20", time: "15:00", available: true },
  ])

  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([
    { id: "1", date: "2024-01-21", reason: "Feriado" },
    { id: "2", date: "2024-01-28", reason: "Compromisso pessoal" },
  ])

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(getProviderWeeklySchedule())

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const weekDaysFull = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const getTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return timeSlots.filter((slot) => slot.date === dateStr)
  }

  const getAppointmentsForDate = (dateStr: string) => {
    return mockAppointments.filter((apt) => apt.date === dateStr)
  }

  const isDayBlocked = (dateStr: string) => {
    return blockedDays.some((blocked) => blocked.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDayClick = (day: number) => {
    if (!day) return
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]

    // Check if there are appointments for this day
    const dayAppointments = getAppointmentsForDate(dateStr)

    if (dayAppointments.length > 0) {
      setConflictAppointments(dayAppointments)
      setSelectedDate(dateStr)
      setIsConflictModalOpen(true)
    } else {
      setSelectedDate(dateStr)
      setIsBlockDayModalOpen(true)
    }
  }

  const blockDay = (reason?: string) => {
    const newBlockedDay: BlockedDay = {
      id: Date.now().toString(),
      date: selectedDate,
      reason: reason || "Dia bloqueado",
    }
    setBlockedDays((prev) => [...prev, newBlockedDay])
    setIsBlockDayModalOpen(false)
  }

  const unblockDay = (dateStr: string) => {
    setBlockedDays((prev) => prev.filter((blocked) => blocked.date !== dateStr))
  }

  const removeTimeSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id))
  }

  const toggleAvailability = (id: string) => {
    setTimeSlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, available: !slot.available } : slot)))
  }

  const updateWeeklySchedule = (dayOfWeek: number, schedules: { start: string; end: string; available: boolean }[]) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [dayOfWeek]: schedules,
    }))
  }

  const generateHourlySlots = (start: string, end: string) => {
    const slots = []
    const startHour = Number.parseInt(start.split(":")[0])
    const endHour = Number.parseInt(end.split(":")[0])

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
    }
    return slots
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const blockMultipleDays = () => {
    if (!bulkStartDate || !bulkEndDate) return

    const startDate = new Date(bulkStartDate)
    const endDate = new Date(bulkEndDate)

    if (startDate > endDate) return

    const newBlockedDays: BlockedDay[] = []
    const currentDateIter = new Date(startDate)

    while (currentDateIter <= endDate) {
      const dateStr = currentDateIter.toISOString().split("T")[0]

      // Check if there are appointments for this day
      const dayAppointments = getAppointmentsForDate(dateStr)

      if (dayAppointments.length === 0) {
        newBlockedDays.push({
          id: `${Date.now()}-${currentDateIter.getTime()}`,
          date: dateStr,
          reason: bulkReason || "Período bloqueado",
        })
      }

      currentDateIter.setDate(currentDateIter.getDate() + 1)
    }

    setBlockedDays((prev) => [...prev, ...newBlockedDays])
    setIsBulkBlockModalOpen(false)
    setBulkStartDate("")
    setBulkEndDate("")
    setBulkReason("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 font-poppins">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </Button>
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            onClick={() => setViewMode("weekly")}
            size="sm"
          >
            <Clock className="w-4 h-4 mr-2" />
            Semanal
          </Button>
        </div>
        {viewMode === "calendar" && (
          <Button
            onClick={() => setIsBulkBlockModalOpen(true)}
            className="bg-[#FC9056] hover:bg-[#ff8340] font-poppins"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bloqueio
          </Button>
        )}
      </div>

      {viewMode === "calendar" ? (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
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
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm font-poppins text-gray-600 mt-2">
              Clique em um dia para bloqueá-lo. Dias com agendamentos não podem ser bloqueados.
            </p>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b font-poppins">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="min-h-[100px] p-2 bg-muted/20 rounded-lg"></div>
                }

                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dateStr = date.toISOString().split("T")[0]
                const daySlots = getTimeSlotsForDate(date)
                const dayAppointments = getAppointmentsForDate(dateStr)
                const isBlocked = isDayBlocked(dateStr)
                const availableSlots = daySlots.filter((slot) => slot.available).length
                const occupiedSlots = daySlots.filter((slot) => !slot.available).length

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                      isToday(day)
                        ? "ring-2 ring-[#FC9056] bg-[#FC9056]/5"
                        : isBlocked
                          ? "bg-red-50 border-red-200 hover:bg-red-100"
                          : dayAppointments.length > 0
                            ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                            : "bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isToday(day) ? "text-[#FC9056] font-bold" : isBlocked ? "text-red-700" : "text-foreground"
                      }`}
                    >
                      {day}
                    </div>

                    <div className="space-y-1">
                      {isBlocked ? (
                        <div className="flex items-center gap-1">
                          <Ban className="w-3 h-3 text-red-600" />
                          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-poppins">
                            Bloqueado
                          </div>
                        </div>
                      ) : dayAppointments.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-poppins">
                            {dayAppointments.length} agendamento{dayAppointments.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      ) : (
                        <>
                          {availableSlots > 0 && (
                            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {availableSlots} disponível{availableSlots !== 1 ? "is" : ""}
                            </div>
                          )}
                          {occupiedSlots > 0 && (
                            <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {occupiedSlots} ocupado{occupiedSlots !== 1 ? "s" : ""}
                            </div>
                          )}
                          {daySlots.length === 0 && (
                            <div className="text-xs text-gray-400 text-center py-2 font-poppins">
                              Clique para bloquear
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {isBlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          unblockDay(dateStr)
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-700 p-1 h-auto font-poppins"
                      >
                        Desbloquear
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ">
              <Clock className="w-5 h-5" />
              Horários Semanais Padrão
            </CardTitle>
            <p className="text-sm text-gray-600 font-poppins">Configure seus horários padrão para cada dia da semana</p>
          </CardHeader>
          <CardContent className="space-y-4 font-poppins">
            {weekDaysFull.map((dayName, dayIndex) => {
              const daySchedules = weeklySchedule[dayIndex] || []

              return (
                <div key={dayIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{dayName}</h3>
                    <Switch
                      className="font-poppins"
                      checked={daySchedules.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateWeeklySchedule(dayIndex, [{ start: "09:00", end: "17:00", available: true }])
                        } else {
                          updateWeeklySchedule(dayIndex, [])
                        }
                      }}
                    />
                  </div>

                  {daySchedules.length > 0 && (
                    <div className="space-y-2 ">
                      {daySchedules.map((schedule, scheduleIndex) => (
                        <div key={scheduleIndex} className="flex items-center gap-2">
                          <Select
                            value={schedule.start}
                            onValueChange={(value) => {
                              const newSchedules = [...daySchedules]
                              newSchedules[scheduleIndex].start = value
                              updateWeeklySchedule(dayIndex, newSchedules)
                            }}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="font-poppins">
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                  {`${i.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-gray-500">até</span>

                          <Select
                            value={schedule.end}
                            onValueChange={(value) => {
                              const newSchedules = [...daySchedules]
                              newSchedules[scheduleIndex].end = value
                              updateWeeklySchedule(dayIndex, newSchedules)
                            }}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="font-poppins">
                              {Array.from({ length: 24 }, (_, i) => (
                                <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                  {`${i.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSchedules = daySchedules.filter((_, i) => i !== scheduleIndex)
                              updateWeeklySchedule(dayIndex, newSchedules)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSchedules = [...daySchedules, { start: "09:00", end: "17:00", available: true }]
                          updateWeeklySchedule(dayIndex, newSchedules)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Período
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Block Day Modal */}
      <Dialog open={isBlockDayModalOpen} onOpenChange={setIsBlockDayModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear Dia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Data Selecionada</label>
              <p className="text-sm text-gray-600">
                {selectedDate &&
                  new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Motivo (opcional)</label>
              <Select onValueChange={(value) => {}}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feriado">Feriado</SelectItem>
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="compromisso">Compromisso pessoal</SelectItem>
                  <SelectItem value="doenca">Doença</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsBlockDayModalOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={() => blockDay("Dia bloqueado")} className="flex-1 bg-red-600 hover:bg-red-700">
                <Ban className="w-4 h-4 mr-2" />
                Bloquear Dia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conflict Modal */}
      <Dialog open={isConflictModalOpen} onOpenChange={setIsConflictModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Não é possível bloquear este dia
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Este dia possui agendamentos confirmados e não pode ser bloqueado:
              </p>
              <div className="space-y-2">
                {conflictAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">{appointment.clientName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Para bloquear este dia, você precisa primeiro cancelar ou reagendar todos os
                agendamentos existentes.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setIsConflictModalOpen(false)} className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Block Modal */}
      <Dialog open={isBulkBlockModalOpen} onOpenChange={setIsBulkBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Evento - Bloquear Período
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block font-poppins">Data Inicial</label>
                <Input
                  type="date"
                  value={bulkStartDate}
                  onChange={(e) => setBulkStartDate(e.target.value)}
                  className="font-poppins"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block font-poppins">Data Final</label>
                <Input
                  type="date"
                  value={bulkEndDate}
                  onChange={(e) => setBulkEndDate(e.target.value)}
                  className="font-poppins"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block font-poppins">Motivo</label>
              <Select value={bulkReason} onValueChange={setBulkReason}>
                <SelectTrigger className="font-poppins">
                  <SelectValue placeholder="Selecione um motivo" />
                </SelectTrigger>
                <SelectContent className="font-poppins">
                  <SelectItem value="ferias">Férias</SelectItem>
                  <SelectItem value="feriado">Feriado</SelectItem>
                  <SelectItem value="compromisso">Compromisso pessoal</SelectItem>
                  <SelectItem value="viagem">Viagem</SelectItem>
                  <SelectItem value="evento">Evento especial</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkStartDate && bulkEndDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-poppins">
                  <strong>Período selecionado:</strong> {new Date(bulkStartDate).toLocaleDateString("pt-BR")} até{" "}
                  {new Date(bulkEndDate).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-xs text-blue-600 mt-1 font-poppins">
                  Dias com agendamentos existentes não serão bloqueados.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsBulkBlockModalOpen(false)
                  setBulkStartDate("")
                  setBulkEndDate("")
                  setBulkReason("")
                }}
                className="flex-1 font-poppins"
              >
                Cancelar
              </Button>
              <Button
                onClick={blockMultipleDays}
                className="flex-1 bg-[#FC9056] hover:bg-[#ff8340] font-poppins"
                disabled={!bulkStartDate || !bulkEndDate}
              >
                <Ban className="w-4 h-4 mr-2" />
                Bloquear Período
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { ScheduleManagement }
