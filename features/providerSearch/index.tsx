"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@/components/ui/dialog"
import BookingModal from "../appointments/BookingModal"
import SearchBar from "./SearchBar"
import ActiveFilters from "./ActiveFilters"
import ProviderCard from "./ProviderCard"
import FilterModal from "./FilterModal"
import NoResults from "./NoResults"
import Cookies from 'js-cookie'
import { Provider } from "@/types/Provider"
import { apiFetch } from "@/lib/api"

export interface Filters {
    specialty: string;
    nearMe: boolean;
    topRated: boolean;
    serviceType: string;
    showFavoritesOnly: boolean;
}

export default function ProviderSearch() {
    const router = useRouter()

    const [providers, setProviders] = useState<Provider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<Filters>({ specialty: "", nearMe: false, topRated: false, serviceType: "", showFavoritesOnly: false });
    const [appliedFilters, setAppliedFilters] = useState<Filters>({ specialty: "", nearMe: false, topRated: false, serviceType: "", showFavoritesOnly: false });

    // CORREÇÃO: Novo estado para rastrear o carregamento do favorito
    const [favoritingInProgress, setFavoritingInProgress] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchProviders = async () => {
            setIsLoading(true);
            setApiError(null);
            const token = Cookies.get('authToken');
            if (!token) {
                setApiError("Sessão inválida. Por favor, faça login novamente.");
                setIsLoading(false);
                return;
            }
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (appliedFilters.specialty) params.append('specialty', appliedFilters.specialty);
            if (appliedFilters.topRated) params.append('topRated', 'true');

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/provider?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Falha ao buscar prestadores.");
                }
                const data: Provider[] = await response.json();
                setProviders(data);
                const initialFavorites = new Set(data.filter(p => p.isFavorite).map(p => p.id));
                console.log("initialFavorites", initialFavorites)
                console.log("data", data)
                setFavorites(initialFavorites);
            } catch (error: any) {
                setApiError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchProviders();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, appliedFilters]);

    const specialties = [...new Set(providers.map(p => p.specialty).filter(Boolean) as string[])];
    const filteredProviders = providers.filter((provider) => {
        if (appliedFilters.showFavoritesOnly && !favorites.has(provider.id)) return false;
        return true;
    });

    const handleBookService = (provider: Provider, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedProvider(provider);
        setIsBookingModalOpen(true);
    };

    const handleBookingSuccess = () => {
        alert("Agendamento solicitado com sucesso!");
    };

    const handleProviderClick = (providerId: string) => {
        router.push(`/provider/${providerId}`);
    };

    const clearFilters = () => {
        const cleared = { specialty: "", nearMe: false, topRated: false, serviceType: "", showFavoritesOnly: appliedFilters.showFavoritesOnly };
        setAppliedFilters(cleared);
        setTempFilters(cleared);
    };

    const getActiveFiltersCount = () => {
        return Object.values(appliedFilters).filter(v => typeof v === 'boolean' ? v : !!v && v !== "all").length - (appliedFilters.showFavoritesOnly ? 1 : 0);
    };

    const removeFilter = (filterKey: keyof Filters) => {
        const newFilters = { ...appliedFilters, [filterKey]: typeof appliedFilters[filterKey] === 'boolean' ? false : "" };
        setAppliedFilters(newFilters);
        setTempFilters(newFilters);
    };

    const handleFavoriteClick = async (providerId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const token = Cookies.get('authToken');
        if (!token) {
            alert("Você precisa estar logado para favoritar.");
            return;
        }

        const originalFavorites = new Set(favorites);

        setFavoritingInProgress(prev => new Set(prev).add(providerId));

        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(providerId)) newFavs.delete(providerId);
            else newFavs.add(providerId);
            return newFavs;
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ providerId })
            });
            if (!response.ok) {
                setFavorites(originalFavorites);
                throw new Error("Falha ao atualizar favorito.");
            }
        } catch (error) {
            console.error(error);
            alert((error as Error).message);
        } finally {
            setFavoritingInProgress(prev => {
                const newSet = new Set(prev);
                newSet.delete(providerId);
                return newSet;
            });
        }
    };

    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        setIsFilterModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <div className="space-y-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        filters={appliedFilters}
                        onFilterChange={(key, value) => setAppliedFilters(prev => ({ ...prev, [key]: value }))}
                        activeFiltersCount={getActiveFiltersCount()}
                    />
                    <ActiveFilters
                        filters={appliedFilters}
                        onRemoveFilter={removeFilter}
                        onClearFilters={clearFilters}
                    />
                    {!isLoading && (
                        <div className="text-sm text-muted-foreground font-poppins">
                            {filteredProviders.length} prestador{filteredProviders.length !== 1 && "es"} encontrado{filteredProviders.length !== 1 && "s"}
                        </div>
                    )}
                </div>
                <FilterModal
                    filters={tempFilters}
                    onFiltersChange={setTempFilters}
                    specialties={specialties}
                    onApply={handleApplyFilters}
                    onClear={clearFilters}
                />
            </Dialog>

            {isLoading ? (
                <div className="text-center py-12">Carregando prestadores...</div>
            ) : apiError ? (
                <div className="text-center py-12 text-red-500">Erro ao buscar prestadores: {apiError}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProviders.map(provider => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                isFavorite={favorites.has(provider.id)}
                                // CORREÇÃO: Passa o estado de carregamento como prop
                                isFavoriting={favoritingInProgress.has(provider.id)}
                                onFavoriteClick={handleFavoriteClick}
                                onBookService={handleBookService}
                                onCardClick={handleProviderClick}
                            />
                        ))}
                    </div>
                    {filteredProviders.length === 0 && <NoResults onClearFilters={clearFilters} />}
                </>
            )}

            <BookingModal
                provider={selectedProvider}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onBookingSuccess={handleBookingSuccess}
            />
        </div>
    )
}