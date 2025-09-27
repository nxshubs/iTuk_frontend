"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone } from "lucide-react"
import { Appointment } from "@/types/Appointment"
import WhatsAppIcon from "@/components/ui/whatsapp"

interface WeekViewProps {
  currentDate: Date;
  getAppointmentsForDate: (date: Date) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  // 👇 1. ADICIONE AS PROPS PARA OS HANDLERS
  handlePhoneClick: (e: React.MouseEvent, phone: string | undefined) => void;
  handleWhatsAppClick: (e: React.MouseEvent, whatsapp: string | undefined) => void;
}

export default function WeekView({ 
  currentDate, 
  getAppointmentsForDate, 
  onViewDetails,
  handlePhoneClick,      // 👈
  handleWhatsAppClick    // 👈
}: WeekViewProps) {
  
  const getWeekDays = (): Date[] => {
    // ... (função continua a mesma)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
          {getWeekDays().map((date) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={date.toISOString()} className="space-y-2">
                <div className={`text-center p-2 rounded-lg ${isToday ? "bg-[#FC9056] text-white" : "bg-muted"}`}>
                  <div className="text-xs sm:text-sm font-medium capitalize">{date.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {dayAppointments.map((apt) => (
                    <Card key={apt.id} onClick={() => onViewDetails(apt)} className={`cursor-pointer hover:shadow-md transition-shadow font-poppins relative ${apt.rescheduleStatus === 'pending' ? 'border-yellow-400 bg-yellow-50/50' : apt.status === "upcoming" ? "border-blue-200 bg-blue-50/50" : "border-green-200 bg-green-50/50"}`}>
                      <CardContent className="p-2 sm:px-3 space-y-1">
                        {apt.rescheduleStatus === 'pending' && <div className="flex items-center text-xs text-yellow-600 font-semibold"><AlertCircle className="w-3 h-3 mr-1" /> Pendente</div>}
                        <div className={`text-xs font-medium ${apt.status === "upcoming" ? "text-blue-600" : "text-green-600"}`}>{apt.time}</div>
                        <div className="text-xs sm:text-sm font-medium truncate">{apt.service}</div>
                        <div className="text-xs text-muted-foreground truncate">{apt.providerName}</div>
                        
                        {/* 👇 2. ADICIONE O BLOCO DOS BOTÕES AQUI 👇 */}
                        {apt.status === 'upcoming' && (
                          <div className="flex items-center gap-2 pt-1 border-t mt-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => handlePhoneClick(e, apt.phone)}>
                              <Phone className="h-3 w-3 text-muted-foreground" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={(e) => handleWhatsAppClick(e, apt.whatsapp)}>
                              <WhatsAppIcon className="h-3 w-3 text-muted-foreground" />
                            </Button>
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