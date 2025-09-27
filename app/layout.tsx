// src/app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { Toaster } from "@/components/ui/sonner" // 1. Importar o Toaster
import { UserProvider } from "@/hooks/useUser"     // 2. Importar o UserProvider

export const metadata: Metadata = {
  title: "Tuk - Conectando você aos melhores profissionais",
  description:
    "A plataforma que revoluciona a forma como você encontra e contrata serviços. Agendamento fácil, avaliações confiáveis, pagamento seguro.",
  icons: {
    icon: "/logotipo_6.jpg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
          </UserProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}