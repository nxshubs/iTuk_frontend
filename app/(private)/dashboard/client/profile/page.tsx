"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import ClientProfileView from "@/features/profile/client/ClientProfileView"
import Cookies from "js-cookie"
import { ProfileData } from "@/types/ProfileData"
import { toast } from "sonner"
import { ClientProfileSkeleton } from "@/components/skeletons/ClientProfileSkeleton" // Importado o novo skeleton

export default function ClientProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); // Adicionado estado de erro

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null); // Reseta o erro a cada nova busca
      const token = Cookies.get('authToken');

      if (!token) {
        setError("Token de autenticação não encontrado.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do perfil.");
        }

        const userData: ProfileData = await response.json();
        setProfileData(userData);

      } catch (error) {
        setError((error as Error).message); // Define o erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGoogleConnect = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/connect`;
  };

  const handleSave = async () => {
    if (!profileData) return;
    setIsSaving(true);
    const token = Cookies.get('authToken');

    const formData = new FormData();

    const dataToUpdate = {
      name: profileData.name,
      email: profileData.email,
      telephone: profileData.telephone,
      whatsapp: profileData.whatsapp,
    };

    Object.entries(dataToUpdate).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (photoFile) {
      formData.append('profilePhoto', photoFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/client/me`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao atualizar o perfil.");
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      setPhotoFile(null);
      setPhotoPreview(null);

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error((error as Error).message || "Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <ClientProfileSkeleton />;
    }

    if (error || !profileData) {
      return <div className="text-center text-red-500">{error || "Não foi possível carregar o perfil."}</div>;
    }

    return (
      // Removidas as classes de animação
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground text-lg font-poppins">
            Gerencie suas informações pessoais e tipo de conta
          </p>
        </div>

        <ClientProfileView
          profileData={profileData}
          setProfileData={setProfileData}
          isGoogleConnected={!!profileData.googleId}
          onGoogleConnect={handleGoogleConnect}
          photoPreview={photoPreview}
          onFileChange={handleFileChange}
        />

        <div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#FC9056] hover:bg-[#fc8343] text-white cursor-pointer font-poppins">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="md:ml-64">
        <DashboardHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
