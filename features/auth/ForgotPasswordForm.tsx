"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
// A importação do 'Link' foi removida temporariamente para resolver um erro de compilação.
// No seu projeto Next.js, você deve usar 'import Link from "next/link"'.

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Conexão com a sua API. Ajuste a URL se necessário.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocorreu um erro. Verifique o e-mail e tente novamente.');
      }

      setIsSuccess(true);

    } catch (err: any) { // <-- Erro corrigido aqui
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-xl border-none shadow-none">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">E-mail Enviado!</CardTitle>
          <CardDescription className="text-center font-poppins">
            Enviamos um link de redefinição de senha para <span className="font-semibold">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-center font-poppins">
              Verifique sua caixa de entrada (e a pasta de spam) e siga as instruções para criar uma nova senha.
            </p>
          </div>
          {/* O componente Link foi substituído por uma tag 'a' para corrigir a compilação.
              No seu projeto, o ideal é usar: <Link href="/login" asChild> */}
          <a href="/login" style={{ textDecoration: 'none' }}>
            <Button className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white font-poppins">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Login
            </Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Redefinir Senha</CardTitle>
        <CardDescription className="text-center font-poppins">
          Digite seu e-mail para receber um link de redefinição de senha.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

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

          <Button
            type="submit"
            className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white font-poppins"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Link de Redefinição"}
          </Button>
        </form>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-muted-foreground hover:text-[#FC9056] font-poppins inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar para o login
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export { ForgotPasswordForm as default }

