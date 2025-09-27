"use client"

import type { Filters } from "./index"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ActiveFiltersProps {
  filters: Filters
  onRemoveFilter: (filterKey: keyof Filters) => void
  onClearFilters: () => void
}

export default function ActiveFilters({ filters, onRemoveFilter, onClearFilters }: ActiveFiltersProps) {
  const getActiveFiltersBadges = () => {
    const badges: { key: keyof Filters; label: string }[] = []
    if (filters.specialty) badges.push({ key: "specialty", label: filters.specialty })
    if (filters.nearMe) badges.push({ key: "nearMe", label: "Perto de mim" })
    if (filters.topRated) badges.push({ key: "topRated", label: "Melhores avaliações" })
    if (filters.serviceType) {
      const typeLabels = { local: "Atendimento local", domicilio: "A domicílio", ambos: "Local e domicílio" }
      badges.push({ key: "serviceType", label: typeLabels[filters.serviceType as keyof typeof typeLabels] || filters.serviceType })
    }
    return badges
  }

  const activeBadges = getActiveFiltersBadges();

  if (activeBadges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center font-poppins">
      <span className="text-sm text-muted-foreground">Filtros ativos:</span>
      {activeBadges.map((b) => (
        <Badge
          key={b.key}
          variant="secondary"
          className="flex items-center gap-1 bg-[#FC9056]/10 text-[#FC9056] hover:bg-[#FC9056]/20"
        >
          {b.label}
          <X className="w-3 h-3 cursor-pointer" onClick={() => onRemoveFilter(b.key)} />
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
        Limpar todos
      </Button>
    </div>
  )
}