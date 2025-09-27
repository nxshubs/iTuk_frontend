"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import ClientProfileView from "@/features/profile/client/ClientProfileView"
import Cookies from "js-cookie"
import { ProfileData } from "@/types/ProfileData"
import { apiFetch } from "@/lib/api"

export default function ClientProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = Cookies.get('authToken');

      if (!token) {
        console.error("Token de autenticação não encontrado.");
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
        console.log("userData", userData)
        setProfileData(userData);

      } catch (error) {
        console.error(error);
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

  // PREENCHIDO: Função para salvar os dados com FormData
  const handleSave = async () => {
    if (!profileData) return;
    setIsSaving(true);
    const token = Cookies.get('authToken');

    const formData = new FormData();

    // Cria um objeto com os nomes de campos corretos para o backend
    const dataToUpdate = {
      name: profileData.name,
      email: profileData.email,
      telephone: profileData.telephone,
      whatsapp: profileData.whatsapp,
    };

    // Adiciona os campos corretos ao FormData
    Object.entries(dataToUpdate).forEach(([key, value]) => {
      if (value !== null) {
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

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Ocorreu um erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !profileData) {
    return <div className="flex justify-center items-center h-screen">Carregando perfil...</div>;
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
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Meu Perfil</h1>
              <p className="text-muted-foreground text-lg font-poppins">
                Gerencie suas informações pessoais e tipo de conta
              </p>
            </div>

            <ClientProfileView
              profileData={profileData}
              setProfileData={setProfileData}
              isGoogleConnected={!!profileData.googleId}
              onGoogleConnect={() => alert("Lógica de conexão com Google aqui")}
              photoPreview={photoPreview}
              onFileChange={handleFileChange}
            />

            <div className="opacity-0 animate-slide-in-from-bottom animation-delay-300">
              <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#FC9056] hover:bg-[#fc8343] text-white cursor-pointer font-poppins">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}