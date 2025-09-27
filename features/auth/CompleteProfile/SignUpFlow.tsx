"use client"

import { useState } from "react";
import { UserTypeSelection } from "../UserTypeSelection";
import { ClientSignUp } from "../ClientSignUp";
import { ProviderSignUp } from "../ProviderSignUp";
import { ClientCompleteProfile } from "./ClientCompleteProfile";
import { ProviderCompleteProfile } from "./ProviderCompleteProfile";
import { UserTypeSelectionCompleteProfile } from "./UserTypeSelectionCompleteProfile";

export default function SignupFlow() {
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
    setSelectedType(null);
  };

  const handleGoogleLogin = () => {
    if (!selectedType) {
      alert("Por favor, selecione um tipo de conta.");
      return;
    }
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
    const googleLoginUrl = `${API_BASE_URL}/api/auth/google?role=${selectedType}`;
    window.location.href = googleLoginUrl;
  };

  const renderContent = () => {
    switch (flowStep) {
      case 'client-form':
        return <ClientCompleteProfile />;
      case 'provider-form':
        return <ProviderCompleteProfile />;
      case 'selection':
      default:
        return (
          <UserTypeSelectionCompleteProfile
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