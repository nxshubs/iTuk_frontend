"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useState, useEffect } from "react"
import SettingsView from "@/features/settings/SettingsView"
import BecomeProviderModal from "@/features/settings/BecomeProviderModal"
import Cookies from "js-cookie"
import { ProviderApplicationData } from "@/types/ProviderApplication"
import { ProfileData } from "@/types/ProfileData"
import SettingsHeader from "@/features/settings/SettingsHeader"
import { apiFetch } from "@/lib/api"
import { SettingsPageSkeleton } from "@/components/skeletons/SettingsPageSkeleton"

export default function ClientSettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [providerData, setProviderData] = useState<ProviderApplicationData>({
    fullName: "", cpf: "", birthDate: "", gender: "", whatsapp: "", phone: "",
    serviceName: "", hourlyRate: "", paymentMethods: [], description: "",
    street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
    useCurrentLocation: false,
  });
  const [providerPhotoFile, setProviderPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = Cookies.get('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setProfileData(userData);
          setProviderData(prev => ({
            ...prev,
            fullName: userData.name || '',
            whatsapp: userData.whatsapp || '',
            phone: userData.telephone || ''
          }));
        }
      } catch (error) {
        console.error("Falha ao buscar perfil", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleProviderSubmit = async () => {
    setIsSubmitting(true);
    const token = Cookies.get('authToken');
    const formData = new FormData();

    const services = [{
      name: providerData.serviceName,
      price: parseFloat(providerData.hourlyRate) || 0,
      durationInMinutes: 60
    }];

    // Adiciona todos os campos ao FormData
    formData.append('fullName', providerData.fullName);
    formData.append('cpf', providerData.cpf);
    formData.append('birthDate', providerData.birthDate);
    formData.append('gender', providerData.gender);
    formData.append('whatsapp', providerData.whatsapp);
    formData.append('telephone', providerData.phone);
    formData.append('description', providerData.description);
    formData.append('paymentMethods', JSON.stringify(providerData.paymentMethods));
    formData.append('services', JSON.stringify(services));
    const fullAddress = [providerData.street, providerData.number, providerData.complement, providerData.neighborhood, `${providerData.city} - ${providerData.state}`, providerData.zipCode].filter(Boolean).join(', ');
    formData.append('address', fullAddress);

    if (providerPhotoFile) {
      formData.append('profilePhoto', providerPhotoFile);
    }


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/complete-profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Falha ao enviar solicitação.");
      }

      const { user, token: newToken } = await response.json();
      Cookies.set('authToken', newToken, { expires: 1 });
      setProfileData(user);
      alert("Parabéns! Você agora é um prestador de serviços.");
      setIsProviderModalOpen(false);
      setCurrentStep(1);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProvider = profileData?.role === 'PROVIDER';

  if (isLoading) {
    return <SettingsPageSkeleton />;
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
            <SettingsHeader />
            <SettingsView isProvider={isProvider} onOpenProviderModal={() => setIsProviderModalOpen(true)} />
            <div className="opacity-0 animate-slide-in-from-bottom animation-delay-700">
              <Button onClick={() => alert("Lógica de salvar configurações gerais aqui")} className="w-full bg-[#FC9056] hover:bg-[#ff8340] text-white">
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </main>
      </div>
      <BecomeProviderModal
        isOpen={isProviderModalOpen}
        onOpenChange={setIsProviderModalOpen}
        currentStep={currentStep}
        totalSteps={totalSteps}
        providerData={providerData}
        setProviderData={setProviderData}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={handleProviderSubmit}
        isSubmitting={isSubmitting}
        onFileChange={(e) => setProviderPhotoFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}