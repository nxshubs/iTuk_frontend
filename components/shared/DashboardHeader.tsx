"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { Search, Settings, User, LogOut, Menu, Repeat } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useUser } from "@/hooks/useUser"
import { apiFetch } from "@/lib/api"

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({ onMobileMenuToggle }: DashboardHeaderProps) {
  const { user, isLoading, refetchUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isSwitching, setIsSwitching] = useState(false);

  const roleFromPath = pathname.includes('/provider') ? 'PROVIDER' : 'CLIENT';

  const handleLogout = () => {
    Cookies.remove('authToken');
    router.push('/login');
    toast.info("Você foi desconectado.");
  };

  const handleSwitchRole = async () => {
    setIsSwitching(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/switch-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível trocar de perfil.");
      }

      await refetchUser();
      const updatedUser = await response.json();
      const newActiveRole = updatedUser.activeRole.toLowerCase();
      router.push(`/dashboard/${newActiveRole}`);
      toast.success(`Você agora está no painel de ${newActiveRole === 'provider' ? 'Prestador' : 'Cliente'}.`);

    } catch (error: any) {
      console.error("Erro ao trocar de perfil:", error);
      toast.error(error.message || "Erro ao trocar de perfil.");
    } finally {
      setIsSwitching(false);
    }
  };

  const profileLink = `/dashboard/${roleFromPath.toLowerCase()}/profile`;
  const settingsLink = `/dashboard/${roleFromPath.toLowerCase()}/settings`;
  const userNameInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMobileMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="font-bold text-lg bg-gradient-to-r from-[#FC9056] to-[#ff8340] bg-clip-text text-transparent">
                {roleFromPath === "PROVIDER" ? "Dashboard de Prestador" : "Dashboard de Cliente"}
              </span>
            )}
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoUrl || ''} alt={user?.name || 'Usuário'} />
                  <AvatarFallback className="bg-gradient-to-br from-[#FC9056] to-[#ffab7d] text-white">
                    {userNameInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 font-poppins" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {roleFromPath === "PROVIDER" ? "Prestador de Serviços" : "Cliente"}
                    </p>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={profileLink} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={settingsLink} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              {user?.role === 'PROVIDER' && (
                <DropdownMenuItem onClick={handleSwitchRole} disabled={isSwitching} className="cursor-pointer">
                  <Repeat className="mr-2 h-4 w-4" />
                  <span>
                    {isSwitching
                      ? "Trocando..."
                      : `Mudar para ${user?.activeRole === 'PROVIDER' ? 'Cliente' : 'Prestador'}`
                    }
                  </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}