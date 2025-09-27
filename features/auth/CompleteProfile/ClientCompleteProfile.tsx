"use client";

import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

import { ClientStep2 } from "@/features/auth/signUpForms/client/ClientStep2";
import { CompleteProfileSkeleton } from "@/components/skeletons/CompleteProfileSkeleton";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  birthDate?: string | null;
  gender?: string | null;
  whatsapp?: string | null;
}

export function ClientCompleteProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    birthDate: "",
    gender: "",
    whatsapp: "",
    profilePhoto: null as File | null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = Cookies.get('authToken');
      if (!token) {
        setApiError("Autenticação não encontrada. Por favor, faça login novamente.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar os dados do usuário.");
        }

        const userData: UserProfile = await response.json();
        const birthDate = userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : "";

        setFormData(prev => ({
          ...prev,
          email: userData.email || '',
          name: userData.name || '',
          birthDate: birthDate,
          gender: userData.gender || '',
          whatsapp: userData.whatsapp || ''
        }));
        setPreviewUrl(userData.photoUrl);

      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || apiError) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setApiError(null);
    }
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "O nome completo é obrigatório.";
    if (!formData.birthDate) newErrors.birthDate = "A data de nascimento é obrigatória.";
    if (!formData.gender) newErrors.gender = "O sexo é obrigatório.";
    if (!formData.whatsapp) newErrors.whatsapp = "O WhatsApp é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError(null);

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      // 1. Verifica a unicidade do WhatsApp antes de submeter
      const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-uniqueness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ field: 'whatsapp', value: formData.whatsapp })
      });

      const checkResult = await checkResponse.json();
      if (!checkResponse.ok || !checkResult.isAvailable) {
        setErrors(prev => ({ ...prev, whatsapp: "Este número de WhatsApp já está em uso." }));
        setIsSubmitting(false);
        return;
      }

      const submissionData = new FormData();

      if (formData.profilePhoto) {
        submissionData.append("profilePhoto", formData.profilePhoto);
      }

      submissionData.append("name", formData.name);
      submissionData.append("whatsapp", formData.whatsapp);
      submissionData.append("birthDate", formData.birthDate);
      submissionData.append("gender", formData.gender);

      // 2. Submete os dados completos para a rota de atualização
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/client/me`, {
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

      alert("Perfil completado com sucesso! Redirecionando para o dashboard...");
      window.location.href = "/dashboard/client";

    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isLoading ? (
        <CompleteProfileSkeleton />
      ) : (
        <Card>
          <CardContent className="p-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <ClientStep2
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                previewUrl={previewUrl}
                handleFileSelect={handleFileSelect}
                handleRemovePhoto={handleRemovePhoto}
              />

              {apiError && <p className="text-red-500 text-center text-sm mt-4">{apiError}</p>}

              <div className="flex justify-end items-center pt-8 font-poppins">
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

