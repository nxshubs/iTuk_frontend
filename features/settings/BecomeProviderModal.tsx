"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import Step1_PersonalData from "./steps/Step1_PersonalData"
import Step2_Services from "./steps/Step2_Service"
import Step3_Address from "./steps/Step3_Address"
import Step4_Location from "./steps/Step4_Location"
import { ProviderApplicationData } from "@/types/ProviderApplication"

interface BecomeProviderModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentStep: number;
  totalSteps: number;
  providerData: ProviderApplicationData;
  setProviderData: React.Dispatch<React.SetStateAction<ProviderApplicationData>>;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BecomeProviderModal({
  isOpen,
  onOpenChange,
  currentStep,
  totalSteps,
  providerData,
  setProviderData,
  nextStep,
  prevStep,
  onSubmit,
  isSubmitting,
  onFileChange,
}: BecomeProviderModalProps) {

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1_PersonalData data={providerData} setData={setProviderData} onFileChange={onFileChange} />;
      case 2: return <Step2_Services data={providerData} setData={setProviderData} />;
      case 3: return <Step3_Address data={providerData} setData={setProviderData} />;
      case 4: return <Step4_Location data={providerData} setData={setProviderData} />;
      default: return null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#FC9056]">Tornar-se Prestador de Serviços</DialogTitle>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">Etapa {currentStep} de {totalSteps}</p>
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i + 1 <= currentStep ? "bg-[#FC9056]" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        </DialogHeader>
        <div className="mt-6">{renderStep()}</div>
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 bg-transparent">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>
          {currentStep === totalSteps ? (
            <Button onClick={onSubmit} disabled={isSubmitting} className="bg-[#FC9056] hover:bg-[#ff8340] text-white flex items-center gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          ) : (
            <Button onClick={nextStep} className="bg-[#FC9056] hover:bg-[#ff8340] text-white flex items-center gap-2">
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}