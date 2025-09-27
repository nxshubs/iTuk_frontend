"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock } from "lucide-react"

export default function SubscriptionForm() {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate payment processing
    alert("Pagamento processado com sucesso! Bem-vindo ao Plano Premium!")
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          Pagamento seguro e criptografado
        </div>
      </div>

      <div>
        <Label htmlFor="cardName">Nome no cartão</Label>
        <Input
          id="cardName"
          type="text"
          required
          value={formData.cardName}
          onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
          placeholder="João Silva"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="cardNumber">Número do cartão</Label>
        <div className="relative mt-1">
          <Input
            id="cardNumber"
            type="text"
            required
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="pl-10"
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Validade</Label>
          <Input
            id="expiryDate"
            type="text"
            required
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
            placeholder="MM/AA"
            maxLength={5}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVC</Label>
          <Input
            id="cvv"
            type="text"
            required
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
            placeholder="123"
            maxLength={4}
            className="mt-1"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Plano Premium (mensal)</span>
          <span className="font-semibold">R$ 9,90</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-[#FC9056]">R$ 9,90</span>
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#FC9056] hover:bg-[#ff8340] text-white py-3 text-lg">
        Assinar Agora - R$ 9,90/mês
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade. Você pode cancelar a qualquer
        momento.
      </p>
    </form>
  )
}
