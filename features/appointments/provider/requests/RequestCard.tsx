"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, User, Check, X, Phone } from "lucide-react";
import type { AppointmentRequest } from "@/types/AppointmentsRequest";

interface RequestCardProps {
  request: AppointmentRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RequestCard({ request, onAccept, onReject }: RequestCardProps) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <Card className="w-full hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Coluna 1: Informações do Cliente */}
          <div className="flex items-center gap-4 w-full sm:w-1/4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.clientAvatar || undefined} />
              <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
                {getInitials(request.clientName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{request.clientName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3"/>
                <span className="truncate">{request.clientPhone || 'Não informado'}</span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Detalhes do Agendamento */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground flex-1">
            <div className="flex items-center gap-2 truncate"><User className="w-4 h-4 text-primary" /> {request.service}</div>
            <div className="flex items-center gap-2 truncate"><Calendar className="w-4 h-4 text-primary" /> {request.date}</div>
            <div className="flex items-center gap-2 truncate"><Clock className="w-4 h-4 text-primary" /> {request.time} ({request.duration} min)</div>
            <div className="flex items-center gap-2 truncate"><MapPin className="w-4 h-4 text-primary" /> {request.location || 'Não informado'}</div>
            <div className="flex items-center gap-2 truncate"><DollarSign className="w-4 h-4 text-primary" /> R$ {request.price.toFixed(2)}</div>
          </div>
          
          {/* Coluna 3: Botões de Ação */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Button onClick={() => onAccept(request.id)} size="sm" className="w-full bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-2" /> Aceitar
            </Button>
            <Button onClick={() => onReject(request.id)} size="sm" variant="outline" className="w-full">
              <X className="w-4 h-4 mr-2" /> Recusar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}