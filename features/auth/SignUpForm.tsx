"use client"

import { useState } from "react"
import { ClientSignUp } from "./ClientSignUp"
import { ProviderSignUp } from "./ProviderSignUp"
import { UserTypeSelection } from "./UserTypeSelection"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
  const router = useRouter()
  const [flowStep, setFlowStep] = useState<'selection' | 'client-form' | 'provider-form'>('selection');
  const [selectedType, setSelectedType] = useState<"CLIENT" | "PROVIDER" | null>(null);
  
  const handleSelectType = (type: "CLIENT" | "PROVIDER") => {
    setSelectedType(type);
  };

  const handleContinueWithEmail = () => {
    if (selectedType === 'CLIENT') {
        setFlowStep('client-form');
    } else if (selectedType === 'PROVIDER') {
        setFlowStep('provider-form');
    }
  };

  const handleBackToSelection = () => {
    setFlowStep('selection');
    setSelectedType(null); // Reseta a seleção
  };

  // A lógica do Google Login agora vive no componente pai
  const handleGoogleLogin = () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const googleLoginUrl = `${API_BASE_URL}/api/auth/google`;
    router.push(googleLoginUrl) 
  };

  const renderContent = () => {
    switch (flowStep) {
      case 'client-form':
        return <ClientSignUp onBackToSelection={handleBackToSelection} />;
      case 'provider-form':
        return <ProviderSignUp onBackToSelection={handleBackToSelection} />;
      case 'selection':
      default:
        return (
            <UserTypeSelection 
                onSelectType={handleSelectType} 
                selectedType={selectedType}
                onContinueWithEmail={handleContinueWithEmail}
                handleGoogleLogin={handleGoogleLogin} 
            />
        );
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      {renderContent()}
      <div className="text-center text-sm mt-6">
        <span className="text-muted-foreground">Já tem uma conta? </span>
        <a href="/login" className="text-orange-500 hover:underline font-medium">
          Faça login
        </a>
      </div>
    </div>
  )
}