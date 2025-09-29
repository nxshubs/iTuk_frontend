"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import SidebarMenu from "@/components/shared/SidebarMenu";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { Shield, Palette, Crown, Users } from "lucide-react";
import { ProviderSettingsSkeleton } from "@/components/skeletons/ProviderSettingsSkeleton";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  name: string;
  email: string;
  whatsapp?: string;
  description?: string;
  profession?: string;
  paymentMethods?: string[];
}

interface SubscriptionStatus {
  plan: 'FREE' | 'PAID';
  status: string;
  isPaid: boolean;
  currentPeriodEnd?: string;
}

export default function ProviderSettings() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('authToken');
      console.log("token", token)
      const tokenLocalStorage = localStorage.getItem("authToken")
      console.log("tokenLocalStorage", tokenLocalStorage)
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [profileRes, subRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        console.log("subRes", subRes)


        if (!profileRes.ok || !subRes.ok) {
          throw new Error("Falha ao carregar os dados das configurações.");
        }

        const profile = await profileRes.json();
        const subscriptionStatus = await subRes.json();
        setProfileData(profile);
        setSubscription(subscriptionStatus);

      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("subscription", subscription)

  const handleSaveProfile = async () => {
    const token = Cookies.get('authToken');
    if (!token || !profileData) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const payload = {
        profession: profileData.profession,
        description: profileData.description,
        paymentMethods: profileData.paymentMethods,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Falha ao salvar as configurações.");
      }

      alert("Configurações salvas com sucesso!");

    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    const token = Cookies.get('authToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-customer-portal-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert("Erro ao acessar o portal de assinaturas.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
      const token = Cookies.get('authToken');
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        Cookies.remove('authToken');
        localStorage.removeItem('user');
        router.push('/login');
      } catch (error) {
        alert("Erro ao excluir a conta.");
      }
    }
  };

  const switchToClientDashboard = () => {
    router.push("/dashboard/client");
  };

  if (isLoading) {
    return <ProviderSettingsSkeleton />;
  }

  if (apiError) {
    return <div className="p-8">Erro: {apiError}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="md:ml-64">
        <DashboardHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="opacity-0 animate-slide-in-from-bottom">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Configurações</h1>
              <p className="text-muted-foreground text-lg">Gerencie suas informações e preferências</p>
            </div>

            <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#FC9056]" />
                  Aparência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between font-poppins">
                  <div>
                    <h4 className="font-medium">Tema</h4>
                    <p className="text-sm text-muted-foreground">Escolha entre tema claro ou escuro</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#FC9056]" />
                  Mudar de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 font-poppins">
                <div>
                  <h4 className="font-medium">Visualizar como Cliente</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesse o painel do cliente para buscar e agendar serviços.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center bg-transparent"
                  onClick={switchToClientDashboard}
                >
                  Acessar Painel do Cliente
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#FC9056]" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 font-poppins">
                {subscription?.isPaid ? (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">Plano Premium Ativo</h4>
                    <p className="text-sm text-green-600">Próximo pagamento: {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-800">Plano Gratuito</h4>
                    <p className="text-sm text-amber-600">Faça um upgrade para o Premium para ter mais visibilidade!</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  {subscription?.isPaid ? 'Gerenciar Assinatura' : 'Fazer Upgrade'}
                </Button>
              </CardContent>
            </Card>

            <Card className="opacity-0 animate-slide-in-from-bottom animation-delay-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FC9056]" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 font-poppins">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => router.push('/settings/change-password')}>Alterar Senha</Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  onClick={handleDeleteAccount}
                >
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}