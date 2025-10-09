"use client"

import { useState, useEffect } from "react"
import { Appointment } from "@/types/Appointment"
import Cookies from "js-cookie"

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
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // NOVO PLUGIN
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // NOVO PLUGIN

// Configurar dayjs com os plugins de UTC, fuso horário e comparação de datas
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter); // Estender para usar isSameOrAfter
dayjs.extend(isSameOrBefore); // Estender para usar isSameOrBefore
// ----------------------------------------------------------------

type ViewMode = "month" | "week" | "day"

export default function ClientAppointments() {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<ViewMode>("week");

    const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs().startOf('day'));

    const [appointments, setAppointments] = useState<Appointment[]>([]);
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
                console.log("[ClientAppointments] Agendamentos recebidos (UTC):", data);
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
        // Você receberá newDate e newTime no formato 'YYYY-MM-DD' e 'HH:mm' do modal.
        // É crucial convertê-los para UTC antes de enviar para a API.
        
        // Combina a data e hora no fuso horário do usuário
        const newDateTimeLocal = dayjs(`${newDate}T${newTime}`).tz(userTimeZone, true); // `true` para manter o offset
        
        // Converte para UTC e formata para string ISO
        const newStartTimeUTC = newDateTimeLocal.utc().toISOString();

        console.log(`Solicitando reagendamento para ${appointmentId} para nova data/hora (UTC): ${newStartTimeUTC}`);
        alert(`Funcionalidade de reagendamento a ser implementada. Enviaria: ${newStartTimeUTC}`);
        setIsRescheduleModalOpen(false);
    };

    const navigateDate = (direction: "prev" | "next"): void => {
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
    };

    const getAppointmentsForDate = (date: dayjs.Dayjs): Appointment[] => {
        const startOfDayLocal = date.startOf('day');
        const endOfDayLocal = date.endOf('day');

        return appointments.filter((apt) => {
            const aptStartTimeUTC = dayjs.utc(apt.startTime);
            const aptStartTimeLocal = aptStartTimeUTC.tz(userTimeZone);

            // Verifica se o agendamento cai dentro do dia (no fuso horário do usuário)
            // isSameOrAfter e isSameOrBefore agora estão disponíveis
            return aptStartTimeLocal.isSameOrAfter(startOfDayLocal) && aptStartTimeLocal.isSameOrBefore(endOfDayLocal);
        }).sort((a, b) => {
            const timeA = dayjs.utc(a.startTime).tz(userTimeZone);
            const timeB = dayjs.utc(b.startTime).tz(userTimeZone);
            return timeA.diff(timeB);
        });
    };


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
                    userTimeZone={userTimeZone} // <<< CORREÇÃO: Passando userTimeZone
                />
                {viewMode === "month" && (
                    <MonthView
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setViewMode={setViewMode}
                        getAppointmentsForDate={getAppointmentsForDate}
                        onViewDetails={handleViewDetails}
                        userTimeZone={userTimeZone}
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
                        onReview={handleReview}
                        userTimeZone={userTimeZone}
                    />
                )}
            </div>
        );
    };

    return (
        <div>
            {renderContent()}
            <ReviewModal appointment={selectedAppointment} isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
            <ClientAppointmentDetailsModal
                appointment={selectedAppointment}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                onRescheduleClick={handleOpenRescheduleModal}
                userTimeZone={userTimeZone}
            />
            <RescheduleModal
                appointment={selectedAppointment}
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onSubmit={handleRescheduleSubmit}
                userTimeZone={userTimeZone} // <<< CORREÇÃO: Passando userTimeZone para RescheduleModal
            />
        </div>
    )
}