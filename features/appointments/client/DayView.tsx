"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Star } from "lucide-react"
import { Appointment } from "@/types/Appointment"

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


interface DayViewProps {
  currentDate: dayjs.Dayjs;
  getAppointmentsForDate: (date: dayjs.Dayjs) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onReview: (appointment: Appointment) => void;
  userTimeZone: string;
}

export default function DayView({ currentDate, getAppointmentsForDate, onViewDetails, onReview, userTimeZone }: DayViewProps) {
  const appointmentsForDay = getAppointmentsForDate(currentDate);

  // Função para obter a cor do status da badge
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "CONFIRMED": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "COMPLETED": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "CANCELLED":
      case "REJECTED": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case "PENDING": return "Pendente";
      case "CONFIRMED": return "Confirmado";
      case "COMPLETED": return "Concluído";
      case "CANCELLED": return "Cancelado";
      case "REJECTED": return "Rejeitado";
      default: return status;
    }
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-4">
          {appointmentsForDay.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhum agendamento</h3>
              <p className="text-muted-foreground font-poppins">Não há agendamentos para este dia.</p>
            </div>
          ) : (
            appointmentsForDay.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1 cursor-pointer" onClick={() => onViewDetails(apt)}>
                      <div className="flex items-center text-base sm:text-lg font-semibold">
                        <User className="w-5 h-5 mr-2 text-[#FC9056]" />
                        {apt.provider.name} {/* USANDO appointment.provider.name */}
                      </div>
                      <p className="text-muted-foreground font-poppins">
                        {apt.service.name} {/* USANDO appointment.service.name */}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {/* FORMATANDO HORA USANDO startTime e userTimeZone */}
                        {apt.startTime ? dayjs.utc(apt.startTime).tz(userTimeZone).format('HH:mm') : 'N/A'}
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center justify-end gap-2">
                        {apt.rescheduleRequest?.status === 'PENDING' && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Reagendamento Pendente</Badge>} {/* USANDO rescheduleRequest.status */}
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusText(apt.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {apt.canReview && apt.status === "COMPLETED" && !apt.rating && (
                          <Button onClick={(e) => { e.stopPropagation(); onReview(apt); }} size="sm" className="bg-[#FC9056] hover:bg-[#ff8340] text-white">
                            <Star className="w-4 h-4 mr-1" />Avaliar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}