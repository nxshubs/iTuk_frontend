"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Cookies from 'js-cookie';
import { apiFetch } from "@/lib/api"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("API Login Response:", data);

      if (!response.ok) {
        if (data.error && data.error.includes('verifique seu e-mail')) {
          localStorage.setItem('emailForVerification', email);
          window.location.href = `/verify-email?email=${email}`;
          return;
        }
        throw new Error(data.error || "Falha ao fazer login.");
      }

      Cookies.set('authToken', data.token, { expires: 1, path: '/' });
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.isProfileComplete) {
        if (data.user.role === 'PROVIDER') {
          window.location.href = "/dashboard/provider";
        } else {
          window.location.href = "/dashboard/client";
        }
      } else {
        window.location.href = "/complete-profile";
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'google') {
      window.location.href = `${API_BASE_URL}/api/auth/google`;
    }
  };

  return (
    <Card className="w-full max-w-xl border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
        <CardDescription className="text-center font-poppins">
          Entre com sua conta para continuar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              <p className="font-poppins">E-mail</p>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-[#FC9056]" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 font-poppins"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              <p className="font-poppins">Senha</p>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[#FC9056]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-sm text-[#FC9056] hover:underline font-poppins">
              Esqueceu a senha?
            </a>
          </div>
          <Button type="submit" className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white cursor-pointer font-poppins" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-poppins">
              Ou continue com
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <Button type="button" variant="outline" className="w-full h-11 border-2 font-poppins cursor-pointer" onClick={() => handleSocialLogin('google')}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continuar com Google
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground font-poppins">
          Ou{" "}
          <Link href="/signup" className="font-medium text-[#FC9056] hover:text-[#ff3a20] font-poppins">
            crie uma nova conta
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

