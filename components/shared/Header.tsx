"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Função para fechar o menu ao clicar em um link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
        }`}
    >
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="font-poppins text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#pricing" className="font-poppins text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#faq" className="font-poppins text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-poppins cursor-pointer">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#FC9056] hover:bg-[#f57733] cursor-pointer transition-all duration-300 text-white shadow-lg hover:shadow-[#FC9056]/40 font-poppins">
                Cadastre-se
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Abrir menu</span>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md font-poppins">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                Recursos
              </a>
              <a href="#how-it-works" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                Como Funciona
              </a>
              <a href="#pricing" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                Preços
              </a>
              <a href="#faq" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
                FAQ
              </a>
              <div className="flex flex-col space-y-2 px-3 pt-4 border-t border-border">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMobileMenu}>
                  <Button className="w-full bg-[#FC9056] hover:bg-[#f57733] transition-all duration-300 cursor-pointer text-white">
                    Cadastre-se
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
