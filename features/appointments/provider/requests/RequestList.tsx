"use client"

import type { AppointmentRequest } from "@/types/AppointmentsRequest";
import RequestCard from "./RequestCard"; // Importa o novo componente de card
import { Inbox } from "lucide-react";

interface RequestListProps {
  requests: AppointmentRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RequestList({ requests, onAccept, onReject }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma solicitação pendente</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Quando um cliente solicitar um agendamento, ele aparecerá aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <RequestCard
          key={request.id}
          request={request}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
}