"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Phone, Mail, Star, MessageCircle } from "lucide-react"
import WhatsAppIcon from "@/components/ui/whatsapp"
import { Appointment } from "@/types/Appointment" // Supondo que a interface está em /types/Appointment.ts

interface ClientAppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onRescheduleClick: () => void; // Prop para acionar a abertura do modal de reagendamento
}

export default function ClientAppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onRescheduleClick, // Recebendo a nova prop
}: ClientAppointmentDetailsModalProps) {
  if (!appointment) return null

  // Função auxiliar para formatar o número para o link do WhatsApp
  const formatPhoneNumberForWhatsApp = (phone: string) => {
    return phone.replace(/\D/g, "");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-poppins"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 font-poppins"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 font-poppins"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 font-poppins"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Agendado"
      case "completed":
        return "Concluído"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
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

          <div className="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-950/20 dark:to-orange-900/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff8340] to-[#ff8340] rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="font-poppins flex-1">
                <p className="font-semibold text-foreground text-lg">
                  {appointment.providerName}
                </p>
                <p className="text-sm text-muted-foreground">{appointment.service}</p>
              </div>
            </div>

            {appointment.price && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm font-medium font-poppins">Valor</span>
                <div className="text-right">
                  <span className="font-bold text-[#ff8340] text-lg">{appointment.price}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-[#ff8340]" />
              <div>
                <p className="text-sm font-medium">Data</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointment.date).toLocaleDateString("pt-BR", {
                    timeZone: 'UTC', // Adicionado para evitar problemas de fuso horário
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-5 h-5 text-[#ff8340]" />
              <div>
                <p className="text-sm font-medium">Horário</p>
                <p className="text-sm text-muted-foreground">{appointment.time}</p>
              </div>
            </div>
          </div>
          
          {(appointment.phone || appointment.email || appointment.whatsapp) && (
            <div className="space-y-4 font-poppins">
              <h4 className="font-bold text-foreground font-sans flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff8340]" />
                Contato do Prestador
              </h4>
              <div className="space-y-2">
                {appointment.phone && (
                  <a href={`tel:${appointment.phone}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                     <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                  </a>
                )}
                {appointment.whatsapp && (
                  <a 
                    href={`https://wa.me/${formatPhoneNumberForWhatsApp(appointment.whatsapp)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-green-100 dark:group-hover:bg-green-900/30 rounded-full flex items-center justify-center">
                      <WhatsAppIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">{appointment.whatsapp}</span>
                  </a>
                )}
                {appointment.email && (
                  <a href={`mailto:${appointment.email}`} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-red-100 dark:group-hover:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400" />
                    </div>
                    <span className="text-sm text-muted-foreground break-all">{appointment.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3 font-poppins pt-4 border-t border-border/50">
            {appointment.status === "upcoming" && (
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={onRescheduleClick}
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
            
            {appointment.status === "completed" && !appointment.rating && (
              <Button onClick={() => alert("Abrir modal de avaliação")} className="w-full bg-[#FC9056] hover:bg-[#ff8340] text-white shadow-lg">
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
  )
}