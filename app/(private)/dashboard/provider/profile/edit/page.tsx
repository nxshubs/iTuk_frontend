"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import { toast } from "sonner";

// Imports de Layout
import SidebarMenu from "@/components/shared/SidebarMenu";
import DashboardHeader from "@/components/shared/DashboardHeader";

// Imports de UI e Ícones
import { Button } from "@/components/ui/button"
import { Save, ArrowLeft } from "lucide-react"

// Imports dos Componentes da Página
import BasicInformations from "@/features/editProfile/BasicInformations"
import Biography from "@/features/editProfile/Biography"
import Services from "@/features/editProfile/Services"
import Schedules from "@/features/editProfile/Schedules"
import PaymentMethods from "@/features/editProfile/PaymentMethods"
import Gallery from "@/features/editProfile/Gallery"
import LocalizationAndPrice from "@/features/editProfile/LocalizationAndPrice"
import ProfilePictureEditor from "@/features/editProfile/ProfilePictureEditor";
import { EditProfileSkeleton } from "@/components/skeletons/EditProfileSkeleton"

// Imports de Tipos
import { Provider } from "@/types/Provider";
import { Service } from "@/types/Service"
import { useUser } from "@/hooks/useUser";

export default function EditProfilePage() {
    const router = useRouter();
    const { refetchUser } = useUser();

    // Estado para o layout
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estados da página
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<Provider | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('authToken');
            const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 1000));

            if (!token) {
                router.push('/login');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error("Falha ao carregar os dados do perfil.");
                }
                const userData = await response.json();
                setProfileData(userData);
            } catch (error: any) {
                setApiError(error.message);
                toast.error(error.message);
            } finally {
                await minLoadingPromise;
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [router]);

    const handleInputChange = (field: keyof Provider, value: any) => {
        setProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const handleImageSelect = (file: File, previewUrl: string) => {
        setProfileImageFile(file);
        handleInputChange('photoUrl', previewUrl);
    };

    const handleAddService = (newService: Omit<Service, 'id'>) => {
        if (!profileData) return;
        const serviceToAdd = { id: `new-${Date.now()}`, ...newService };
        handleInputChange('services', [...profileData.services, serviceToAdd]);
    };

    const handleRemoveService = (serviceId: string) => {
        if (!profileData) return;
        handleInputChange('services', profileData.services.filter(s => s.id !== serviceId));
    };

    const handleUpdateService = (serviceId: string, updatedFields: Partial<Service>) => {
        if (!profileData) return;
        handleInputChange('services', profileData.services.map(s => s.id === serviceId ? { ...s, ...updatedFields } : s));
    };
    
    const togglePaymentMethod = (method: string) => {
        if (!profileData) return;
        const currentMethods = profileData.paymentMethods || [];
        const newMethods = currentMethods.includes(method)
            ? currentMethods.filter((m) => m !== method)
            : [...currentMethods, method];
        handleInputChange("paymentMethods", newMethods);
    };
    
    const handleAddImageToGallery = (imageUrl: string) => {
        if (!profileData) return;
        const newImage = { id: `new-${Date.now()}`, imageUrl };
        const currentPortfolio = profileData.portfolio || [];
        handleInputChange("portfolio", [...currentPortfolio, newImage]);
    };
    
    const removeGalleryImage = (id: string) => {
        if (!profileData) return;
        const currentPortfolio = profileData.portfolio || [];
        handleInputChange("portfolio", currentPortfolio.filter(image => image.id !== id));
    };

    const handleSaveGallery = async () => {
        const token = Cookies.get('authToken');
        if (!profileData || !profileData.portfolio) return;
        
        const portfolioPayload = {
            portfolio: profileData.portfolio.map(({ id, imageUrl }) => ({
                id: id.startsWith('new-') ? undefined : id,
                imageUrl: imageUrl,
            }))
        };
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(portfolioPayload)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Falha ao salvar a galeria.");
            }
        } catch (error: any) {
            toast.error(error.message);
            throw error;
        }
    };

    const handleSave = async () => {
        const token = Cookies.get('authToken');
        if (!profileData) return;
        setIsSaving(true);
        setApiError(null);

        const isFormData = !!profileImageFile;
        let body;
        const headers: HeadersInit = { 'Authorization': `Bearer ${token}` };

        if (isFormData) {
            const formData = new FormData();
            if (profileImageFile) {
                formData.append('profilePhoto', profileImageFile);
            }
            
            formData.append('name', profileData.name || '');
            formData.append('whatsapp', profileData.whatsapp || '');
            formData.append('telephone', profileData.telephone || '');
            formData.append('profession', profileData.services[0]?.name || '');
            formData.append('description', profileData.description || '');
            formData.append('address', profileData.address || '');
            formData.append('experience', profileData.experience || '');
            formData.append('paymentMethods', JSON.stringify(profileData.paymentMethods || []));
            formData.append('services', JSON.stringify(profileData.services || []));
            formData.append('availability', JSON.stringify(profileData.availability || []));
            formData.append('portfolio', JSON.stringify(profileData.portfolio || []));
            
            body = formData;
        } else {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({
                ...profileData,
                profession: profileData.services[0]?.name || ''
            });
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/profile`, {
                method: 'PATCH',
                headers: headers,
                body: body
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || "Falha ao salvar as alterações.");
            }

            await refetchUser();
            toast.success("Perfil atualizado com sucesso!");
            router.push("/dashboard/provider/profile");

        } catch (error: any) {
            setApiError(error.message);
            toast.error(`Erro ao salvar: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const renderPageContent = () => {
        if (apiError || !profileData) {
            return <div className="p-8 text-center text-red-500">Erro: {apiError || "Dados não encontrados."}</div>;
        }

        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Perfil</h1>
                        <p className="text-muted-foreground">Atualize suas informações e foto.</p>
                    </div>
                </div>
                <BasicInformations
                    profileData={profileData}
                    handleInputChange={handleInputChange}
                    onImageSelect={handleImageSelect} 
                />
                <LocalizationAndPrice
                    handleInputChange={handleInputChange}
                    profileData={profileData}
                />
                <Biography 
                    profileData={profileData} 
                    handleInputChange={handleInputChange} 
                />
                <Services
                    services={profileData.services}
                    onAddService={handleAddService}
                    onRemoveService={handleRemoveService}
                    onUpdateService={handleUpdateService}
                />
                <Schedules
                    availability={profileData.availability}
                />
                <PaymentMethods
                    paymentMethods={profileData.paymentMethods}
                    onToggleMethod={togglePaymentMethod}
                    paymentOptions={["PIX", "Cartão de Crédito", "Dinheiro", "Cartão de Débito"]}
                />
                <Gallery
                    gallery={profileData.portfolio || []}
                    onAddImage={handleAddImageToGallery}
                    onRemoveImage={removeGalleryImage}
                    onSaveProfile={handleSaveGallery}
                />
                <div className="flex gap-4 justify-end pt-4">
                    <Button variant="outline" onClick={() => router.push("/dashboard/provider/profile")}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-[#FC9056] hover:bg-[#FC9056]/90">
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <SidebarMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
            <div className="md:ml-64">
                <DashboardHeader
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <main className="p-6 lg:p-8">
                    {isLoading ? <EditProfileSkeleton /> : renderPageContent()}
                </main>
            </div>
        </div>
    );
}