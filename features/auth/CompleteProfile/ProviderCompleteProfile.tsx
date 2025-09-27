"use client";

import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";

import { ProviderStep2 } from "@/features/auth/signUpForms/provider/ProviderStep2";
import { ProviderStep3 } from "@/features/auth/signUpForms/provider/ProviderStep3";
import { ProviderStep4 } from "@/features/auth/signUpForms/provider/ProviderStep4";
import { CompleteProfileSkeleton } from "@/components/skeletons/CompleteProfileSkeleton"; // 👈 Importe o Skeleton
import { apiFetch } from "@/lib/api";

interface UserProfile {
    name: string;
    email: string;
    photoUrl: string;
    birthDate?: string;
    gender?: string;
    whatsapp?: string;
    profession?: string;
    description?: string;
    address?: string;
    paymentMethods?: string[];
    services?: { name: string, price: number }[];
}

export function ProviderCompleteProfile() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isFetchingData, setIsFetchingData] = useState(true); // 👈 Novo estado para o carregamento inicial
    const [isSubmitting, setIsSubmitting] = useState(false); // 👈 Renomeado de `isLoading`
    const [isChecking, setIsChecking] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [apiError, setApiError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "", name: "",
        birthDate: "", gender: "", whatsapp: "", profilePhoto: null as File | null,
        services: [] as string[], prices: {} as Record<string, string>, paymentMethods: [] as string[], bio: "",
        street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
        otherService: "",
        profession: "",
        address: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('authToken');
            if (!token) {
                setApiError("Autenticação não encontrada. Por favor, faça login novamente.");
                setIsFetchingData(false); // 👈 Finaliza o carregamento
                return;
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Falha ao buscar os dados do usuário.");

                const userData: UserProfile = await response.json();

                setFormData(prev => {
                    const birthDate = userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : "";

                    let addressParts = { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '', complement: '' };
                    if (userData.address) {
                        const parts = userData.address.split(', ');
                        addressParts.street = parts[0] || '';
                        addressParts.number = parts[1] || '';
                        addressParts.neighborhood = parts[2] || '';
                        const cityStateZip = (parts[3] || '').split(' - ');
                        addressParts.city = cityStateZip[0] || '';
                        const stateZip = (cityStateZip[1] || '').split(', ');
                        addressParts.state = stateZip[0] || '';
                        addressParts.zipCode = stateZip[1] || '';
                    }

                    const services = userData.services?.map(s => s.name) || [];
                    const prices = userData.services?.reduce((acc, s) => {
                        acc[s.name] = String(s.price);
                        return acc;
                    }, {} as Record<string, string>) || {};

                    return {
                        ...prev,
                        email: userData.email,
                        name: userData.name,
                        birthDate: birthDate,
                        gender: userData.gender || '',
                        whatsapp: userData.whatsapp || '',
                        profession: userData.profession || '',
                        bio: userData.description || '',
                        paymentMethods: userData.paymentMethods || [],
                        services: services,
                        prices: prices,
                        ...addressParts
                    };
                });
                setPreviewUrl(userData.photoUrl);

            } catch (error: any) {
                setApiError(error.message);
            } finally {
                setIsFetchingData(false); // 👈 Finaliza o carregamento
            }
        };
        fetchUserData();
    }, []);

    // ... O resto dos seus handlers e lógicas permanecem os mesmos
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const totalSteps = 3;

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
        if (apiError) {
            setApiError(null);
        }
    };
    const toggleArrayItem = (field: "services" | "paymentMethods", item: string) => {
        setFormData((prev) => {
            const currentItems = prev[field] as string[];
            const newItems = currentItems.includes(item) ? currentItems.filter((i) => i !== item) : [...currentItems, item];
            return { ...prev, [field]: newItems };
        });
    };
    const handleFileSelect = (file: File) => {
        setFormData((prev) => ({ ...prev, profilePhoto: file }));
        if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
    };
    const handleRemovePhoto = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: null }));
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const validateStep = () => {
        const newErrors: Record<string, any> = {};
        if (currentStep === 1) {
            if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
            if (!formData.birthDate) newErrors.birthDate = "A data de nascimento é obrigatória.";
            if (!formData.gender) newErrors.gender = "O sexo é obrigatório.";
            if (!formData.whatsapp) newErrors.whatsapp = "O WhatsApp é obrigatório.";
        } else if (currentStep === 2) {
            if (formData.services.length === 0) newErrors.services = "Selecione pelo menos um serviço.";
        } else if (currentStep === 3) {
            if (!formData.street) newErrors.street = "A rua é obrigatória.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateStep()) return;

        if (currentStep === 1) {
            setIsChecking(true);
            setApiError(null);
            setErrors(prev => ({ ...prev, whatsapp: undefined }));
            const token = Cookies.get('authToken');

            if (!token) {
                setApiError("Sessão não encontrada no cookie. Por favor, faça login novamente.");
                setIsChecking(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-uniqueness`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        field: 'whatsapp',
                        value: formData.whatsapp
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    const errorMessage = result.error || "Ocorreu um erro no servidor.";
                    if (response.status === 401) {
                        setApiError(`Erro de autenticação (401): ${errorMessage}. Verifique se o token é válido e se a sua sessão não expirou.`);
                    } else {
                        setApiError(`Erro ${response.status}: ${errorMessage}`);
                    }
                    setIsChecking(false);
                    return;
                }

                if (!result.isAvailable) {
                    setErrors(prev => ({ ...prev, whatsapp: "Este número de WhatsApp já está em uso." }));
                    setIsChecking(false);
                    return;
                }

                setCurrentStep(currentStep + 1);

            } catch (error) {
                setApiError("Falha na comunicação com o servidor. Verifique sua conexão e tente novamente.");
            } finally {
                setIsChecking(false);
            }
        }
        else if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        setApiError(null);

        try {
            const token = Cookies.get('authToken');
            const submissionData = new FormData();

            if (formData.profilePhoto) {
                submissionData.append("profilePhoto", formData.profilePhoto);
            }

            const profession = formData.services.includes('Outro') ? formData.otherService : formData.services[0] || '';
            const address = `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ''}, ${formData.neighborhood}, ${formData.city} - ${formData.state}, ${formData.zipCode}`;

            const servicesToSubmit = formData.services.map(s => ({
                name: s,
                price: parseFloat(formData.prices[s]?.replace(',', '.') || '0'),
                durationInMinutes: 60
            }));

            submissionData.append("name", formData.name);
            submissionData.append("whatsapp", formData.whatsapp);
            submissionData.append("birthDate", formData.birthDate);
            submissionData.append("gender", formData.gender);
            submissionData.append("profession", profession);
            submissionData.append("description", formData.bio);
            submissionData.append("address", address);
            submissionData.append("paymentMethods", JSON.stringify(formData.paymentMethods));
            submissionData.append("services", JSON.stringify(servicesToSubmit));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider/complete-profile`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: submissionData,
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Ocorreu um erro ao atualizar o perfil.");
            }

            if (result.token) {
                Cookies.set('authToken', result.token, { expires: 1, path: '/' });
            }

            alert("Perfil completado com sucesso!");
            window.location.href = "/dashboard/provider";

        } catch (error: any) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step <= currentStep ? "bg-[#FC9056] text-white" : "bg-gray-200 text-gray-500"}`}>
                        {step < currentStep ? <Check className="w-5 h-5" /> : step}
                    </div>
                    {step < totalSteps && <div className={`w-12 h-1 mx-2 transition-all ${step < currentStep ? "bg-[#FC9056]" : "bg-gray-200"}`} />}
                </div>
            ))}
        </div>
    );

    // 👈 Adicione esta verificação para mostrar o skeleton
    if (isFetchingData) {
        return <CompleteProfileSkeleton />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {renderStepIndicator()}
            <Card>
                <CardContent className="p-8">
                    <form onSubmit={(e) => e.preventDefault()}>
                        {currentStep === 1 && <ProviderStep2 formData={formData} errors={errors} handleInputChange={handleInputChange} previewUrl={previewUrl} handleFileSelect={handleFileSelect} handleRemovePhoto={handleRemovePhoto} />}
                        {currentStep === 2 && <ProviderStep3 formData={formData} errors={errors} handleInputChange={handleInputChange} toggleArrayItem={toggleArrayItem} />}
                        {currentStep === 3 && <ProviderStep4 formData={formData} errors={errors} handleInputChange={handleInputChange} />}

                        {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}

                        <div className="flex justify-between items-center pt-8 font-poppins">
                            {currentStep > 1 ? (
                                <Button className="cursor-pointer" type="button" variant="outline" onClick={handlePrevious}>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar
                                </Button>
                            ) : <div></div>}

                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={handleNext} disabled={isChecking} className="bg-[#FC9056] hover:bg-[#ff823f] text-white cursor-pointer">
                                    {isChecking ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            Próximo <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="bg-[#FC9056] hover:bg-[#ff823f] text-white font-poppins cursor-pointer">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            Finalizar Cadastro
                                            <Check className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
