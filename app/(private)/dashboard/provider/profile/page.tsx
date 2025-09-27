"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import DashboardHeader from "@/components/shared/DashboardHeader"
import SidebarMenu from "@/components/shared/SidebarMenu"
import { Essential } from "@/features/profile/provider/Essential"
// import ProviderStats from "@/features/profile/ProviderStats"
import About from "@/features/profile/provider/About"
import OferedServices from "@/features/profile/provider/OferedServices"
import ServicesDescription from "@/features/profile/provider/ServicesDescription"
import Avaliability from "@/features/profile/provider/Avaliability"
import Localization from "@/features/profile/provider/Localization"
import Reviews from "@/features/profile/provider/Reviews"
import Portfolio from "@/features/profile/provider/Portfolio"
import { ProviderUserProfileSkeleton } from "@/components/skeletons/ProviderUserProfileSkeleton"
import { apiFetch } from "@/lib/api"


interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
        name: string;
        photoUrl: string;
    };
}

interface availability {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    providerId: string
}

export interface PortfolioImage {
    id: string;
    imageUrl: string;
}

export interface UserProfileData {
    id: string;
    email: string;
    telephone: string;
    name: string;
    profession: string;
    address: string;
    photoUrl: string;
    whatsapp: string;
    description: string;
    services: Service[];
    experience: string;
    completedJobs: number;
    portfolio: PortfolioImage[];
    paymentMethods: string[];
    reviewsReceived: Review[];
    availability: availability[]
}

export default function UserProfile() {
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [profileData, setProfileData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = Cookies.get('authToken');
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
                    throw new Error("Falha ao buscar os dados do perfil.");
                }

                const profile: UserProfileData = await response.json();
                console.log("Perfil recebido:", profile);
                setProfileData(profile);

            } catch (error: any) {
                setApiError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (isLoading) {
        return <ProviderUserProfileSkeleton />;
    }

    if (apiError || !profileData) {
        return <div className="p-8 text-center text-red-500">Erro ao carregar o perfil: {apiError || "Dados não encontrados."}</div>;
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex flex-col flex-1 md:ml-64">
                <DashboardHeader
                    onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        <div className="mb-6 opacity-0 animate-slide-in-from-bottom">
                            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Meu Perfil</h1>
                            <p className="text-muted-foreground text-lg">Gerencie suas informações profissionais</p>
                        </div>

                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-100">
                            <Essential profileData={profileData} />
                        </div>
                        {/* <ProviderStats profileData={profileData} /> */}
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-200">
                            <About profileData={profileData} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-300">
                            <OferedServices profileData={profileData} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-400">
                            <ServicesDescription profileData={profileData} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-500">
                            <Avaliability profileData={profileData} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-600">
                            <Localization profileData={profileData} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-700">
                            <Reviews reviews={profileData.reviewsReceived} />
                        </div>
                        <div className="opacity-0 animate-slide-in-from-bottom animation-delay-800">
                            <Portfolio profileData={profileData} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

