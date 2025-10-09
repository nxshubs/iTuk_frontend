"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Phone, Mail, Star, AlertCircle } from "lucide-react"
import WhatsAppIcon from "@/components/ui/whatsapp"
import { Appointment } from "@/types/Appointment"
import { Review } from "@/types/Review";

import Cookies from "js-cookie"
import { toast } from "sonner"

import ReviewModal from "../../Review/ReviewModal"

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

interface AppointmentWithReview extends Appointment {
    review?: Review | null;
}

interface ClientAppointmentDetailsModalProps {
    appointment: AppointmentWithReview | null;
    isOpen: boolean;
    onClose: () => void;
    onRescheduleClick: () => void;
    userTimeZone: string;
    onAppointmentUpdated: (updatedAppointment: AppointmentWithReview) => void;
}

export default function ClientAppointmentDetailsModal({
    appointment: initialAppointment,
    isOpen,
    onClose,
    onRescheduleClick,
    userTimeZone,
    onAppointmentUpdated,
}: ClientAppointmentDetailsModalProps) {
    const [appointment, setAppointment] = useState<AppointmentWithReview | null>(initialAppointment);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setAppointment(initialAppointment);
    }, [initialAppointment]);


    if (!appointment) return null

    const formatPhoneNumberForWhatsApp = (phone: string) => {
        return phone.replace(/\D/g, "");
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 font-poppins";
            case "CONFIRMED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-poppins";
            case "COMPLETED": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 font-poppins";
            case "CANCELLED":
            case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 font-poppins";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 font-poppins";
        }
    }

    const getStatusText = (status: Appointment['status']) => {
        switch (status) {
            case "PENDING": return "Pendente";
            case "CONFIRMED": return "Confirmado";
            case "COMPLETED": return "Concluído";
            case "CANCELLED": return "Cancelado";
            case "REJECTED": return "Rejeitado";
            default: return status;
        }
    }

    const displayDate = appointment.startTime ? dayjs.utc(appointment.startTime).tz(userTimeZone).format('DD [de] MMMM [de] YYYY') : 'N/A';
    const displayTime = appointment.startTime ? dayjs.utc(appointment.startTime).tz(userTimeZone).format('HH:mm') : 'N/A';
    const displayEndTime = appointment.endTime ? dayjs.utc(appointment.endTime).tz(userTimeZone).format('HH:mm') : 'N/A';

    const isCompleted = appointment.status === "COMPLETED";
    const now = dayjs().tz(userTimeZone);
    const hasEnded = appointment.endTime ? dayjs.utc(appointment.endTime).tz(userTimeZone).isBefore(now) : false;
    const hasReview = !!appointment.review?.id;
    const canReview = isCompleted && hasEnded && !hasReview;

    const handleOpenReviewModal = () => {
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
    };

    const handleSubmitReview = async (ratingValue: number, comment: string) => {
        if (!appointment) return;

        const token = Cookies.get('authToken');
        if (!token) {
            toast.error("Sessão inválida. Por favor, faça login novamente.");
            throw new Error("Sessão inválida.");
        }

        try {
            // <<<<<<<<<<<<<<<<<<<< CORREÇÃO AQUI >>>>>>>>>>>>>>>>>>>>>>
            // A rota correta é /api/review/client/:appointmentId/create
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review/client/${appointment.id}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: ratingValue, comment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao enviar avaliação.");
            }

            const newReviewData = await response.json();

            // Certifique-se de que os dados retornados correspondem à interface Review
            const newReview: Review = {
                id: newReviewData.id,
                rating: newReviewData.rating,
                comment: newReviewData.comment ?? null,
                createdAt: newReviewData.createdAt,
                reviewer: {
                    name: appointment.client?.name ?? null, // Usar optional chaining e nullish coalescing
                    photoUrl: appointment.client?.avatarUrl ?? null,
                },
                reviewed: {
                    name: appointment.provider?.name ?? null,
                },
                service: {
                    name: appointment.service?.name ?? null // Usar optional chaining
                },
                canEdit: newReviewData.canEdit ?? false,
                isPublic: newReviewData.isPublic ?? true,
            };

            const updatedAppointment: AppointmentWithReview = {
                ...appointment,
                review: newReview,
                // `canReview` não é uma propriedade de `Appointment` no `types/Appointment.ts`
                // então pode ser removido daqui ou gerenciado como uma prop temporária no frontend.
                // canReview: false, // Remova esta linha se não for uma propriedade real do Appointment
                provider: {
                    ...appointment.provider,
                },
            };

            setAppointment(updatedAppointment);
            onAppointmentUpdated(updatedAppointment);
            toast.success("Avaliação enviada com sucesso!");
            handleCloseReviewModal();

        } catch (error: any) {
            console.error("Erro ao enviar avaliação:", error);
            toast.error(error.message || "Falha ao enviar avaliação.");
            throw error;
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-4 border-b border-border/50">
                        <DialogTitle className="text-xl font-semibold text-center">Detalhes do Agendamento</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">Status</h3>
                            <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                        </div>

                        {appointment.rescheduleRequest?.status === 'PENDING' && (
                            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 text-yellow-800 p-3 rounded-lg flex items-center gap-2 text-sm font-poppins">
                                <AlertCircle className="w-4 h-4" />
                                <span>Solicitação de reagendamento pendente para {dayjs.utc(appointment.rescheduleRequest.newStartTime).tz(userTimeZone).format('DD/MM [às] HH:mm')}.</span>
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 rounded-xl p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#ff8340] to-[#ff8340] rounded-full flex items-center justify-center shadow-lg">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="font-poppins flex-1">
                                    <p className="font-semibold text-foreground text-lg">
                                        {appointment.provider?.name || 'Prestador Desconhecido'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{appointment.service?.name || 'Serviço Desconhecido'}</p>
                                </div>
                            </div>

                            {appointment.service.price !== undefined && appointment.service.price !== null && (
                                <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                    <span className="text-sm font-medium font-poppins">Valor</span>
                                    <div className="text-right">
                                        <span className="font-bold text-[#ff8340] text-lg">R$ {appointment.service.price.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Calendar className="w-5 h-5 text-[#ff8340]" />
                                <div>
                                    <p className="text-sm font-medium">Data</p>
                                    <p className="text-sm text-muted-foreground">{displayDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <Clock className="w-5 h-5 text-[#ff8340]" />
                                <div>
                                    <p className="text-sm font-medium">Horário</p>
                                    <p className="text-sm text-muted-foreground">{displayTime} - {displayEndTime}</p>
                                </div>
                            </div>
                        </div>

                        {appointment.location && (
                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg font-poppins">
                                <MapPin className="w-5 h-5 text-[#ff8340] mt-1" />
                                <div>
                                    <p className="text-sm font-medium">Localização</p>
                                    <p className="text-sm text-muted-foreground">{appointment.location}</p>
                                </div>
                            </div>
                        )}

                        {(appointment.provider?.phone || appointment.provider?.email || appointment.provider?.whatsapp) && (
                            <div className="space-y-4 font-poppins">
                                <h4 className="font-bold text-foreground font-sans flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#ff8340]" />
                                    Contato do Prestador
                                </h4>
                                <div className="space-y-2">
                                    {appointment.provider?.phone && (
                                        <a href={`tel:${appointment.provider.phone}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                                            <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{appointment.provider.phone}</span>
                                        </a>
                                    )}
                                    {appointment.provider?.whatsapp && (
                                        <a
                                            href={`https://wa.me/${formatPhoneNumberForWhatsApp(appointment.provider.whatsapp)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                                        >
                                            <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-green-100 dark:group-hover:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <WhatsAppIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{appointment.provider.whatsapp}</span>
                                        </a>
                                    )}
                                    {appointment.provider?.email && (
                                        <a href={`mailto:${appointment.provider.email}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                                            <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-red-100 dark:group-hover:bg-red-900/30 rounded-full flex items-center justify-center">
                                                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400" />
                                            </div>
                                            <span className="text-sm text-muted-foreground break-all">{appointment.provider.email}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 font-poppins pt-4 border-t border-border/50">
                            {appointment.status === "CONFIRMED" && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent"
                                        onClick={onRescheduleClick}
                                        disabled={appointment.rescheduleRequest?.status === 'PENDING'}
                                    >
                                        Solicitar Alteração
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent"
                                    >
                                        Cancelar Agendamento
                                    </Button>
                                </div>
                            )}

                            {canReview && (
                                <Button
                                    onClick={handleOpenReviewModal}
                                    className="w-full bg-[#FC9056] hover:bg-[#ff8340] text-white shadow-lg"
                                >
                                    <Star className="w-4 h-4 mr-2" />
                                    Avaliar Atendimento
                                </Button>
                            )}
                        </div>

                        <Button variant="outline" onClick={onClose} className="w-full bg-transparent font-poppins hover:bg-muted/50">
                            Fechar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ReviewModal
                appointment={appointment}
                isOpen={isReviewModalOpen}
                onClose={handleCloseReviewModal}
                onSubmitReview={handleSubmitReview}
            />
        </>
    )
}