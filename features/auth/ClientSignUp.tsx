"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check, RefreshCw } from "lucide-react";
import { ClientStep1 } from "./signUpForms/client/ClientStep1";
import { ClientStep2 } from "./signUpForms/client/ClientStep2";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export function ClientSignUp({ onBackToSelection }: { onBackToSelection: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthDate: "",
    gender: "",
    whatsapp: "",
    profilePhoto: null as File | null,
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const totalSteps = 2;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || apiError) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setApiError(null);
    }
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
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.email) newErrors.email = "O e-mail é obrigatório.";
      if (!formData.password) newErrors.password = "A senha é obrigatória.";
      else if (formData.password.length < 8)
        newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "As senhas não coincidem.";
    } else if (currentStep === 2) {
      if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
      if (!formData.birthDate)
        newErrors.birthDate = "A data de nascimento é obrigatória.";
      if (!formData.gender) newErrors.gender = "O sexo é obrigatório.";
      if (!formData.whatsapp) newErrors.whatsapp = "O WhatsApp é obrigatório.";
      if (!formData.profilePhoto)
        newErrors.profilePhoto = "A foto de perfil é obrigatória.";
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
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: "CLIENT"
          }),
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

        // Novo caso: O email existe para um tipo de conta diferente
        if (result.status === 'ROLE_MISMATCH') {
          setApiError('Este e-mail já iniciou um registo como Prestador. Por favor, use outro e-mail ou complete o registo original.');
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
      let photoUrl = "https://placehold.co/150x150/orange/white?text=User";
      if (formData.profilePhoto) {
        // Lógica de upload da foto aqui, se necessário.
        // Por enquanto, usaremos o placeholder.
      }

      const payload = {
        role: "CLIENT",
        ...formData,
        photoUrl: photoUrl,
      };
      delete (payload as any).profilePhoto;
      delete (payload as any).confirmPassword;

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

      toast.success("Conta criada com sucesso! Um e-mail de verificação foi enviado.");
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
            {currentStep === 1 && <ClientStep1 {...{ formData, errors, handleInputChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }} />}
            {currentStep === 2 && <ClientStep2 {...{ formData, errors, handleInputChange, previewUrl, handleFileSelect, handleRemovePhoto }} />}

            {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}

            <div className="flex justify-between items-center pt-8 font-poppins">
              <Button type="button" variant="outline" onClick={currentStep > 1 ? handlePrevious : onBackToSelection} className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentStep > 1 ? 'Voltar' : 'Trocar Tipo'}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-[#FC9056] hover:bg-[#ff8441] text-white cursor-pointer"
                >
                  {isLoading ? (
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
                <Button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-[#FC9056] hover:bg-[#ff8441] text-white cursor-pointer">
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

