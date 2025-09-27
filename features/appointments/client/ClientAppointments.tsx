"use client"

import { useState, useEffect } from "react"
import { Appointment } from "@/types/Appointment"
import Cookies from "js-cookie"
import { Loader2 } from "lucide-react"

// Modais
import ReviewModal from "../../Review/ReviewModal"
import ClientAppointmentDetailsModal from "./ClientAppointmentDetailsModal"
import RescheduleModal from "../RescheduleModal"

// Componentes da UI
import CalendarHeader from "./CalendarHeader"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"
import { apiFetch } from "@/lib/api"

type ViewMode = "month" | "week" | "day"

export default function ClientAppointments() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Estados para dados da API
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      const token = Cookies.get('authToken');
      if (!token) {
        setError("Não autenticado. Por favor, faça login novamente.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/client`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error("Falha ao buscar agendamentos.");
        }
        const data: Appointment[] = await response.json();
        setAppointments(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const formatPhoneNumber = (phone: string): string => phone.replace(/\D/g, "");

  const handleWhatsAppClick = (e: React.MouseEvent, phone: string | undefined) => {
    e.stopPropagation();
    if (!phone) return;
    window.open(`https://wa.me/${formatPhoneNumber(phone)}`, "_blank", "noopener,noreferrer");
  };

  const handlePhoneClick = (e: React.MouseEvent, phone: string | undefined) => {
    e.stopPropagation();
    if (!phone) return;
    window.open(`tel:${phone}`);
  };

  const handleReview = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setIsReviewModalOpen(true);
  };

  const handleViewDetails = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleOpenRescheduleModal = (): void => {
    setIsDetailsModalOpen(false);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = (appointmentId: string, newDate: string, newTime: string): void => {
    // Lógica para enviar reagendamento para a API
    alert("Funcionalidade de reagendamento a ser implementada.");
    setIsRescheduleModalOpen(false);
  };

  const navigateDate = (direction: "prev" | "next"): void => {
    const newDate = new Date(currentDate);
    const offset = direction === "next" ? 1 : -1;
    if (viewMode === "month") newDate.setMonth(newDate.getMonth() + offset);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + (offset * 7));
    else newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-[#FC9056]" /></div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <CalendarHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        navigateDate={navigateDate}
      />

      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          setViewMode={setViewMode}
          getAppointmentsForDate={getAppointmentsForDate}
          onViewDetails={handleViewDetails}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          getAppointmentsForDate={getAppointmentsForDate}
          onViewDetails={handleViewDetails}
          handlePhoneClick={handlePhoneClick}
          handleWhatsAppClick={handleWhatsAppClick}
        />
      )}
      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          getAppointmentsForDate={getAppointmentsForDate}
          onViewDetails={handleViewDetails}
          onReview={handleReview}
        />
      )}

      {/* Modais */}
      <ReviewModal appointment={selectedAppointment} isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <ClientAppointmentDetailsModal appointment={selectedAppointment} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} onRescheduleClick={handleOpenRescheduleModal} />
      <RescheduleModal appointment={selectedAppointment} isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} onSubmit={handleRescheduleSubmit} />
    </div>
  )
}