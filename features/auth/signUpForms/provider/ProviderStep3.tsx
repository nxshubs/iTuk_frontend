"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";

interface ProviderStep3Props {
    formData: {
        services: string[];
        otherService: string;
        prices: Record<string, string>;
        paymentMethods: string[];
        bio: string;
    };
    handleInputChange: (field: string, value: any) => void;
    toggleArrayItem: (field: 'services' | 'paymentMethods', item: string) => void;
    errors: Record<string, any>;
}

const availableServices = [
    "Limpeza Residencial", "Limpeza Comercial", "Jardinagem", "Manutenção Elétrica",
    "Encanamento", "Pintura", "Manicure/Pedicure", "Cabeleireiro", "Massagem",
    "Personal Trainer", "Aulas Particulares", "Cuidador de Idosos", "Outro"
];
const paymentOptions = ["Dinheiro", "PIX", "Cartão de Débito", "Cartão de Crédito"];


export function ProviderStep3({
    formData,
    handleInputChange,
    toggleArrayItem,
    errors
}: ProviderStep3Props) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Serviços e preços</h3>
                <p className="text-muted-foreground font-poppins">Configure o que você oferece.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2 font-poppins">
                    <Label>Serviços oferecidos *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableServices.map((service) => (
                            <div 
                                key={service} 
                                onClick={() => toggleArrayItem('services', service)} 
                                className={`cursor-pointer p-3 rounded-lg border text-sm transition-all flex items-center justify-center text-center ${formData.services.includes(service) ? "bg-[#FC9056] text-white border-[#FC9056]" : "bg-background border-border hover:bg-muted/50"}`}
                            >
                                {service}
                            </div>
                        ))}
                    </div>
                    {errors.services && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.services}</p>}
                </div>

                {formData.services.includes('Outro') && (
                    <div className="space-y-2 pt-2 font-poppins">
                        <Label htmlFor="other-service">Se outro, qual? *</Label>
                        <Textarea 
                            id="other-service" 
                            placeholder="Ex: Montador de móveis..." 
                            value={formData.otherService} 
                            onChange={(e) => handleInputChange('otherService', e.target.value)} 
                            required 
                        />
                        {errors.otherService && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.otherService}</p>}
                    </div>
                )}

                {formData.services.filter(s => s !== 'Outro').length > 0 && (
                    <div className="space-y-2 pt-2 font-poppins">
                        <Label>Preços (por hora/serviço) *</Label>
                        <div className="space-y-3">
                            {formData.services.filter(s => s !== 'Outro').map((service) => (
                                <div key={service} className="flex items-center space-x-3">
                                    <div className="flex-1"><Label className="text-sm font-normal">{service}</Label></div>
                                    <div className="relative w-32">
                                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            type="text" 
                                            placeholder="0,00" 
                                            value={formData.prices[service] || ""} 
                                            onChange={(e) => handleInputChange('prices', { ...formData.prices, [service]: e.target.value })} 
                                            className="pl-9" 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.prices && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.prices}</p>}
                    </div>
                )}

                <div className="space-y-2 font-poppins">
                    <Label>Formas de pagamento *</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {paymentOptions.map((method) => (
                            <div 
                                key={method} 
                                onClick={() => toggleArrayItem('paymentMethods', method)} 
                                className={`cursor-pointer p-3 rounded-lg border text-sm transition-all ${formData.paymentMethods.includes(method) ? "bg-[#FC9056] text-white border-[#FC9056]" : "bg-background border-border hover:bg-muted/50"}`}
                            >
                                {method}
                            </div>
                        ))}
                    </div>
                    {errors.paymentMethods && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.paymentMethods}</p>}
                </div>
                
                <div className="space-y-2 font-poppins">
                    <Label htmlFor="bio">Descrição profissional (opcional)</Label>
                    <Textarea 
                        id="bio" 
                        placeholder="Conte sobre sua experiência e diferenciais..." 
                        value={formData.bio} 
                        onChange={(e) => handleInputChange('bio', e.target.value)} 
                        rows={4} 
                    />
                </div>
            </div>
        </div>
    );
}
