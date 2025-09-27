"use client"

import type { Filters } from "./index"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DialogTrigger } from "@/components/ui/dialog"
import { Search, Heart, SlidersHorizontal } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  filters: Filters
  onFilterChange: (key: keyof Filters, value: boolean) => void
  activeFiltersCount: number
}

export default function SearchBar({
  searchTerm,
  onSearchTermChange,
  filters,
  onFilterChange,
  activeFiltersCount,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant={filters.showFavoritesOnly ? "default" : "outline"}
        size="icon"
        className={`${filters.showFavoritesOnly ? "bg-red-500 hover:bg-red-600 text-white" : "bg-transparent hover:bg-muted"}`}
        onClick={() => onFilterChange("showFavoritesOnly", !filters.showFavoritesOnly)}
        aria-label="Filtrar favoritos"
      >
        <Heart className={`w-4 h-4 ${filters.showFavoritesOnly ? "fill-current" : ""}`} />
      </Button>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar prestadores ou serviços..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10 font-poppins"
        />
      </div>

      <DialogTrigger asChild>
        <Button variant="outline" className="relative bg-transparent font-poppins">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[#FC9056] text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
    </div>
  )
}