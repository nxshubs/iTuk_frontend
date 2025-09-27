"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function AuthHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img
              src="logotipo.png"
              alt="ConnectaServiços Logo (Modo Claro)"
              className="h-36 w-36 rounded-lg mr-3 block dark:hidden"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/144x144/ffffff/333333?text=Logo+1';
              }}
            />
            <img
              src="logotipo_2.png"
              alt="ConnectaServiços Logo (Modo Escuro)"
              className="h-36 w-36 rounded-lg mr-3 hidden dark:block"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/144x144/333333/ffffff?text=Logo+2';
              }}
            />
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
