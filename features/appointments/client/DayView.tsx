"use client"

import React from "react";
import dayjs from "dayjs";
import { Appointment } from "@/types/Appointment";
import { Review } from "@/types/Review";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, User, Phone, Star } from "lucide-react"; // Adicionado Star para o botão de review
import WhatsAppIcon from "@/components/ui/whatsapp";
import { Badge } from "@/components/ui/badge";

interface AppointmentWithReview extends Appointment {
    review?: Review | null;
}

interface DayViewProps {
    currentDate: dayjs.Dayjs;
    getAppointmentsForDate: (date: dayjs.Dayjs) => AppointmentWithReview[];
    onViewDetails: (appointment: AppointmentWithReview) => void;
    handleReview: (appointment: AppointmentWithReview) => void; // << CORREÇÃO: Adicionado 'handleReview' aqui
    userTimeZone: string;
}

export default function DayView({ currentDate, getAppointmentsForDate, onViewDetails, handleReview, userTimeZone }: DayViewProps) {
    const appointmentsOfDay = getAppointmentsForDate(currentDate);

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            case "CONFIRMED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
            case "COMPLETED": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "CANCELLED":
            case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4">
                Agendamentos para {currentDate.format('DD [de] MMMM [de] YYYY')}
            </h2>

            {appointmentsOfDay.length === 0 ? (
                <div className="text-center text-muted-foreground p-8">
                    Nenhum agendamento para este dia.
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointmentsOfDay.map(appointment => {
                        const isCompleted = appointment.status === "COMPLETED";
                        const now = dayjs().tz(userTimeZone);
                        const hasEnded = appointment.endTime ? dayjs.utc(appointment.endTime).tz(userTimeZone).isBefore(now) : false;
                        const hasReview = !!appointment.review?.id;
                        const canReview = isCompleted && hasEnded && !hasReview;

                        return (
                            <Card key={appointment.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onViewDetails(appointment)}>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-semibold">{appointment.provider?.name || 'Prestador Desconhecido'}</span>
                                        </div>
                                        <Badge className={getStatusColor(appointment.status)}>{getStatusText(appointment.status)}</Badge>
                                    </div>

                                    <h3 className="text-lg font-bold text-foreground">{appointment.service?.name || 'Serviço Desconhecido'}</h3>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{dayjs.utc(appointment.startTime).tz(userTimeZone).format('HH:mm')} - {dayjs.utc(appointment.endTime).tz(userTimeZone).format('HH:mm')}</span>
                                    </div>
                                    {appointment.location && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{appointment.location}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-2 justify-end">
                                        {canReview && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-[#FC9056] hover:bg-[#ff8340] text-white"
                                                onClick={(e) => { e.stopPropagation(); handleReview(appointment); }}
                                            >
                                                <Star className="w-4 h-4 mr-1" /> Avaliar
                                            </Button>
                                        )}
                                        {appointment.provider?.phone && (
                                            <Button variant="outline" size="sm" onClick={(e) => handlePhoneClick(e, appointment.provider?.phone)}>
                                                <Phone className="w-4 h-4 mr-1" /> Ligar
                                            </Button>
                                        )}
                                        {appointment.provider?.whatsapp && (
                                            <Button variant="outline" size="sm" onClick={(e) => handleWhatsAppClick(e, appointment.provider?.whatsapp)}>
                                                <WhatsAppIcon className="w-4 h-4 mr-1" /> WhatsApp
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}