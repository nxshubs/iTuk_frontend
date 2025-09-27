"use client";

import React from 'react';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface ClientStep1Props {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
    };
    handleInputChange: (field: string, value: string) => void;
    errors: Record<string, string>;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
}


export function ClientStep1({
    formData,
    handleInputChange,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
}: ClientStep1Props) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                    Criar conta de Cliente
                </h3>
                <p className="text-muted-foreground font-poppins">
                    Primeiro, seus dados de acesso.
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        <p className="font-poppins">E-mail *</p>
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 font-poppins"
                            required
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1 font-poppins">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">
                        <p className="font-poppins">Senha *</p>
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10 font-poppins"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1 font-poppins">
                            {errors.password}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                        <p className="font-poppins">Confirmar Senha *</p>
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                handleInputChange("confirmPassword", e.target.value)
                            }
                            className="pl-10 pr-10 font-poppins"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 font-poppins">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
