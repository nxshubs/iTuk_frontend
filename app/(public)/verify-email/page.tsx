"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthHeader from '@/components/shared/AuthHeader';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';


function VerifyEmailComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailFromStorage = localStorage.getItem('emailForVerification');
    const emailFromUrl = searchParams.get('email');
    const userEmail = emailFromUrl || emailFromStorage;

    if (userEmail) {
      setEmail(userEmail);
    } else {
      setError("Não foi possível encontrar o e-mail para verificação. Por favor, tente se registrar novamente.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Por favor, insira o código completo de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Código inválido ou expirado.');
      }

      localStorage.setItem('authToken', result.token);
      localStorage.removeItem('emailForVerification');

      console.log("result:", result)
      console.log("result.user:", result.user)
      console.log("result.user.isProfileComplete:", result.user.isProfileComplete)

      if (result.user.isProfileComplete) {
        const dashboardUrl = result.user.role === 'PROVIDER' ? '/dashboard/provider' : '/dashboard/client';
        router.push(dashboardUrl);
      } else {
        router.push('/complete-profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Não há um e-mail para reenviar o código.");
      return;
    }
    setIsResending(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Falha ao reenviar o código.");
      }

      setCountdown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="flex mt-8 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-[#FC9056] hover:text-[#FC9056] hover:bg-[#FC9056]/10 font-poppins cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Card className="border-1 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-[#FC9056]/20 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-[#FC9056]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Verifique seu e-mail
              </CardTitle>
              <CardDescription className="text-gray-600 font-poppins dark:text-gray-400">
                Enviamos um código de 6 dígitos para <strong>{email}</strong>. Digite-o abaixo para continuar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el: any) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="0"
                  />
                ))}
              </div>
              {error && (
                <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <Button onClick={handleVerify} disabled={isLoading || code.join('').length !== 6} className="w-full bg-[#FC9056] hover:bg-[#ff803c] text-white py-3 text-lg font-semibold cursor-pointer">
                {isLoading ? (
                  <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
                ) : (
                  'Verificar Código'
                )}
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 font-poppins dark:text-gray-400">Não recebeu o código?</p>
                <Button variant="ghost" onClick={handleResendCode} disabled={isResending || countdown > 0} className="text-[#FC9056] hover:text-[#FC9056] hover:bg-[#FC9056]/10 font-poppins cursor-pointer">
                  {isResending ? (
                    <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Reenviando...</>
                  ) : countdown > 0 ? (
                    `Reenviar em ${countdown}s`
                  ) : (
                    'Reenviar código'
                  )}
                </Button>
              </div>
              <div className="text-center text-xs text-gray-500">
                <p className='font-poppins dark:text-gray-400'>
                  Verifique também sua pasta de spam ou lixo eletrônico.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  )
}