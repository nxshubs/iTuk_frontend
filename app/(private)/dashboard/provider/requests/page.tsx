"use client"

import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import { toast } from "sonner"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import RequestsHeader from "@/features/appointments/provider/requests/RequestsHeader"
import RequestList from "@/features/appointments/provider/requests/RequestList"
import { RequestsSkeleton } from "@/components/skeletons/RequestsSkeleton"
import { AppointmentRequest } from "@/types/AppointmentsRequest"
import { apiFetch } from "@/lib/api"

interface ApiResponseAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  client: {
    name: string;
    photoUrl: string | null;
    whatsapp: string | null;
  };
  service: {
    name: string;
    durationInMinutes: number;
    price: number;
  };
  provider: {
    address: string | null;
  };
  notes?: string | null;
  createdAt: string;
}

export default function RequestsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados da página
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Função para buscar os dados da API
  const fetchRequests = async () => {
    setIsLoading(true);
    setApiError(null);
    const token = Cookies.get('authToken');
    if (!token) {
      setApiError("Sessão inválida.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/provider/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar as solicitações.");
      }

      const data: ApiResponseAppointment[] = await response.json();

      const formattedRequests: AppointmentRequest[] = data.map(req => ({
        id: req.id,
        clientName: req.client.name,
        clientAvatar: req.client.photoUrl || null,
        clientPhone: req.client.whatsapp || null,
        service: req.service.name,
        date: new Date(req.startTime).toLocaleDateString('pt-BR'),
        time: new Date(req.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        duration: req.service.durationInMinutes,
        price: req.service.price,
        location: req.provider?.address || "Endereço não informado",
        notes: req.notes || undefined,
        status: 'pending',
        createdAt: req.createdAt,
      }));

      setRequests(formattedRequests);
    } catch (error: any) {
      setApiError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    const originalRequests = [...requests];
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast.info("Confirmando agendamento...");

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/provider/${requestId}/confirm`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Falha ao aceitar a solicitação.");

      toast.success("Solicitação aceita com sucesso!");

    } catch (error: any) {
      toast.error(error.message);
      setRequests(originalRequests);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    const originalRequests = [...requests];
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast.info("Rejeitando agendamento...");

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/provider/${requestId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Falha ao rejeitar a solicitação.");

      toast.success("Solicitação rejeitada com sucesso!");

    } catch (error: any) {
      toast.error(error.message);
      setRequests(originalRequests);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <RequestsSkeleton />;
    }
    if (apiError) {
      return <div className="text-center text-red-500 py-10">{apiError}</div>;
    }
    return (
      <RequestList
        requests={requests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex">
        <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="max-w-7xl mx-auto space-y-6">
            <RequestsHeader pendingCount={requests.length} />
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}