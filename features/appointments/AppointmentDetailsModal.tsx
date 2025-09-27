"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Mail, Star, MessageSquare, AlertTriangle, Check, X, Tag } from "lucide-react";
import WhatsAppIcon from "@/components/ui/whatsapp";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Link from "next/link";

import type { Appointment } from "@/types/Appointment";


interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  userType: "CLIENT" | "PROVIDER";
  onUpdate?: () => void;
}

export default function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  userType,
  onUpdate,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const personToShow = userType === "CLIENT" ? appointment.provider : appointment.client;
  const dateObj = new Date(appointment.startTime);
  const date = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

  const formatPhoneNumberForWhatsApp = (phone: string | undefined) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING": return { text: "Pendente", color: "bg-yellow-100 text-yellow-800" };
      case "CONFIRMED": return { text: "Confirmado", color: "bg-blue-100 text-blue-800" };
      case "COMPLETED": return { text: "Concluído", color: "bg-green-100 text-green-800" };
      case "CANCELLED": case "REJECTED": return { text: "Cancelado", color: "bg-red-100 text-red-800" };
      default: return { text: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const handleUpdateStatus = async (newStatus: "COMPLETED" | "CANCELLED") => {
    const token = Cookies.get('authToken');
    const endpointMap = {
      PROVIDER: {
        COMPLETED: `provider/${appointment.id}/complete`,
        CANCELLED: `provider/${appointment.id}/cancel`
      },
      CLIENT: {
        COMPLETED: '', // Cliente não pode completar
        CANCELLED: `client/${appointment.id}/cancel`
      }
    };
    const endpoint = endpointMap[userType][newStatus];
    if (!endpoint) return;

    const toastMessages = {
      loading: newStatus === 'COMPLETED' ? "Marcando como concluído..." : "Cancelando agendamento...",
      success: newStatus === 'COMPLETED' ? "Agendamento concluído!" : "Agendamento cancelado.",
      error: newStatus === 'COMPLETED' ? "Falha ao concluir." : "Falha ao cancelar."
    };

    toast.loading(toastMessages.loading);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${endpoint}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || toastMessages.error);
      }
      toast.success(toastMessages.success);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-semibold text-center">Detalhes do Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Status</h3>
            <Badge className={getStatusInfo(appointment.status).color}>{getStatusInfo(appointment.status).text}</Badge>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={personToShow.avatarUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground">{personToShow.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="font-poppins flex-1">
                <p className="font-semibold text-foreground text-lg">{personToShow.name}</p>
                <p className="text-sm text-muted-foreground">{appointment.service.name}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-black/20 rounded-lg backdrop-blur-sm">
              <span className="text-sm font-medium font-poppins">Valor</span>
              <div className="text-right">
                <span className="font-bold text-primary text-lg">R$ {appointment.service.price.toFixed(2)}</span>
                {appointment.paymentMethod && <p className="text-xs font-medium text-primary/80">{appointment.paymentMethod}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-poppins">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Data</p>
                <p className="text-sm text-muted-foreground">{date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Horário</p>
                <p className="text-sm text-muted-foreground">{time}</p>
              </div>
            </div>
          </div>

          {(personToShow.phone || personToShow.email || personToShow.whatsapp) && (
            <div className="space-y-4 font-poppins">
              <h4 className="font-semibold text-foreground flex items-center gap-2"><Phone className="w-4 h-4 text-primary" />Contato</h4>
              <div className="space-y-2">
                {personToShow.whatsapp && (
                  <a href={`https://wa.me/${formatPhoneNumberForWhatsApp(personToShow.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex-shrink-0 bg-muted group-hover:bg-green-100 rounded-full flex items-center justify-center">
                      <WhatsAppIcon className="w-4 h-4 text-muted-foreground group-hover:text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">{personToShow.whatsapp}</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Fechar</Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {userType === 'PROVIDER' && appointment.status === 'CONFIRMED' && (
              <>
                <Button onClick={() => handleUpdateStatus('CANCELLED')} variant="destructive" className="flex-1"><X className="w-4 h-4 mr-2" /> Cancelar</Button>
                <Button onClick={() => handleUpdateStatus('COMPLETED')} className="flex-1 bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-2" /> Concluir</Button>
              </>
            )}
            {userType === 'CLIENT' && appointment.status === 'CONFIRMED' && (
              <Button onClick={() => handleUpdateStatus('CANCELLED')} variant="destructive" className="w-full"><AlertTriangle className="w-4 h-4 mr-2" /> Cancelar Agendamento</Button>
            )}
            {appointment.status === "COMPLETED" && userType === "CLIENT" && appointment.canReview && (
              <Button className="w-full bg-primary hover:bg-primary/90"><Star className="w-4 h-4 mr-2" /> Avaliar Atendimento</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}