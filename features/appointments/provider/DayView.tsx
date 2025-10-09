"use client"

import { Button } from "@/components/ui/button";
import WhatsAppIcon from "@/components/ui/whatsapp";
import { Clock, MapPin, Phone, Plus, Calendar } from "lucide-react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Appointment } from "@/types/Appointment";

dayjs.extend(utc);
dayjs.extend(timezone);


export interface DayViewProps {
  selectedDay: Date; 
  getWorkingHoursForDate: (date: Date) => string[];
  getAppointmentForHour: (date: Date, hour: string) => Appointment | undefined;
  isTodayDate: (date: Date) => boolean;
  getStatusColor: (status: string) => string;
  handleAppointmentClick: (appointment: Appointment) => void;
  handleCreateAppointment: (date: Date, hour: string) => void;
  getAppointmentsForDate: (date: Date) => Appointment[];
  providerTimeZone: string; 
}

export const DayView = ({ 
    selectedDay, 
    getWorkingHoursForDate, 
    getAppointmentForHour, 
    isTodayDate, 
    getStatusColor, 
    handleAppointmentClick, 
    handleCreateAppointment, 
    getAppointmentsForDate,
    providerTimeZone // <-- RECEBENDO A NOVA PROP
}: DayViewProps) => {
  const workingHours = getWorkingHoursForDate(selectedDay);
  const dayAppointments = getAppointmentsForDate(selectedDay);

  // Caso 1: Não há horários de trabalho definidos para este dia da semana.
  if (workingHours.length === 0) {
    return (
      <div className="p-8 text-center">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Não há horários de trabalho</h3>
        <p className="text-muted-foreground">
          Configure seus horários de trabalho em "Meus Horários" para este dia da semana.
        </p>
      </div>
    );
  }

  // Helper para formatar números de telefone para WhatsApp
  const formatPhoneNumberForWhatsApp = (phone: string | undefined) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  // Caso 2 e 3: Sempre renderiza a tabela de horários.
  // Se não houver agendamentos, exibe uma mensagem no topo.
  return (
    <div className="grid grid-cols-1 gap-0 border rounded-lg overflow-hidden">
      {dayAppointments.length === 0 && (
        <div className="p-4 text-center bg-gray-50 text-gray-600 border-b">
          <Calendar className="w-5 h-5 mx-auto mb-1" />
          <p className="text-sm font-medium">Não há agendamentos para este dia.</p>
        </div>
      )}

      {workingHours.map((hour) => {
        const appointment = getAppointmentForHour(selectedDay, hour);
        // --- MUDANÇA: Usa dayjs para verificar a hora atual no fuso horário do provedor ---
        const isCurrentHour = dayjs().tz(providerTimeZone).hour() === Number.parseInt(hour.split(":")[0]) && isTodayDate(selectedDay);
        
        return (
          <div
            key={hour}
            className={`grid grid-cols-[60px_1fr] sm:grid-cols-[80px_1fr] border-b last:border-b-0 min-h-[50px] sm:min-h-[60px] ${isCurrentHour ? "bg-blue-50" : ""}`}
          >
            <div className="p-2 sm:p-3 border-r bg-muted/30 flex items-start">
              <span className={`text-xs sm:text-sm font-medium ${isCurrentHour ? "text-blue-600 font-bold" : "text-muted-foreground"}`}>
                {hour}
              </span>
            </div>
            <div className="p-2 sm:p-3 relative">
              {appointment ? (
                // --- MUDANÇA: Formata as horas do agendamento para o fuso horário do provedor ---
                <div
                  onClick={() => handleAppointmentClick(appointment)}
                  className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${getStatusColor(appointment.status)}`}
                >
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm mb-1">{appointment.client.name}</h4>
                      <p className="text-xs opacity-90 mb-1">{appointment.service.name}</p>
                      <div className="flex items-center gap-2 text-xs opacity-90">
                        <Clock className="w-3 h-3" />
                        <span>{dayjs.utc(appointment.startTime).tz(providerTimeZone).format('HH:mm')} - {dayjs.utc(appointment.endTime).tz(providerTimeZone).format('HH:mm')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold">{appointment.service.price}</div>
                      <div className="text-xs text-muted-foreground">{appointment.paymentMethod}</div>
                      <div className="flex gap-2 mt-2 justify-end">
                        {appointment.client.phone && (
                          <a href={`tel:${formatPhoneNumberForWhatsApp(appointment.client.phone)}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" className="group border-gray-300 text-gray-500 hover:border-orange-500 hover:bg-orange-500/10 transition-colors bg-transparent h-8 w-8 p-0">
                              <Phone className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                            </Button>
                          </a>
                        )}
                        {appointment.client.whatsapp && (
                          <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(appointment.client.whatsapp)}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" className="group border-gray-300 text-gray-500 hover:border-green-500 hover:bg-green-500/10 transition-colors bg-transparent h-8 w-8 p-0">
                              <WhatsAppIcon className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {appointment.location && (
                    <div className="flex items-center gap-1 text-xs opacity-90 mt-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{appointment.location}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm" onClick={() => handleCreateAppointment(selectedDay, hour)}>
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Agendar horário</span>
                    <span className="sm:hidden">Agendar</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};