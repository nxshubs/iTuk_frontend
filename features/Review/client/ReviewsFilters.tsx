"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReviewsFiltersProps {
  filters: {
    ratingFilter: string;
    dateFilter: string;
    specialtyFilter: string;
  };
  setFilters: {
    setRatingFilter: (value: string) => void;
    setDateFilter: (value: string) => void;
    setSpecialtyFilter: (value: string) => void;
  };
  uniqueSpecialties: string[];
  clearFilters: () => void;
}

export default function ReviewsFilters({ filters, setFilters, uniqueSpecialties, clearFilters }: ReviewsFiltersProps) {
  const showClearButton = filters.ratingFilter !== "all" || filters.dateFilter !== "all" || filters.specialtyFilter !== "all";

  return (
    <div className="animate-slide-in-from-bottom animation-delay-300">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6 font-poppins">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Filtrar por período:</label>
                <Select value={filters.dateFilter} onValueChange={setFilters.setDateFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Filtrar por especialidade:</label>
                <Select value={filters.specialtyFilter} onValueChange={setFilters.setSpecialtyFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as especialidades</SelectItem>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {showClearButton && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters} className="hover:bg-[#FC9056] hover:text-white">
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}