"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface NoResultsProps {
  onClearFilters: () => void
}

export default function NoResults({ onClearFilters }: NoResultsProps) {
  return (
    <div className="text-center py-12">
      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Nenhum prestador encontrado</h3>
      <p className="text-muted-foreground mb-4">Tente ajustar seus filtros ou termo de busca</p>
      <Button variant="outline" onClick={onClearFilters}>
        Limpar filtros
      </Button>
    </div>
  )
}