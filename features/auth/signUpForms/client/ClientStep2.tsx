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
import { User, Calendar, Phone } from "lucide-react";
import { ProfilePhotoUploader } from "../../ProfilePhotoUploader";

interface ClientStep2Props {
    formData: {
        name: string;
        birthDate: string;
        gender: string;
        whatsapp: string;
    };
    handleInputChange: (field: string, value: string) => void;
    errors: Record<string, string>;
    previewUrl: string | null;
    handleFileSelect: (file: File) => void;
    handleRemovePhoto: () => void;
}


export function ClientStep2({
    formData,
    handleInputChange,
    errors,
    previewUrl,
    handleFileSelect,
    handleRemovePhoto
}: ClientStep2Props) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                    Dados pessoais
                </h3>
                <p className="text-muted-foreground font-poppins">
                    Complete seu perfil para continuar.
                </p>
            </div>
            <div className="space-y-4">
                <ProfilePhotoUploader
                    previewUrl={previewUrl}
                    onFileSelect={handleFileSelect}
                    onRemovePhoto={handleRemovePhoto}
                />
                {errors.profilePhoto && (
                    <p className="text-red-500 text-xs text-center font-poppins">
                        {errors.profilePhoto}
                    </p>
                )}

                <div className="space-y-2 font-poppins">
                    <Label htmlFor="name">Nome completo *</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome completo"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="pl-10 font-poppins"
                            required
                        />
                    </div>
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1 font-poppins">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 font-poppins">
                        <Label htmlFor="birthDate">Data de nascimento *</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                                className="pl-10 font-poppins"
                                required
                            />
                        </div>
                        {errors.birthDate && (
                            <p className="text-red-500 text-xs mt-1 font-poppins">
                                {errors.birthDate}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2 font-poppins">
                        <Label htmlFor="gender">Sexo *</Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => handleInputChange("gender", value)}
                        >
                            <SelectTrigger className="font-poppins">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="font-poppins">
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="feminino">Feminino</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                                <SelectItem value="nao-informar">
                                    Prefiro não informar
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && (
                            <p className="text-red-500 text-xs mt-1 font-poppins">
                                {errors.gender}
                            </p>
                        )}
                    </div>
                </div>
                <div className="space-y-2 font-poppins">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="whatsapp"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.whatsapp}
                            onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                            className="pl-10 font-poppins"
                            required
                        />
                    </div>
                    {errors.whatsapp && (
                        <p className="text-red-500 text-xs mt-1 font-poppins">
                            {errors.whatsapp}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
