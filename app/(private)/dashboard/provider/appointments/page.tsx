"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import ProviderCalendar from "@/features/appointments/provider"
import type { Appointment } from "@/types/Appointment"
import Cookies from 'js-cookie'
import { CalendarSkeleton } from "@/components/skeletons/CalendarSkeleton"

export default function ProviderAppointments() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [tempStatusFilters, setTempStatusFilters] = useState({
    upcoming: true,
    completed: true,
    cancelled: true,
  })
  const [appliedStatusFilters, setAppliedStatusFilters] = useState({
    upcoming: true,
    completed: true,
    cancelled: true,
  })

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setApiError(null);
      const token = Cookies.get('authToken');
      if (!token) {
        setApiError("Sessão inválida.");
        setIsLoading(false);
        return;
      }

      try {
        const statusFilter = Object.entries(appliedStatusFilters)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(',');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/provider?status=${statusFilter}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Falha ao buscar agendamentos.");
        }

        const data = await response.json();
        const formattedData = data.map((apt: any) => {
          const startTime = new Date(apt.startTime);
          return {
            ...apt,
            date: startTime.toISOString().split('T')[0], 
            time: startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
          };
        });

        setAppointments(formattedData);
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [appliedStatusFilters]);

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [...prev, newAppointment])
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (!appointment || !appointment.status) return false;
    let statusKey: keyof typeof appliedStatusFilters | null = null;
    const upperCaseStatus = appointment.status.toUpperCase();

    if (['CONFIRMED', 'PENDING'].includes(upperCaseStatus)) {
      statusKey = 'upcoming';
    } else if (upperCaseStatus === 'COMPLETED') {
      statusKey = 'completed';
    } else if (['CANCELLED', 'REJECTED'].includes(upperCaseStatus)) {
      statusKey = 'cancelled';
    }
    return statusKey ? appliedStatusFilters[statusKey] : false;
  });

  const handleStatusFilterChange = (status: keyof typeof tempStatusFilters, checked: boolean) => {
    setTempStatusFilters((prev) => ({ ...prev, [status]: checked, }))
  }

  const applyFilters = () => {
    setAppliedStatusFilters({ ...tempStatusFilters })
    setIsFilterModalOpen(false)
  }

  const clearAllFilters = () => {
    const allEnabled = { upcoming: true, completed: true, cancelled: true }
    setTempStatusFilters(allEnabled)
    setAppliedStatusFilters(allEnabled)
  }

  const getActiveFiltersCount = () => {
    return Object.values(appliedStatusFilters).filter((value) => value === true).length
  }

  const removeFilter = (status: keyof typeof appliedStatusFilters) => {
    const newAppliedFilters = { ...appliedStatusFilters, [status]: false }
    setAppliedStatusFilters(newAppliedFilters)
    setTempStatusFilters(newAppliedFilters)
  }

  const openFilterModal = () => {
    setTempStatusFilters({ ...appliedStatusFilters })
    setIsFilterModalOpen(true)
  }

  const now = new Date();
  const currentMonthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (isLoading) {
    return <CalendarSkeleton />
  }

  if (apiError) {
    return <div className="text-red-500 p-4">Error: {apiError}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="md:ml-64">
        <DashboardHeader onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="p-2 sm:p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-foreground mb-2">
                  Calendário de Agendamentos
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  Visualize e gerencie todos os seus agendamentos
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={openFilterModal} className="flex items-center gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filtros
                  {getActiveFiltersCount() < 3 && (<Badge variant="secondary" className="ml-1">{getActiveFiltersCount()}</Badge>)}
                </Button>
                {/* Active Filters Badges */}
                {!appliedStatusFilters.upcoming && (<Badge variant="outline" className="flex items-center gap-1">Agendados ocultos<X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("upcoming")} /></Badge>)}
                {!appliedStatusFilters.completed && (<Badge variant="outline" className="flex items-center gap-1">Concluídos ocultos<X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("completed")} /></Badge>)}
                {!appliedStatusFilters.cancelled && (<Badge variant="outline" className="flex items-center gap-1">Cancelados ocultos<X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter("cancelled")} /></Badge>)}
                {getActiveFiltersCount() < 3 && (<Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">Limpar filtros</Button>)}
              </div>
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredAppointments.length} de {appointments.length} agendamentos
              </div>
            </div>

            <ProviderCalendar
              appointments={appointments}
              handleAppointmentCreated={handleAppointmentCreated}
              appliedStatusFilters={appliedStatusFilters}
            />

            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Este Mês</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                        {appointments.filter((apt) => apt && apt.date && apt.date.startsWith(currentMonthString)).length}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-[#FC9056]" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Agendados</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                        {appointments.filter(apt => apt && apt.status && ['CONFIRMED', 'PENDING'].includes(apt.status.toUpperCase())).length}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Concluídos</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                        {appointments.filter(apt => apt && apt.status && apt.status.toUpperCase() === 'COMPLETED').length}
                      </p>
                    </div>
                    <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Cancelados</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                        {appointments.filter(apt => apt && apt.status && ['CANCELLED', 'REJECTED'].includes(apt.status.toUpperCase())).length}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrar Agendamentos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Status dos Agendamentos</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="upcoming" checked={tempStatusFilters.upcoming} onCheckedChange={(checked) => handleStatusFilterChange("upcoming", checked as boolean)} />
                  <label htmlFor="upcoming" className="text-sm flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div>Agendados</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="completed" checked={tempStatusFilters.completed} onCheckedChange={(checked) => handleStatusFilterChange("completed", checked as boolean)} />
                  <label htmlFor="completed" className="text-sm flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div>Concluídos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cancelled" checked={tempStatusFilters.cancelled} onCheckedChange={(checked) => handleStatusFilterChange("cancelled", checked as boolean)} />
                  <label htmlFor="cancelled" className="text-sm flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div>Cancelados</label>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={clearAllFilters} className="flex-1 bg-transparent">Limpar Filtros</Button>
              <Button onClick={applyFilters} className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">Aplicar Filtros</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}