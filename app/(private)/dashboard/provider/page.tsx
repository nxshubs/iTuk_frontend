"use client"

import SidebarMenu from "@/components/shared/SidebarMenu"
import DashboardHeader from "@/components/shared/DashboardHeader"
import { ScheduleManagement } from "@/features/Schedule"
import { useState } from "react"

export default function ProviderDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      <SidebarMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main content with left margin for sidebar */}
      <div className="md:ml-64">
        <DashboardHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="opacity-0 animate-fade-in-up">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Meus Horários</h1>
              <p className="text-muted-foreground text-lg font-poppins">Gerencie sua disponibilidade e horários de atendimento</p>
            </div>
            <div className="opacity-0 animate-fade-in-up animation-delay-200">
              <ScheduleManagement />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
