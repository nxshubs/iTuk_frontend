"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Clock, Star, Search, User, Settings, X, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/useUser"

interface SidebarMenuProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function SidebarMenu({ isOpen = true, onClose }: SidebarMenuProps) {
  const pathname = usePathname()
  const { user, isLoading } = useUser();

  const roleFromPath = pathname.includes('/provider') ? 'PROVIDER' : 'CLIENT';
  

  const providerMenuItems = [
    { href: "/dashboard/provider", label: "Meus Horários", icon: Clock },
    { href: "/dashboard/provider/requests", label: "Solicitações", icon: Inbox },
    { href: "/dashboard/provider/appointments", label: "Agendamentos", icon: Calendar },
    { href: "/dashboard/provider/reviews", label: "Avaliações", icon: Star },
    { href: "/dashboard/provider/profile", label: "Meu Perfil", icon: User },
    { href: "/dashboard/provider/settings", label: "Configurações", icon: Settings },
  ]

  const clientMenuItems = [
    { href: "/dashboard/client", label: "Encontrar Prestadores", icon: Search },
    { href: "/dashboard/client/appointments", label: "Meus Agendamentos", icon: Calendar },
    { href: "/dashboard/client/reviews", label: "Minhas Avaliações", icon: Star },
    { href: "/dashboard/client/profile", label: "Meu Perfil", icon: User },
    { href: "/dashboard/client/settings", label: "Configurações", icon: Settings },
  ]

  const menuItems = roleFromPath === "PROVIDER" ? providerMenuItems : clientMenuItems

  return (
    <>
      <div className={cn("fixed inset-0 bg-black/50 z-40 md:hidden", isOpen ? "block" : "hidden")} onClick={onClose} />
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 w-64 h-screen bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 bg-background",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* LOGO MOBILE */}
          <div className="flex items-center justify-between px-2 border-b border-border md:hidden h-[65px]">
            <div className="h-22 w-22">
              <img
                src="/logotipo.png"
                alt="ConnectaServiços Logo"
                className="w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/128x32/ffffff/333333?text=Logo';
                }}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* LOGO DESKTOP */}
          <div className="hidden md:flex items-center gap-2 p-6 border-b border-border justify-center h-[65px]">
            <Link href="/" className="flex items-center">
              <img
                src="/logotipo.png"
                alt="ConnectaServiços Logo (Modo Claro)"
                className="h-36 w-36 rounded-lg mr-3 block dark:hidden"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/144x144/ffffff/333333?text=Logo+1';
                }}
              />
              <img
                src="/logotipo_2.png"
                alt="ConnectaServiços Logo (Modo Escuro)"
                className="h-36 w-36 rounded-lg mr-3 hidden dark:block"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/144x144/333333/ffffff?text=Logo+2';
                }}
              />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex-1 px-4 py-6 space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-[52px] w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item, index) => {
                const isDashboardRoot = item.href === "/dashboard/provider" || item.href === "/dashboard/client";
                const isActive = isDashboardRoot
                  ? pathname === item.href
                  : pathname.startsWith(item.href) && item.href.length > pathname.split('/')[0].length + pathname.split('/')[1].length + 2;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-[#FC9056] to-[#ffac7f] text-white shadow-lg shadow-[#FC9056]/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      "font-poppins"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 mr-3 transition-transform duration-200",
                        isActive ? "scale-110" : "group-hover:scale-105",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50">
              {isLoading ? (
                <>
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </>
              ) : (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.photoUrl || ''} alt={user?.name || 'Usuário'} />
                    <AvatarFallback className="bg-gradient-to-br from-[#FC9056] to-[#ffab7f] text-white">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 font-poppins">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {roleFromPath === "PROVIDER" ? "Prestador" : "Cliente"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}