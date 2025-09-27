"use client"

import type React from "react"
import type { Filters } from "./index"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter } from "lucide-react"

interface FilterModalProps {
  filters: Filters
  onFiltersChange: React.Dispatch<React.SetStateAction<Filters>>
  specialties: string[]
  onApply: () => void
  onClear: () => void
}

export default function FilterModal({ filters, onFiltersChange, specialties, onApply, onClear }: FilterModalProps) {
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value).length;
  }

  return (
    <DialogContent className="max-w-md font-poppins">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-sans">
          <Filter className="w-5 h-5" />
          Filtros de Busca
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Especialidade</label>
          <Select value={filters.specialty} onValueChange={(value) => onFiltersChange(prev => ({ ...prev, specialty: value === "all" ? "" : value }))}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              <SelectItem value="Limpeza Residencial">Limpeza Residencial</SelectItem>
              <SelectItem value="Limpeza Comercial">Limpeza Comercial</SelectItem>
              <SelectItem value="Limpeza Profunda">Limpeza Profunda</SelectItem>
              <SelectItem value="Jardinagem">Jardinagem</SelectItem>
              <SelectItem value="Manutenção Elétrica">Manutenção Elétrica</SelectItem>
              <SelectItem value="Encanamento">Encanamento</SelectItem>
              <SelectItem value="Pintura">Pintura</SelectItem>
              <SelectItem value="Manicure/Pedicure">Manicure/Pedicure</SelectItem>
              <SelectItem value="Cabeleireiro">Cabeleireiro</SelectItem>
              <SelectItem value="Massagem">Massagem</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="topRated" checked={filters.topRated} onCheckedChange={(c) => onFiltersChange(p => ({ ...p, topRated: c as boolean }))} />
          <label htmlFor="topRated" className="text-sm font-medium cursor-pointer">Melhores avaliações (4.7+)</label>
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClear} className="flex-1 bg-transparent" disabled={getActiveFiltersCount() === 0}>Limpar</Button>
          <Button onClick={onApply} className="flex-1 bg-[#FC9056] hover:bg-[#ff8340]">Aplicar</Button>
        </div>
      </div>
    </DialogContent>
  )
}