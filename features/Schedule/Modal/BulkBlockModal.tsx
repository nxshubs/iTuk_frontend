"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Ban, Loader2 } from "lucide-react"

interface BulkBlockModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  bulkStartDate: string
  setBulkStartDate: (date: string) => void
  bulkEndDate: string
  setBulkEndDate: (date: string) => void
  bulkReason: string
  setBulkReason: (reason: string) => void
  onBlockMultipleDays: () => void
  isBlocking: boolean // Nova propriedade para o estado de carregamento
}

export function BulkBlockModal({
  isOpen,
  onOpenChange,
  bulkStartDate,
  setBulkStartDate,
  bulkEndDate,
  setBulkEndDate,
  bulkReason,
  setBulkReason,
  onBlockMultipleDays,
  isBlocking, // Recebe o estado de carregamento
}: BulkBlockModalProps) {
  const handleClose = () => {
    onOpenChange(false)
    setBulkStartDate("")
    setBulkEndDate("")
    setBulkReason("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Evento - Bloquear Período
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block font-poppins">Data Inicial</label>
              <Input type="date" value={bulkStartDate} onChange={(e) => setBulkStartDate(e.target.value)} className="font-poppins" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block font-poppins">Data Final</label>
              <Input type="date" value={bulkEndDate} onChange={(e) => setBulkEndDate(e.target.value)} className="font-poppins" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block font-poppins">Motivo</label>
            <Select value={bulkReason} onValueChange={setBulkReason}>
              <SelectTrigger className="font-poppins">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent className="font-poppins">
                <SelectItem value="ferias">Férias</SelectItem>
                <SelectItem value="feriado">Feriado</SelectItem>
                <SelectItem value="compromisso">Compromisso pessoal</SelectItem>
                <SelectItem value="viagem">Viagem</SelectItem>
                <SelectItem value="evento">Evento especial</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {bulkStartDate && bulkEndDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-poppins">
                <strong>Período selecionado:</strong> {new Date(bulkStartDate).toLocaleDateString("pt-BR")} até{" "}
                {new Date(bulkEndDate).toLocaleDateString("pt-BR")}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-poppins">
                Dias com agendamentos existentes não serão bloqueados.
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1 font-poppins" disabled={isBlocking}>
              Cancelar
            </Button>
            <Button
              onClick={onBlockMultipleDays}
              className="flex-1 bg-[#FC9056] hover:bg-[#ff8340] font-poppins"
              disabled={!bulkStartDate || !bulkEndDate || isBlocking}
            >
              {isBlocking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Bloqueando...
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Bloquear Período
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

