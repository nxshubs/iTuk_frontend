"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"
import { CalendarView } from "./CalendarView"
import { WeeklyView } from "./WeeklyView"
import { BlockDayModal } from "./Modal/BlockDayModal"
import { ConflictModal } from "./Modal/ConflictModal"
import { BulkBlockModal } from "./Modal/BulkBlockModal"
import Cookies from 'js-cookie'
import { BlockDaysSkeleton } from "@/components/skeletons/BlockDaysSkeleton"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"

// --- Tipos de Dados ---
interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  [key: number]: { id?: string, start: string; end: string; available: boolean }[]
}

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

// --- Componente Principal ---
export function ScheduleManagement() {
  // Estado da UI
  const [viewMode, setViewMode] = useState<"calendar" | "weekly">("weekly")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null)
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({})
  const [appointments, setAppointments] = useState<Appointment[]>([]) 

  const [isBlockDayModalOpen, setIsBlockDayModalOpen] = useState(false)
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false)
  const [isBulkBlockModalOpen, setIsBulkBlockModalOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [conflictAppointments, setConflictAppointments] = useState<Appointment[]>([])
  const [bulkStartDate, setBulkStartDate] = useState<string>("")
  const [bulkEndDate, setBulkEndDate] = useState<string>("")
  const [bulkReason, setBulkReason] = useState<string>("")

  const fetchData = async () => {
    setIsLoading(true)
    setApiError(null)
    const token = Cookies.get('authToken')
    if (!token) {
      setApiError("Sessão não encontrada. Por favor, faça login novamente.")
      setIsLoading(false)
      return
    }

    try {
      const [availabilityRes, blockedDatesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blocked-dates`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!availabilityRes.ok || !blockedDatesRes.ok) {
        throw new Error("Falha ao carregar os dados de agendamento.")
      }

      const availabilityData: Availability[] = await availabilityRes.json();
      const blockedDatesData: BlockedDay[] = await blockedDatesRes.json();

      const schedule: WeeklySchedule = {};
      availabilityData.forEach(avail => {
        if (!schedule[avail.dayOfWeek]) schedule[avail.dayOfWeek] = [];
        schedule[avail.dayOfWeek].push({ id: avail.id, start: avail.startTime, end: avail.endTime, available: true });
      });

      setWeeklySchedule(schedule);
      setBlockedDays(blockedDatesData.map(d => ({ ...d, date: d.date.split('T')[0] })));

    } catch (error: any) {
      setApiError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const blockDay = async (reason?: string) => {
    setIsSaving(true)
    const token = Cookies.get('authToken')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blocked-dates/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ date: selectedDate, reason: reason || "Dia bloqueado" })
      });
      const newBlockedDay = await response.json();
      if (!response.ok) throw new Error(newBlockedDay.error || "Falha ao bloquear o dia.");

      await fetchData(); 
      setIsBlockDayModalOpen(false);
    } catch (error: any) {
      setApiError(error.message)
    } finally {
      setIsSaving(false)
    }
  };

  const unblockDay = async (idToUnblock: string) => {
    setUnblockingId(idToUnblock);
    const token = Cookies.get('authToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blocked-dates/${idToUnblock}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao desbloquear o dia.");
      setBlockedDays((prev) => prev.filter((day) => day.id !== idToUnblock));
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setUnblockingId(null);
    }
  };

  const blockMultipleDays = async () => {
    if (!bulkStartDate || !bulkEndDate) return

    setIsSaving(true);
    setApiError(null);

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blocked-dates/range`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ startDate: bulkStartDate, endDate: bulkEndDate, reason: bulkReason })
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Falha ao bloquear o período.");
      }
      await fetchData();
      setIsBulkBlockModalOpen(false)
    } catch (error: any) {
      setApiError(error.message || "Falha ao bloquear o período.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWeeklySchedule = async () => {
    setIsSaving(true)
    const token = Cookies.get('authToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ schedule: weeklySchedule })
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Falha ao salvar horários.");
      }
      toast.success("Horários salvos com sucesso!");
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const handleDayClick = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayAppointments = appointments.filter((apt) => apt.date === dateStr)

    if (dayAppointments.length > 0) {
      setConflictAppointments(dayAppointments)
      setIsConflictModalOpen(true)
    } else {
      setSelectedDate(dateStr)
      setIsBlockDayModalOpen(true)
    }
  }

  const updateWeeklySchedule = (dayOfWeek: number, schedules: { start: string; end: string; available: boolean }[]) => {
    setWeeklySchedule((prev) => ({ ...prev, [dayOfWeek]: schedules }))
  }

  if (isLoading) return <BlockDaysSkeleton />
  if (apiError) return <p className="text-red-500">Erro: {apiError}</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 font-poppins">
          <Button variant={viewMode === "weekly" ? "default" : "outline"} onClick={() => setViewMode("weekly")} size="sm">
            <Clock className="w-4 h-4 mr-2" />
            Semanal
          </Button>
          <Button variant={viewMode === "calendar" ? "default" : "outline"} onClick={() => setViewMode("calendar")} size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </Button>
        </div>
        {viewMode === "calendar" && (
          <Button onClick={() => setIsBulkBlockModalOpen(true)} className="bg-[#FC9056] hover:bg-[#ff8340] font-poppins" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Bloqueio
          </Button>
        )}
      </div>

      {viewMode === "calendar" ? (
        <CalendarView
          blockedDays={blockedDays}
          appointments={appointments}
          onDayClick={handleDayClick}
          onUnblockDay={unblockDay}
          unblockingId={unblockingId}
        />
      ) : (
        <WeeklyView
          weeklySchedule={weeklySchedule}
          updateWeeklySchedule={updateWeeklySchedule}
          onSave={handleSaveWeeklySchedule}
          isSaving={isSaving}
        />
      )}

      <BlockDayModal
        isOpen={isBlockDayModalOpen}
        onOpenChange={setIsBlockDayModalOpen}
        selectedDate={selectedDate}
        onBlockDay={blockDay}
        isSaving={isSaving}
      />
      <ConflictModal
        isOpen={isConflictModalOpen}
        onOpenChange={setIsConflictModalOpen}
        appointments={conflictAppointments}
      />
      <BulkBlockModal
        isOpen={isBulkBlockModalOpen}
        onOpenChange={setIsBulkBlockModalOpen}
        bulkStartDate={bulkStartDate}
        setBulkStartDate={setBulkStartDate}
        bulkEndDate={bulkEndDate}
        setBulkEndDate={setBulkEndDate}
        bulkReason={bulkReason}
        setBulkReason={setBulkReason}
        onBlockMultipleDays={blockMultipleDays}
        isBlocking={isSaving}
      />
    </div>
  )
}

