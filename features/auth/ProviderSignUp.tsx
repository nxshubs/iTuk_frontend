"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, RefreshCw } from "lucide-react";

import { ProviderStep1 } from "./signUpForms/provider/ProviderStep1";
import { ProviderStep2 } from "./signUpForms/provider/ProviderStep2";
import { ProviderStep3 } from "./signUpForms/provider/ProviderStep3";
import { ProviderStep4 } from "./signUpForms/provider/ProviderStep4";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";


export function ProviderSignUp({ onBackToSelection }: { onBackToSelection: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    name: "", birthDate: "", gender: "", whatsapp: "", profilePhoto: null as File | null,
    services: [] as string[], prices: {} as Record<string, string>, paymentMethods: [] as string[], bio: "",
    street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "",
    otherService: ""
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || apiError) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setApiError(null);
    }
  };

  const toggleArrayItem = (field: "services" | "paymentMethods", item: string) => {
    setFormData((prev) => {
      const currentItems = prev[field] as string[];
      const newItems = currentItems.includes(item)
        ? currentItems.filter((i) => i !== item)
        : [...currentItems, item];
      return { ...prev, [field]: newItems };
    });
  };

  const handleFileSelect = (file: File) => {
    setFormData((prev) => ({ ...prev, profilePhoto: file }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, any> = {};
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
      if (!formData.password) newErrors.password = "A senha é obrigatória.";
      else if (formData.password.length < 8) newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
    } else if (currentStep === 2) {
      if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
      if (!formData.birthDate) newErrors.birthDate = "A data de nascimento é obrigatória.";
      if (!formData.gender) newErrors.gender = "O sexo é obrigatório.";
      if (!formData.whatsapp) newErrors.whatsapp = "O WhatsApp é obrigatório.";
      if (!formData.profilePhoto) newErrors.profilePhoto = "A foto de perfil é obrigatória.";
    } else if (currentStep === 3) {
      if (formData.services.length === 0) newErrors.services = "Selecione pelo menos um serviço.";
      if (formData.services.includes('Outro') && !formData.otherService.trim()) newErrors.otherService = "Descreva o serviço oferecido.";
      const servicesThatNeedPrice = formData.services.filter(s => s !== 'Outro');
      if (servicesThatNeedPrice.length > 0) {
        const missingPrices = servicesThatNeedPrice.filter(s => !formData.prices[s] || !formData.prices[s].trim());
        if (missingPrices.length > 0) newErrors.prices = "Defina o preço para todos os serviços selecionados.";
      }
      if (formData.paymentMethods.length === 0) newErrors.paymentMethods = "Selecione pelo menos uma forma de pagamento.";
    } else if (currentStep === 4) {
      if (!formData.street) newErrors.street = "A rua é obrigatória.";
      if (!formData.number) newErrors.number = "O número é obrigatório.";
      if (!formData.neighborhood) newErrors.neighborhood = "O bairro é obrigatório.";
      if (!formData.city) newErrors.city = "A cidade é obrigatória.";
      if (!formData.state) newErrors.state = "O estado é obrigatório.";
      if (!formData.zipCode) newErrors.zipCode = "O CEP é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === 1) {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-unverified`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error);
        }

        if (result.status === 'NEEDS_VERIFICATION') {
          localStorage.setItem('emailForVerification', formData.email);
          window.location.href = '/verify-email';
          return;
        }

        if (result.status === 'ALREADY_EXISTS') {
          setApiError('Este e-mail já está cadastrado e verificado. Por favor, faça login.');
          return;
        }

        setCurrentStep(currentStep + 1);

      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep < totalSteps) {
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
    setIsLoading(true);
    setApiError(null);

    try {
      let photoUrl = "https://placehold.co/150x150/orange/white?text=Provider";
      if (formData.profilePhoto) {
      }

      const profession = formData.services.includes('Outro') ? formData.otherService : formData.services[0];
      const servicePrice = parseFloat(Object.values(formData.prices)[0]?.replace(',', '.') || '0');

      const payload = {
        role: "PROVIDER",
        email: formData.email,
        password: formData.password,
        name: formData.name,
        photoUrl,
        birthDate: formData.birthDate,
        gender: formData.gender,
        whatsapp: formData.whatsapp,
        profession: profession,
        servicePrice: servicePrice,
        paymentMethods: formData.paymentMethods,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        complement: formData.complement,
        description: formData.bio,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Ocorreu um erro ao criar a conta.");
      }

      localStorage.setItem('emailForVerification', payload.email);

      toast.success("Conta de prestador criada com sucesso! Redirecionando para verificação de e-mail...");
      window.location.href = "/verify-email";

    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      {renderStepIndicator()}
      <Card>
        <CardContent className="p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <ProviderStep1 {...{ formData, errors, handleInputChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }} />}
            {currentStep === 2 && <ProviderStep2 {...{ formData, errors, handleInputChange, previewUrl, handleFileSelect, handleRemovePhoto }} />}
            {currentStep === 3 && <ProviderStep3 {...{ formData, errors, handleInputChange, toggleArrayItem }} />}
            {currentStep === 4 && <ProviderStep4 {...{ formData, errors, handleInputChange }} />}

            {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}

            <div className="flex justify-between items-center pt-8 font-poppins">
              <Button className="cursor-pointer" type="button" variant="outline" onClick={currentStep > 1 ? handlePrevious : onBackToSelection}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep > 1 ? 'Voltar' : 'Trocar Tipo'}
              </Button>
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-[#FC9056] hover:bg-[#ff823f] text-white cursor-pointer"
                >
                  {isLoading && currentStep === 1 ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-[#FC9056] hover:bg-[#ff823f] text-white font-poppins cursor-pointer">
                  {isLoading ? "Criando conta..." : "Finalizar Cadastro"}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

