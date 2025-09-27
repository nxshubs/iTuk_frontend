"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Star, Phone } from "lucide-react"
import { Appointment } from "@/types/Appointment"
import WhatsAppIcon from "@/components/ui/whatsapp"

interface DayViewProps {
  currentDate: Date;
  getAppointmentsForDate: (date: Date) => Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onReview: (appointment: Appointment) => void;
}

export default function DayView({ currentDate, getAppointmentsForDate, onViewDetails, onReview }: DayViewProps) {
  const appointmentsForDay = getAppointmentsForDate(currentDate);

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
                      <div className="flex items-center text-base sm:text-lg font-semibold"><User className="w-5 h-5 mr-2 text-[#FC9056]" />{apt.providerName}</div>
                      <p className="text-muted-foreground font-poppins">{apt.service}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground"><Clock className="w-4 h-4" /> {apt.time}</div>
                    </div>
                    <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center justify-end gap-2">
                        {apt.rescheduleStatus === 'pending' && <Badge variant="outline" className="border-yellow-500 text-yellow-600">Reagendamento Pendente</Badge>}
                        <Badge className={`${apt.status === "upcoming" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{apt.status === "upcoming" ? "Agendado" : "Concluído"}</Badge>
                      </div>
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {apt.canReview && <Button onClick={(e) => { e.stopPropagation(); onReview(apt); }} size="sm" className="bg-[#FC9056] hover:bg-[#ff8340] text-white"><Star className="w-4 h-4 mr-1" />Avaliar</Button>}
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