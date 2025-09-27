"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban, Loader2 } from "lucide-react"

// A interface foi simplificada para não necessitar mais de 'setBlockReason'
interface BlockDayModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  selectedDate: string
  onBlockDay: (reason?: string) => void
  isSaving: boolean
}

export function BlockDayModal({ 
  isOpen, 
  onOpenChange, 
  selectedDate, 
  onBlockDay, 
  isSaving
}: BlockDayModalProps) {
  // Estado local para gerir o motivo do bloqueio
  const [reason, setReason] = useState("");

  const handleBlock = () => {
    onBlockDay(reason || "Dia bloqueado"); // Passa o motivo ao clicar
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquear Dia</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Data Selecionada</label>
            <p className="text-sm text-gray-600">
              {selectedDate &&
                new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Motivo (opcional)</label>
            {/* O Select agora atualiza o estado local 'reason' */}
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feriado">Feriado</SelectItem>
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="compromisso">Compromisso pessoal</SelectItem>
                <SelectItem value="doenca">Doença</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isSaving}>
              Cancelar
            </Button>
            <Button 
              onClick={handleBlock} 
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Bloqueando...
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Bloquear Dia
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

