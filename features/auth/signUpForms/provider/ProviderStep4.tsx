"use client";

import React from 'react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface ProviderStep4Props {
    formData: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    handleInputChange: (field: string, value: string) => void;
    errors: Record<string, string>;
}

export function ProviderStep4({
    formData,
    handleInputChange,
    errors
}: ProviderStep4Props) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Endereço de atendimento</h3>
                <p className="text-muted-foreground font-poppins">Onde você presta seus serviços.</p>
            </div>
            <div className="space-y-4 font-poppins">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="street">Rua *</Label>
                        <Input 
                            id="street" 
                            type="text" 
                            placeholder="Nome da rua" 
                            value={formData.street} 
                            onChange={(e) => handleInputChange('street', e.target.value)} 
                            required 
                        />
                        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="number">Número *</Label>
                        <Input 
                            id="number" 
                            type="text" 
                            placeholder="123" 
                            value={formData.number} 
                            onChange={(e) => handleInputChange('number', e.target.value)} 
                            required 
                        />
                        {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input 
                        id="complement" 
                        type="text" 
                        placeholder="Apartamento, sala, etc." 
                        value={formData.complement} 
                        onChange={(e) => handleInputChange('complement', e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input 
                        id="neighborhood" 
                        type="text" 
                        placeholder="Nome do bairro" 
                        value={formData.neighborhood} 
                        onChange={(e) => handleInputChange('neighborhood', e.target.value)} 
                        required 
                    />
                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input 
                            id="city" 
                            type="text" 
                            placeholder="Nome da cidade" 
                            value={formData.city} 
                            onChange={(e) => handleInputChange('city', e.target.value)} 
                            required 
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent className="font-poppins">
                                <SelectItem value="AC">AC</SelectItem>
                                <SelectItem value="AL">AL</SelectItem>
                                <SelectItem value="AP">AP</SelectItem>
                                <SelectItem value="AM">AM</SelectItem>
                                <SelectItem value="BA">BA</SelectItem>
                                <SelectItem value="CE">CE</SelectItem>
                                <SelectItem value="DF">DF</SelectItem>
                                <SelectItem value="ES">ES</SelectItem>
                                <SelectItem value="GO">GO</SelectItem>
                                <SelectItem value="MA">MA</SelectItem>
                                <SelectItem value="MT">MT</SelectItem>
                                <SelectItem value="MS">MS</SelectItem>
                                <SelectItem value="MG">MG</SelectItem>
                                <SelectItem value="PA">PA</SelectItem>
                                <SelectItem value="PB">PB</SelectItem>
                                <SelectItem value="PR">PR</SelectItem>
                                <SelectItem value="PE">PE</SelectItem>
                                <SelectItem value="PI">PI</SelectItem>
                                <SelectItem value="RJ">RJ</SelectItem>
                                <SelectItem value="RN">RN</SelectItem>
                                <SelectItem value="RS">RS</SelectItem>
                                <SelectItem value="RO">RO</SelectItem>
                                <SelectItem value="RR">RR</SelectItem>
                                <SelectItem value="SC">SC</SelectItem>
                                <SelectItem value="SP">SP</SelectItem>
                                <SelectItem value="SE">SE</SelectItem>
                                <SelectItem value="TO">TO</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="zipCode" 
                            type="text" 
                            placeholder="00000-000" 
                            value={formData.zipCode} 
                            onChange={(e) => handleInputChange('zipCode', e.target.value)} 
                            className="pl-10" 
                            required 
                        />
                    </div>
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
            </div>
        </div>
    );
}
