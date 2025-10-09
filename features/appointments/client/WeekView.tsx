"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone } from "lucide-react"
import { Appointment } from "@/types/Appointment"
import WhatsAppIcon from "@/components/ui/whatsapp"

// --- IMPORTS dayjs ---
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
// ----------------------------------------------------------------

interface WeekViewProps {
  currentDate: dayjs.Dayjs;
  getAppointmentsForDate: (date: dayjs.Dayjs) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  handlePhoneClick: (e: React.MouseEvent, phone: string | undefined) => void;
  handleWhatsAppClick: (e: React.MouseEvent, whatsapp: string | undefined) => void;
  userTimeZone: string;
}

export default function WeekView({
  currentDate,
  getAppointmentsForDate,
  onViewDetails,
  handlePhoneClick,
  handleWhatsAppClick,
  userTimeZone
}: WeekViewProps) {

  const getWeekDays = (): dayjs.Dayjs[] => {
    const startOfWeek = currentDate.startOf('week');
    const days: dayjs.Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  };

  // Função para obter a cor da borda/fundo do card do agendamento
  const getAppointmentCardColor = (status: Appointment['status'], rescheduleStatus?: Appointment['rescheduleRequest'] | null) => {
    if (rescheduleStatus?.status === 'PENDING') {
      return 'border-yellow-400 bg-yellow-50/50';
    }
    switch (status) {
      case "PENDING": return "border-yellow-200 bg-yellow-50/50";
      case "CONFIRMED": return "border-blue-200 bg-blue-50/50";
      case "COMPLETED": return "border-green-200 bg-green-50/50";
      case "CANCELLED":
      case "REJECTED": return "border-red-200 bg-red-50/50";
      default: return "border-gray-200 bg-gray-50/50";
    }
  };

  const getAppointmentTimeColor = (status: Appointment['status']) => {
    switch (status) {
      case "PENDING": return "text-yellow-600";
      case "CONFIRMED": return "text-blue-600";
      case "COMPLETED": return "text-green-600";
      case "CANCELLED":
      case "REJECTED": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
          {getWeekDays().map((date) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.isSame(dayjs().tz(userTimeZone), 'day');

            return (
              <div key={date.toISOString()} className="space-y-2">
                <div className={`text-center p-2 rounded-lg ${isToday ? "bg-[#FC9056] text-white" : "bg-muted"}`}>
                  <div className="text-xs sm:text-sm font-medium capitalize">{date.format("ddd")}</div>
                  <div className="text-lg font-bold">{date.date()}</div>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {dayAppointments.map((apt) => (
                    <Card
                      key={apt.id}
                      onClick={() => onViewDetails(apt)}
                      className={`cursor-pointer hover:shadow-md transition-shadow font-poppins relative ${getAppointmentCardColor(apt.status, apt.rescheduleRequest)}`}
                    >
                      <CardContent className="p-2 sm:px-3 space-y-1">
                        {apt.rescheduleRequest?.status === 'PENDING' && <div className="flex items-center text-xs text-yellow-600 font-semibold"><AlertCircle className="w-3 h-3 mr-1" /> Reag. Pendente</div>}
                        <div className={`text-xs font-medium ${getAppointmentTimeColor(apt.status)}`}>
                          {apt.startTime ? dayjs.utc(apt.startTime).tz(userTimeZone).format('HH:mm') : 'N/A'}
                        </div>
                        <div className="text-xs sm:text-sm font-medium truncate">{apt.service.name}</div> {/* USANDO apt.service.name */}
                        <div className="text-xs text-muted-foreground truncate">{apt.provider.name}</div> {/* USANDO apt.provider.name */}

                        {/* Botões de contato só para agendamentos CONFIRMED */}
                        {apt.status === 'CONFIRMED' && (
                          <div className="flex items-center gap-2 pt-1 border-t mt-2">
                            {apt.provider.phone && (
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => handlePhoneClick(e, apt.provider.phone)}>
                                <Phone className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            )}
                            {apt.provider.whatsapp && (
                              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => handleWhatsAppClick(e, apt.provider.whatsapp)}>
                                <WhatsAppIcon className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}