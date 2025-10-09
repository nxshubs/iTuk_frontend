"use client"

import { useState, useEffect, useCallback } from "react"
import { Appointment } from "@/types/Appointment"
import { Review } from "@/types/Review"; // Certifique-se de importar Review se não estiver importado
import Cookies from "js-cookie"
import { toast } from "sonner"

// Modais
import ReviewModal from "../../Review/ReviewModal"
import ClientAppointmentDetailsModal from "./ClientAppointmentDetailsModal"
import RescheduleModal from "../RescheduleModal"

// Componentes da UI
import CalendarHeader from "./CalendarHeader"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"
import { ClientCalendarSkeleton } from "@/components/skeletons/ClientCalendarSkeleton"

// --- IMPORTS E CONFIGURAÇÃO dayjs ---
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('pt-br');
// ----------------------------------------------------------------

// Definindo AppointmentWithReview aqui para ser consistente
interface AppointmentWithReview extends Appointment {
    review?: Review | null;
}

type ViewMode = "month" | "week" | "day"

export default function ClientAppointments() {
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithReview | null>(null); // Tipo ajustado
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isRescheduleModalOpen, setIsRescheduleModal] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<ViewMode>("week");

    const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs().startOf('day'));

    const [appointments, setAppointments] = useState<AppointmentWithReview[]>([]); // Tipo ajustado
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userTimeZone, setUserTimeZone] = useState<string>('UTC');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setUserTimeZone(detectedTimeZone);
            console.log("[ClientAppointments] Fuso horário do usuário detectado:", detectedTimeZone);

            setCurrentDate(dayjs().tz(detectedTimeZone).startOf('day'));
        }
    }, []);

    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = Cookies.get('authToken');
        if (!token) {
            setError("Não autenticado. Por favor, faça login novamente.");
            setIsLoading(false);
            toast.error("Sessão inválida. Por favor, faça login novamente.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/client/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao buscar agendamentos.");
            }
            const data: AppointmentWithReview[] = await response.json(); // Tipo ajustado

            data.forEach(apt => {
                const aptStartTimeUTC = dayjs.utc(apt.startTime);
                const aptStartTimeLocal = aptStartTimeUTC.tz(userTimeZone);
                console.log(
                    `[Agendamento ${apt.id}] UTC: ${apt.startTime} | Local (${userTimeZone}): ${aptStartTimeLocal.format()}`
                );
            });

            setAppointments(data);
            console.log("[ClientAppointments] Agendamentos recebidos:", data);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userTimeZone]);

    useEffect(() => {
        if (userTimeZone !== 'UTC') {
            fetchAppointments();
        }
    }, [userTimeZone, fetchAppointments]);

    const formatPhoneNumber = (phone: string): string => phone.replace(/\D/g, "");

    const handleWhatsAppClick = (e: React.MouseEvent, phone: string | undefined | null) => {
        e.stopPropagation();
        if (!phone) return;
        window.open(`https://wa.me/${formatPhoneNumber(phone)}`, "_blank", "noopener,noreferrer");
    };

    const handlePhoneClick = (e: React.MouseEvent, phone: string | undefined | null) => {
        e.stopPropagation();
        if (!phone) return;
        window.open(`tel:${phone}`);
    };

    const handleReview = useCallback((appointment: AppointmentWithReview): void => { // Tipo ajustado
        setSelectedAppointment(appointment);
        setIsReviewModalOpen(true);
    }, []);

    const handleViewDetails = useCallback((appointment: AppointmentWithReview): void => { // Tipo ajustado
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
    }, []);

    const handleOpenRescheduleModal = useCallback((): void => {
        setIsDetailsModalOpen(false);
        setIsRescheduleModal(true);
    }, []);

    const handleRescheduleSubmit = useCallback(async (appointmentId: string, newDate: string, newTime: string) => {
        if (!selectedAppointment) {
            toast.error("Nenhum agendamento selecionado para reagendar.");
            return;
        }

        const newDateTimeLocal = dayjs(`${newDate}T${newTime}`).tz(userTimeZone, true);
        const newStartTimeUTC = newDateTimeLocal.utc().toISOString();

        const currentStartTimeLocal = dayjs.utc(selectedAppointment.startTime).tz(userTimeZone);
        const currentEndTimeLocal = dayjs.utc(selectedAppointment.endTime).tz(userTimeZone);
        const durationMinutes = currentEndTimeLocal.diff(currentStartTimeLocal, 'minute');
        const newEndTimeUTC = newDateTimeLocal.add(durationMinutes, 'minute').utc().toISOString();

        console.log(`Solicitando reagendamento para ${appointmentId} para nova data/hora (UTC): ${newStartTimeUTC} - ${newEndTimeUTC}`);

        const token = Cookies.get('authToken');
        if (!token) {
            toast.error("Sessão inválida. Por favor, faça login novamente.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentId}/reschedule-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    newStartTime: newStartTimeUTC,
                    newEndTime: newEndTimeUTC,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao solicitar reagendamento.");
            }

            const updatedAppointment: AppointmentWithReview = await response.json(); // Tipo ajustado
            setAppointments(prev => prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt));
            setSelectedAppointment(updatedAppointment);
            toast.success("Solicitação de reagendamento enviada com sucesso!");
            setIsRescheduleModal(false);
            setIsDetailsModalOpen(false);
            fetchAppointments();
        } catch (err: any) {
            toast.error(err.message || "Erro ao solicitar reagendamento.");
        }
    }, [selectedAppointment, userTimeZone, fetchAppointments]);


    const navigateDate = useCallback((direction: "prev" | "next"): void => {
        const offset = direction === "next" ? 1 : -1;
        let newDate: dayjs.Dayjs;

        if (viewMode === "month") {
            newDate = currentDate.add(offset, 'month');
        } else if (viewMode === "week") {
            newDate = currentDate.add(offset * 7, 'day');
        } else { // day view
            newDate = currentDate.add(offset, 'day');
        }
        setCurrentDate(newDate);
    }, [currentDate, viewMode]);

    const getAppointmentsForDate = useCallback((date: dayjs.Dayjs): AppointmentWithReview[] => { // Tipo de retorno ajustado
        const startOfDayLocal = date.startOf('day');
        const endOfDayLocal = date.endOf('day');

        return appointments.filter((apt) => {
            const aptStartTimeUTC = dayjs.utc(apt.startTime);
            const aptStartTimeLocal = aptStartTimeUTC.tz(userTimeZone);

            return aptStartTimeLocal.isSameOrAfter(startOfDayLocal, 'minute') && aptStartTimeLocal.isSameOrBefore(endOfDayLocal, 'minute');
        }).sort((a, b) => {
            const timeA = dayjs.utc(a.startTime).tz(userTimeZone);
            const timeB = dayjs.utc(b.startTime).tz(userTimeZone);
            return timeA.diff(timeB);
        });
    }, [appointments, userTimeZone]);

    const handleAppointmentUpdated = useCallback((updatedAppointment: AppointmentWithReview) => { // Tipo ajustado
        setAppointments(prev =>
            prev.map(apt => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
        );
        setSelectedAppointment(updatedAppointment);
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <ClientCalendarSkeleton />;
        }

        if (error) {
            return <div className="text-center text-red-500 p-4">{error}</div>;
        }

        return (
            <div className="space-y-6">
                <CalendarHeader
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    navigateDate={navigateDate}
                    userTimeZone={userTimeZone}
                />
                {viewMode === "month" && (
                    <MonthView
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setViewMode={setViewMode}
                        getAppointmentsForDate={getAppointmentsForDate}
                        onViewDetails={handleViewDetails}
                        userTimeZone={userTimeZone}
                        appointments={appointments} // << CORREÇÃO: Passando 'appointments'
                    />
                )}
                {viewMode === "week" && (
                    <WeekView
                        currentDate={currentDate}
                        getAppointmentsForDate={getAppointmentsForDate}
                        onViewDetails={handleViewDetails}
                        handlePhoneClick={handlePhoneClick}
                        handleWhatsAppClick={handleWhatsAppClick}
                        userTimeZone={userTimeZone}
                    />
                )}
                {viewMode === "day" && (
                    <DayView
                        currentDate={currentDate}
                        getAppointmentsForDate={getAppointmentsForDate}
                        onViewDetails={handleViewDetails}
                        handleReview={handleReview} // << CORREÇÃO: Adicionado 'handleReview'
                        userTimeZone={userTimeZone}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground font-heading">Meus Agendamentos</h1>
            {renderContent()}

            <ReviewModal
                appointment={selectedAppointment}
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmitReview={async (rating, comment) => {
                    // Lógica para enviar a avaliação, você precisará adaptar
                    // Se o ReviewModal já faz a requisição, apenas chame fetchAppointments
                    if (selectedAppointment) {
                        // Sua lógica de envio de review aqui
                        console.log(`Enviando review para ${selectedAppointment.id}: ${rating} estrelas, comentário: ${comment}`);
                        // Após o sucesso da requisição de review, você pode chamar:
                        await fetchAppointments(); // Para atualizar a lista de agendamentos e o status de review
                        setIsReviewModalOpen(false);
                    }
                }}
            />
            <ClientAppointmentDetailsModal
                appointment={selectedAppointment}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                onRescheduleClick={handleOpenRescheduleModal}
                userTimeZone={userTimeZone}
                onAppointmentUpdated={handleAppointmentUpdated}
            />
            <RescheduleModal
                appointment={selectedAppointment}
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModal(false)}
                onSubmit={handleRescheduleSubmit}
                userTimeZone={userTimeZone}
            />
        </div>
    )
}