"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export function ResetPasswordForm() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setToken(params.get("token"))
  }, [])

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "A senha deve ter no mínimo 8 caracteres"
    if (!/[A-Z]/.test(pass)) return "A senha deve conter pelo menos uma letra maiúscula"
    if (!/[a-z]/.test(pass)) return "A senha deve conter pelo menos uma letra minúscula"
    if (!/[0-9]/.test(pass)) return "A senha deve conter pelo menos um número"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (!token) {
      setError("Token inválido ou expirado")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Não foi possível redefinir a senha. O link pode ter expirado.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-xl border-none shadow-none">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Link Inválido</CardTitle>
          <CardDescription className="text-center font-poppins">
            Este link de redefinição de senha é inválido ou expirou.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/forgot-password" style={{ textDecoration: 'none' }}>
            <Button className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white font-poppins">
              Solicitar Novo Link
            </Button>
          </a>
        </CardContent>
      </Card>
    )
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
          <CardTitle className="text-2xl font-bold text-center">Senha Redefinida!</CardTitle>
          <CardDescription className="text-center font-poppins">Sua senha foi alterada com sucesso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-center font-poppins">Você já pode fazer login com sua nova senha.</p>
          </div>
          <a href="/login" style={{ textDecoration: 'none' }}>
            <Button className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white font-poppins">Ir para o Login</Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Nova Senha</CardTitle>
        <CardDescription className="text-center font-poppins">Digite sua nova senha abaixo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-center text-red-600 dark:text-red-400 text-sm font-poppins">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">
              <p className="font-poppins">Nova Senha</p>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[#FC9056]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 font-poppins"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-poppins">
              Mínimo 8 caracteres, com letras maiúsculas, minúsculas e números.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              <p className="font-poppins">Confirmar Senha</p>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-[#FC9056]" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 font-poppins"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FC9056] hover:bg-[#fd813f] text-white font-poppins"
            disabled={isLoading}
          >
            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>

        <div className="text-center">
          <a href="/login" className="text-sm text-muted-foreground hover:text-[#FC9056] font-poppins">
            Voltar para o login
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export { ResetPasswordForm as default }

