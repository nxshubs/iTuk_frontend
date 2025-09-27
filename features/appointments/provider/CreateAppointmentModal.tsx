"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, MapPin, DollarSign, FileText, CreditCard } from "lucide-react"

interface CreateAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  selectedTime: string | null
  onCreateAppointment: (appointment: any) => void
}

export default function CreateAppointmentModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onCreateAppointment,
}: CreateAppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    service: "",
    duration: "",
    price: "",
    location: "",
    notes: "",
    paymentMethod: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [endTime, setEndTime] = useState("")

  const services = [
    { value: "limpeza-residencial", label: "Limpeza Residencial" },
    { value: "limpeza-profunda", label: "Limpeza Profunda" },
    { value: "limpeza-geral", label: "Limpeza Geral" },
    { value: "organizacao", label: "Organização" },
    { value: "limpeza-pos-obra", label: "Limpeza Pós-Obra" },
    { value: "limpeza-pos-festa", label: "Limpeza Pós-Festa" },
  ]

  const durations = [
    { value: "30", label: "30 minutos" },
    { value: "60", label: "1 hora" },
    { value: "90", label: "1h 30min" },
    { value: "120", label: "2 horas" },
    { value: "150", label: "2h 30min" },
    { value: "180", label: "3 horas" },
    { value: "210", label: "3h 30min" },
    { value: "240", label: "4 horas" },
  ]

  const paymentMethods = [
    { value: "credito", label: "Cartão de Crédito" },
    { value: "debito", label: "Cartão de Débito" },
    { value: "pix", label: "PIX" },
    { value: "dinheiro", label: "Dinheiro" },
  ]

  useEffect(() => {
    if (selectedTime && formData.duration) {
      const [hours, minutes] = selectedTime.split(":").map(Number)
      const durationMinutes = Number.parseInt(formData.duration)
      const endMinutes = hours * 60 + minutes + durationMinutes
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      setEndTime(`${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`)
    }
  }, [selectedTime, formData.duration])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.clientName.trim()) newErrors.clientName = "Nome do cliente é obrigatório"
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!formData.service) newErrors.service = "Tipo de serviço é obrigatório"
    if (!formData.duration) newErrors.duration = "Duração é obrigatória"
    if (!formData.price.trim()) newErrors.price = "Preço é obrigatório"
    if (!formData.paymentMethod) newErrors.paymentMethod = "Forma de pagamento é obrigatória"
    if (!formData.location.trim()) newErrors.location = "Endereço é obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const newAppointment = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      service: services.find((s) => s.value === formData.service)?.label || formData.service,
      date: selectedDate?.toISOString().split("T")[0] || "",
      time: selectedTime || "",
      endTime: endTime,
      status: "upcoming" as const,
      price: formData.price.startsWith("R$") ? formData.price : `R$ ${formData.price}`,
      phone: formData.phone,
      email: formData.email,
      location: formData.location,
      notes: formData.notes,
      duration: durations.find((d) => d.value === formData.duration)?.label || formData.duration,
      paymentMethod: formData.paymentMethod,
      whatsapp: formData.phone, // Assuming whatsapp is the same as phone for now
    }

    onCreateAppointment(newAppointment)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      clientName: "",
      phone: "",
      email: "",
      service: "",
      duration: "",
      price: "",
      location: "",
      notes: "",
      paymentMethod: "",
    })
    setErrors({})
    setEndTime("")
    onClose()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Criar Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedDate && selectedTime && (
            <div className="bg-muted/50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#FC9056]" />
                <span className="font-semibold text-foreground">Data e Horário</span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">{formatDate(selectedDate)}</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Início: {selectedTime}</span>
                </div>
                {endTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Término: {endTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-[#FC9056]" />
              <span className="font-semibold text-foreground">Informações do Cliente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium">Nome Completo *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Digite o nome do cliente"
                  className={errors.clientName ? "border-red-500" : ""}
                />
                {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-[#FC9056]" />
              <span className="font-semibold text-foreground">Detalhes do Serviço</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service" className="text-sm font-medium">Tipo de Serviço *</Label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                  <SelectTrigger className={errors.service ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium">Duração *</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className={errors.duration ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione a duração" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>{duration.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium">Preço *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="120,00"
                    className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="paymentMethod" className="text-sm font-medium">Forma de Pagamento *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                  <SelectTrigger className={errors.paymentMethod ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium">Endereço *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Rua, número - Bairro"
                  className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Informações adicionais sobre o serviço..."
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
